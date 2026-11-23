/**
 * Shared frame for text pages (Project, Team): readable width, page title and lead paragraph.
 *
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.title
 * @param {import('react').ReactNode} props.lead
 * @param {import('react').ReactNode} props.children
 */
export default function ContentPage({ eyebrow, title, lead, children }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-sm font-semibold tracking-wider text-accent uppercase">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-muted">{lead}</p>
      <p className="mt-6 rounded-lg border border-dashed border-line px-3 py-2 text-xs text-muted">
        Draft content: placeholder text, to be written by the team.
      </p>
      <div className="mt-12 space-y-14">{children}</div>
    </div>
  );
}
