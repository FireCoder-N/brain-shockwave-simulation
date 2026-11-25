import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'katex/dist/katex.min.css';
import TableOfContents from '../components/project/TableOfContents.jsx';
import MarkdownArticle from '../components/project/MarkdownArticle.jsx';
import Sources from '../components/Sources.jsx';
import { loadArticles } from '../components/project/articles.js';
import { extractHeadings } from '../components/project/headings.js';

/**
 * Wikipedia-style project page: Markdown articles (src/content/project/<lang>/) with a sticky
 * contents sidebar, followed by the bibliography. Loaded lazily (KaTeX + Markdown are large).
 */
export default function ProjectPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? 'en';
  const [loaded, setLoaded] = useState(
    /** @type {{ lang: string, articles: import('../components/project/articles.js').Article[] } | null} */ (
      null
    ),
  );

  useEffect(() => {
    let cancelled = false;
    loadArticles(lang).then((articles) => {
      if (!cancelled) setLoaded({ lang, articles });
    });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const articles = loaded?.lang === lang ? loaded.articles : null;
  const sourcesTitle = t('project.sources');
  const headings = useMemo(
    () => [
      ...(articles ?? []).flatMap((a) => extractHeadings(a.markdown)),
      { level: /** @type {const} */ (2), text: sourcesTitle, id: 'sources' },
    ],
    [articles, sourcesTitle],
  );

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <aside>
        <TableOfContents headings={headings} title={t('project.contents')} />
      </aside>

      <article className="min-w-0 max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">{t('project.title')}</h1>
        {!articles && <p className="mt-6 text-muted">{t('common.loading')}</p>}
        {articles?.map((a) => (
          <section key={a.name} lang={a.translated ? undefined : 'en'}>
            {!a.translated && (
              <p className="mt-10 rounded-lg border border-dashed border-line px-3 py-2 text-xs text-muted">
                {t('project.untranslated')}
              </p>
            )}
            <MarkdownArticle markdown={a.markdown} />
          </section>
        ))}

        <section>
          <h2
            id="sources"
            className="mt-14 scroll-mt-20 border-b border-line pb-2 text-3xl font-semibold"
          >
            {sourcesTitle}
          </h2>
          <div className="mt-4">
            <Sources />
          </div>
        </section>
      </article>
    </div>
  );
}
