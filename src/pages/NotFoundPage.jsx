import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto grid max-w-md flex-1 place-content-center px-4 py-24 text-center">
      <p className="font-display text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <Link to="/" className="mt-6 text-sm font-medium text-accent hover:underline">
        Back to the simulation
      </Link>
    </div>
  );
}
