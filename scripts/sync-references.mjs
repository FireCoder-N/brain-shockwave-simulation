#!/usr/bin/env node
/**
 * Sync references/references.bib with the PDFs in references/papers/ (local, gitignored).
 *
 * For every PDF not yet linked from the bibliography (via its `file` field):
 *   1. Extract a DOI from the PDF metadata or its first pages.
 *   2. Fetch BibTeX for that DOI from doi.org (Crossref / DataCite).
 *   3. Append the entry (normalized citation key + `file` field) to references.bib.
 *   4. Create references/notes/<key>.md from a template if it doesn't exist.
 * If no DOI is found (or offline), a @misc stub marked TODO is added instead.
 *
 * Usage:  npm run refs:sync            apply changes
 *         npm run refs:check           dry run, report only
 *         npm run refs:sync -- --offline   skip network lookups
 */
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractDoi,
  makeCiteKey,
  noteTemplate,
  parseEntries,
  serializeEntry,
} from './lib/bibtex.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REFS = path.join(ROOT, 'references');
const PAPERS = path.join(REFS, 'papers');
const NOTES = path.join(REFS, 'notes');
const BIB = path.join(REFS, 'references.bib');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const OFFLINE = args.has('--offline');

/** Recursively list PDFs under a directory, as paths relative to it (POSIX separators). */
async function listPdfs(dir, prefix = '') {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${d.name}` : d.name;
    if (d.isDirectory()) out.push(...(await listPdfs(path.join(dir, d.name), rel)));
    else if (d.name.toLowerCase().endsWith('.pdf')) out.push(rel);
  }
  return out.sort();
}

/** Metadata + text of the first pages, enough to find a DOI. */
async function pdfText(file) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(await readFile(file));
  const task = pdfjs.getDocument({ data, verbosity: 0, isEvalSupported: false });
  try {
    const doc = await task.promise;
    const meta = await doc.getMetadata().catch(() => null);
    let text = JSON.stringify(meta?.info ?? {});
    if (meta?.metadata) text += ' ' + JSON.stringify(meta.metadata.getAll());
    for (let p = 1; p <= Math.min(2, doc.numPages); p++) {
      const content = await (await doc.getPage(p)).getTextContent();
      text += ' ' + content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
    }
    return text;
  } finally {
    await task.destroy();
  }
}

/** BibTeX for a DOI via content negotiation, or null. */
async function fetchBibtex(doi) {
  const res = await fetch(`https://doi.org/${encodeURI(doi)}`, {
    headers: {
      Accept: 'application/x-bibtex; charset=utf-8',
      'User-Agent': 'brain-shockwave-simulation-refs-sync/1.0',
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text.trim().startsWith('@') ? text : null;
}

async function main() {
  const bibText = existsSync(BIB) ? await readFile(BIB, 'utf8') : '';
  const entries = parseEntries(bibText);
  const taken = new Set(entries.map((e) => e.key));
  const linkedFiles = new Set(entries.map((e) => e.fields.file).filter(Boolean));
  const byDoi = new Map(
    entries.filter((e) => e.fields.doi).map((e) => [e.fields.doi.toLowerCase(), e]),
  );

  const pdfs = await listPdfs(PAPERS);
  const pending = pdfs.filter((f) => !linkedFiles.has(`papers/${f}`));
  console.log(`Found ${pdfs.length} PDF(s); ${pending.length} not yet in references.bib.`);

  let newText = bibText;
  /** @type {{ entry: { key: string, fields: Record<string, string> }, pdf: string }[]} */
  const notes = [];
  const report = { added: 0, linked: 0, stubs: 0, failed: 0 };

  for (const pdf of pending) {
    let doi = null;
    try {
      doi = extractDoi(await pdfText(path.join(PAPERS, pdf)));
    } catch (err) {
      console.warn(`  ! ${pdf}: could not read PDF (${err.message})`);
      report.failed++;
    }

    // DOI already in the bibliography without a file link: just add the link.
    const existing = doi && byDoi.get(doi.toLowerCase());
    if (existing) {
      const updated = { ...existing, fields: { ...existing.fields, file: `papers/${pdf}` } };
      // Offsets refer to the original text, so look the original entry up by content.
      newText = newText.replace(
        bibText.slice(existing.start, existing.end),
        serializeEntry(updated),
      );
      console.log(`  ~ ${pdf}: linked to existing entry ${existing.key}`);
      report.linked++;
      continue;
    }

    let fetched = null;
    if (doi && !OFFLINE) {
      try {
        const bib = await fetchBibtex(doi);
        fetched = bib ? parseEntries(bib)[0] : null;
      } catch (err) {
        console.warn(`  ! ${pdf}: lookup for ${doi} failed (${err.message})`);
      }
    }

    let entry;
    if (fetched) {
      const key = makeCiteKey(fetched.fields, taken);
      entry = {
        type: fetched.type,
        key,
        fields: { ...fetched.fields, file: `papers/${pdf}` },
        raw: fetched.raw,
      };
      console.log(`  + ${pdf}: ${key} (doi ${doi})`);
      report.added++;
    } else {
      const base = path.basename(pdf, path.extname(pdf));
      const slug =
        base
          .normalize('NFD')
          .replace(/[^A-Za-z0-9]+/g, '')
          .toLowerCase()
          .slice(0, 40) || 'ref';
      let key = slug;
      for (let n = 2; taken.has(key); n++) key = `${slug}-${n}`;
      entry = {
        type: 'misc',
        key,
        fields: {
          title: base,
          ...(doi ? { doi } : {}),
          note: 'TODO: incomplete entry, fill in metadata manually',
          file: `papers/${pdf}`,
        },
      };
      console.log(
        `  ? ${pdf}: ${doi ? `DOI ${doi} found but not resolved` : 'no DOI found'}; stub ${key} added`,
      );
      report.stubs++;
    }
    taken.add(entry.key);
    newText = `${newText.trimEnd()}\n\n${serializeEntry(entry)}\n`.trimStart();
    notes.push({ entry, pdf });
  }

  const missingLocally = entries.filter(
    (e) => e.fields.file && !existsSync(path.join(REFS, e.fields.file)),
  ).length;

  if (!DRY_RUN && newText !== bibText) {
    await writeFile(BIB, newText, 'utf8');
    await mkdir(NOTES, { recursive: true });
    for (const { entry, pdf } of notes) {
      const notePath = path.join(NOTES, `${entry.key}.md`);
      if (!existsSync(notePath)) await writeFile(notePath, noteTemplate(entry, pdf), 'utf8');
    }
  }

  console.log(
    `\n${DRY_RUN ? '[dry run] would add' : 'Added'} ${report.added}, linked ${report.linked}, ` +
      `stubs ${report.stubs}, unreadable ${report.failed}.` +
      (missingLocally
        ? ` ${missingLocally} bib entr(ies) point to PDFs not present on this machine.`
        : ''),
  );
  if (report.stubs)
    console.log('Stub entries are marked "TODO" in references.bib; complete them by hand.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
