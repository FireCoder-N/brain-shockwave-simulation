import { useTranslation } from 'react-i18next';
import ContentPage from '../components/ContentPage.jsx';

/**
 * Team members. Placeholder entries: replace with real names, roles and short bios.
 * Names stay as written; roles and bios will need translation keys once they are real.
 * @type {{ name?: string, links: { label: string, href: string }[] }[]}
 */
const MEMBERS = [{ links: [] }, { links: [] }];

/** @param {string} name */
function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamPage() {
  const { t } = useTranslation();
  return (
    <ContentPage eyebrow={t('team.eyebrow')} title={t('team.title')} lead={t('team.lead')} draft>
      <ul className="grid gap-4 sm:grid-cols-2">
        {MEMBERS.map((m, i) => {
          const name = m.name ?? t('team.memberName');
          return (
            <li key={i} className="rounded-xl border border-line bg-surface p-6">
              <div className="grid size-14 place-items-center rounded-full bg-accent-soft font-display text-lg font-semibold text-accent">
                {initials(name)}
              </div>
              <h2 className="mt-4 text-xl font-semibold">{name}</h2>
              <p className="text-sm font-medium text-accent">{t('team.memberRole')}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t('team.memberBio')}</p>
              {m.links.length > 0 && (
                <div className="mt-4 flex gap-3 text-sm">
                  {m.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="text-accent hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </ContentPage>
  );
}
