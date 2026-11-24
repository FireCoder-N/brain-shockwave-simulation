import { useTranslation } from 'react-i18next';
import bibText from '../../references/references.bib?raw';
import { parseEntries, plain } from '../../scripts/lib/bibtex.mjs';

/** Bibliography rendered straight from references/references.bib (parsed at build time). */
const ENTRIES = parseEntries(bibText)
  .filter((e) => !/TODO/.test(e.fields.note ?? ''))
  .sort((a, b) => plain(a.fields.author).localeCompare(plain(b.fields.author)));

/** Shorten "Last, First and Last2, First2 and ..." to "Last, Last2 & Last3" / "Last et al.". */
function authors(/** @type {string | undefined} */ field) {
  const names = plain(field)
    .split(/\s+and\s+/)
    .filter(Boolean)
    .map((n) => (n.includes(',') ? n.split(',')[0] : (n.split(' ').pop() ?? n)).trim());
  if (names.length > 3) return `${names[0]} et al.`;
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} & ${names.at(-1)}` : (names[0] ?? '');
}

export default function Sources() {
  const { t } = useTranslation();
  if (ENTRIES.length === 0) {
    return <p className="text-muted">{t('project.noSources')}</p>;
  }
  return (
    <ol className="space-y-3 text-sm">
      {ENTRIES.map(({ key, fields }) => (
        <li key={key} id={`ref-${key}`}>
          <span className="text-fg">{authors(fields.author)}</span> ({plain(fields.year)}).{' '}
          <cite className="not-italic">{plain(fields.title)}</cite>.{' '}
          {fields.journal && <em>{plain(fields.journal)}. </em>}
          {fields.doi && (
            <a
              href={`https://doi.org/${plain(fields.doi)}`}
              className="text-accent hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              doi:{plain(fields.doi)}
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}
