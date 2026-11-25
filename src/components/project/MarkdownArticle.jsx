import { Children, isValidElement } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { slugify } from './headings.js';

/** Plain text of rendered children, to derive heading ids. @param {import('react').ReactNode} node @returns {string} */
function textOf(node) {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (isValidElement(child)) {
        return textOf(
          /** @type {{ children?: import('react').ReactNode }} */ (child.props).children,
        );
      }
      return '';
    })
    .join('');
}

/** @type {import('react-markdown').Components} */
const components = {
  h2: ({ children }) => (
    <h2
      id={slugify(textOf(children))}
      className="mt-14 scroll-mt-20 border-b border-line pb-2 text-3xl font-semibold"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={slugify(textOf(children))} className="mt-8 scroll-mt-20 text-xl font-semibold">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mt-4 leading-relaxed">{children}</p>,
  a: ({ href = '', children }) => {
    if (href.startsWith('#')) {
      // In-page link: HashRouter owns the URL hash, so scroll instead of navigating.
      return (
        <a
          href={href}
          className="text-accent hover:underline"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {children}
        </a>
      );
    }
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className="text-accent hover:underline"
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-1.5 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-1.5 pl-6">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mt-4 rounded-r-lg border-l-4 border-accent bg-surface px-4 py-1 text-muted">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-line bg-surface px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-line px-3 py-2">{children}</td>,
  code: ({ children }) => (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>
  ),
};

/** Renders one Markdown article with GFM tables and KaTeX math. @param {{ markdown: string }} props */
export default function MarkdownArticle({ markdown }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {markdown}
    </Markdown>
  );
}
