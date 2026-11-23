import { NavLink, Outlet } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

const NAV = [
  { to: '/', label: 'Simulation', end: true },
  { to: '/project', label: 'Project' },
  { to: '/team', label: 'Team' },
];

/** Site shell: top bar (brand, navigation, theme switch) + routed page. */
export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 h-14 shrink-0 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-3 sm:px-5">
          <NavLink to="/" className="flex items-center gap-2 font-display font-semibold">
            <svg viewBox="0 0 32 32" className="size-7 text-accent" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="4" fill="currentColor" />
              <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="2" opacity=".6" />
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" opacity=".3" />
            </svg>
            <span className="hidden sm:inline">Brain Shockwave</span>
          </NavLink>

          <nav aria-label="Main" className="ml-auto flex items-center gap-1">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-accent-soft text-accent' : 'text-muted hover:text-fg'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
