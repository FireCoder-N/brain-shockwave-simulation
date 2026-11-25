import { useEffect, useMemo, useState } from 'react';

/** Distance below the viewport top at which a heading counts as "current" (sticky header + gap). */
const ACTIVE_OFFSET = 96;

/**
 * The heading currently being read: the last one scrolled past ACTIVE_OFFSET.
 * @param {string[]} ids  Must keep its identity while the headings don't change.
 */
function useActiveHeading(ids) {
  const [active, setActive] = useState('');
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
      }
      // At the very bottom, the last section is current even if its heading can't reach the top.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = ids.at(-1) ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids]);
  return active;
}

/**
 * @param {object} props
 * @param {import('./headings.js').Heading[]} props.headings
 * @param {string} props.active  Id of the current heading.
 */
function TocList({ headings, active }) {
  return (
    <ol className="space-y-0.5 text-sm">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={(e) => {
              // HashRouter owns the URL hash, so scroll manually instead of changing it.
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-current={active === h.id ? 'location' : undefined}
            className={`block rounded-md border-l-2 py-1 pr-2 transition-colors ${
              h.level === 3 ? 'pl-6' : 'pl-3'
            } ${
              active === h.id
                ? 'border-accent bg-accent-soft font-medium text-accent'
                : 'border-transparent text-muted hover:text-fg'
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Wikipedia-style contents: sticky sidebar on large screens that highlights the current section;
 * collapsible "Contents" box on small screens.
 *
 * @param {{ headings: import('./headings.js').Heading[], title: string }} props
 *   `headings` should be memoized by the caller.
 */
export default function TableOfContents({ headings, title }) {
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useActiveHeading(ids);

  return (
    <>
      <details className="rounded-xl border border-line bg-surface p-3 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold">{title}</summary>
        <nav aria-label={title} className="mt-2">
          <TocList headings={headings} active={active} />
        </nav>
      </details>
      <nav
        aria-label={title}
        className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] overflow-y-auto lg:block"
      >
        <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted uppercase">
          {title}
        </p>
        <TocList headings={headings} active={active} />
      </nav>
    </>
  );
}
