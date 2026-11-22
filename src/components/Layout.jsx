import { NavLink, Outlet } from 'react-router-dom';

/** Placeholder shell: header navigation + routed page content. Design TBD. */
export default function Layout() {
  return (
    <>
      <header>
        <nav aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>{' '}
          | <NavLink to="/simulations">Simulations</NavLink> |{' '}
          <NavLink to="/references">References</NavLink> | <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
