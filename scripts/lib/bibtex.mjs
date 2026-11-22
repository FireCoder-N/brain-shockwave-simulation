/**
 * Minimal, dependency-free BibTeX helpers used by scripts/sync-references.mjs.
 * Pure functions only (no I/O) so they can be unit tested.
 */

/**
 * @typedef {object} BibEntry
 * @property {string} type    Entry type, lower-cased (article, book, misc, ...).
 * @property {string} key     Citation key.
 * @property {Record<string, string>} fields  Field values without outer delimiters.
 * @property {Record<string, string>} raw     Field values exactly as written (with delimiters).
 * @property {number} start   Offset of '@' in the source text.
 * @property {number} end     Offset just past the closing brace.
 */

const SKIPPED_TYPES = new Set(['comment', 'string', 'preamble']);

/**
 * Index of the brace matching the '{' at `open`, or -1.
 * @param {string} text
 * @param {number} open
 */
function matchBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) return i;
  }
  return -1;
}

/**
 * @param {string} body  Entry text after "key,".
 * @returns {{ fields: Record<string, string>, raw: Record<string, string> }}
 */
function parseFields(body) {
  /** @type {Record<string, string>} */
  const fields = {};
  /** @type {Record<string, string>} */
  const raw = {};
  const nameRe = /[\s,]*([A-Za-z][\w-]*)\s*=\s*/y;
  let i = 0;
  while (i < body.length) {
    nameRe.lastIndex = i;
    const m = nameRe.exec(body);
    if (!m) {
      // Unparseable fragment (e.g. Crossref's malformed "Key_2001, jr._2001,"): skip past next comma.
      const comma = body.indexOf(',', i);
      if (comma < 0) break;
      i = comma + 1;
      continue;
    }
    const name = m[1].toLowerCase();
    i = nameRe.lastIndex;
    const start = i;
    let value;
    if (body[i] === '{') {
      const close = matchBrace(body, i);
      if (close < 0) break;
      value = body.slice(i + 1, close);
      i = close + 1;
    } else if (body[i] === '"') {
      let depth = 0;
      let j = i + 1;
      for (; j < body.length; j++) {
        if (body[j] === '{') depth++;
        else if (body[j] === '}') depth--;
        else if (body[j] === '"' && depth === 0 && body[j - 1] !== '\\') break;
      }
      value = body.slice(i + 1, j);
      i = j + 1;
    } else {
      const comma = body.indexOf(',', i);
      const stop = comma < 0 ? body.length : comma;
      value = body.slice(i, stop).trim();
      i = stop;
    }
    fields[name] = value.replace(/\s+/g, ' ').trim();
    raw[name] = body.slice(start, i).trim();
  }
  return { fields, raw };
}

/**
 * Parse all regular entries in a .bib file.
 * @param {string} text
 * @returns {BibEntry[]}
 */
export function parseEntries(text) {
  /** @type {BibEntry[]} */
  const entries = [];
  const headRe = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g;
  let m;
  while ((m = headRe.exec(text))) {
    const type = m[1].toLowerCase();
    const open = text.indexOf('{', m.index);
    const close = matchBrace(text, open);
    if (close < 0) break;
    headRe.lastIndex = close + 1;
    if (SKIPPED_TYPES.has(type)) continue;
    const body = text.slice(m.index + m[0].length, close);
    entries.push({ type, key: m[2], ...parseFields(body), start: m.index, end: close + 1 });
  }
  return entries;
}

/**
 * Serialize an entry in a consistent, diff-friendly layout.
 * @param {{ type: string, key: string, fields: Record<string, string>, raw?: Record<string, string> }} entry
 */
export function serializeEntry({ type, key, fields, raw = {} }) {
  const names = Object.keys(fields);
  const width = Math.max(0, ...names.map((n) => n.length));
  const lines = names.map((n) => `  ${n.padEnd(width)} = ${raw[n] ?? `{${fields[n]}}`}`);
  return `@${type}{${key},\n${lines.join(',\n')}\n}`;
}

/**
 * Find the first DOI in arbitrary text (PDF text, metadata, URLs).
 * @param {string} text
 * @returns {string | null} DOI without resolver prefix, or null.
 */
export function extractDoi(text) {
  const m = /\b(10\.\d{4,9}\/[^\s"'<>{}\][]+)/i.exec(text);
  if (!m) return null;
  return m[1].replace(/[.,;:)]+$/, '');
}

/** @param {string} s */
function asciiLower(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[{}\\]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'on',
  'of',
  'in',
  'for',
  'and',
  'to',
  'with',
  'from',
]);

/**
 * Build a citation key like "bilston2001linear" (first-author surname + year + first title word).
 * @param {{ author?: string, year?: string, title?: string }} fields
 * @param {Set<string>} [taken]  Keys already in use; a suffix a, b, ... is added on collision.
 */
export function makeCiteKey(fields, taken = new Set()) {
  const firstAuthor = (fields.author ?? '').split(/\s+and\s+/i)[0].trim();
  const surname = firstAuthor.includes(',')
    ? firstAuthor.split(',')[0]
    : (firstAuthor.split(/\s+/).pop() ?? '');
  const year = (fields.year ?? '').match(/\d{4}/)?.[0] ?? '';
  const word =
    (fields.title ?? '')
      .split(/\s+/)
      .map(asciiLower)
      .find((w) => w && !STOP_WORDS.has(w)) ?? '';
  const base = asciiLower(surname) + year + word || 'ref';
  let key = base;
  for (let n = 0; taken.has(key); n++)
    key = base + String.fromCharCode(97 + (n % 26)).repeat(1 + Math.floor(n / 26));
  return key;
}

/**
 * Strip BibTeX braces/escapes for human-readable display.
 * @param {string | undefined} value
 */
export function plain(value) {
  return (value ?? '').replace(/[{}]/g, '').replace(/\\&/g, '&').replace(/\s+/g, ' ').trim();
}

/**
 * Markdown skeleton for a per-paper reading note.
 * @param {{ key: string, fields: Record<string, string> }} entry
 * @param {string} pdfName
 */
export function noteTemplate({ key, fields }, pdfName) {
  const doi = fields.doi ? `[${fields.doi}](https://doi.org/${fields.doi})` : 'unknown';
  return `# ${plain(fields.title) || pdfName}

- **Citation key:** \`${key}\`
- **Authors:** ${plain(fields.author) || 'unknown'}
- **Year:** ${plain(fields.year) || 'unknown'}
- **DOI:** ${doi}
- **Local PDF:** \`references/papers/${pdfName}\` (not committed)

## Summary

## Relevance to this project

## Key equations / models

## Material parameters

| Parameter | Value | Units | Tissue / condition | Page |
| --------- | ----- | ----- | ------------------ | ---- |

## Open questions
`;
}
