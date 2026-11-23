import ContentPage from '../components/ContentPage.jsx';

/**
 * Team members. Placeholder entries: replace with real names, roles and short bios.
 * @type {{ name: string, role: string, bio: string, links: { label: string, href: string }[] }[]}
 */
const MEMBERS = [
  {
    name: 'Team member',
    role: 'Role',
    bio: 'Short biography: background, interests and what they work on in this project.',
    links: [],
  },
  {
    name: 'Team member',
    role: 'Role',
    bio: 'Short biography: background, interests and what they work on in this project.',
    links: [],
  },
];

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
  return (
    <ContentPage eyebrow="The team" title="Who we are" lead="The people behind the simulation.">
      <ul className="grid gap-4 sm:grid-cols-2">
        {MEMBERS.map((m, i) => (
          <li key={i} className="rounded-xl border border-line bg-surface p-6">
            <div className="grid size-14 place-items-center rounded-full bg-accent-soft font-display text-lg font-semibold text-accent">
              {initials(m.name)}
            </div>
            <h2 className="mt-4 text-xl font-semibold">{m.name}</h2>
            <p className="text-sm font-medium text-accent">{m.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{m.bio}</p>
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
        ))}
      </ul>
    </ContentPage>
  );
}
