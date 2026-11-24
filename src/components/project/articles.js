/**
 * Project-page articles: Markdown files in src/content/project/<lang>/NN-name.md, shown in
 * file-name order. English defines the list; a missing translation falls back to English.
 */
const FILES = import.meta.glob('../../content/project/*/*.md', {
  query: '?raw',
  import: 'default',
});

/** @type {Record<string, Record<string, () => Promise<unknown>>>} name → lang → loader */
const INDEX = {};
for (const [path, load] of Object.entries(FILES)) {
  const [, lang, name] = /\/([^/]+)\/([^/]+)\.md$/.exec(path) ?? [];
  if (lang && name) (INDEX[name] ??= {})[lang] = load;
}

/** @typedef {{ name: string, markdown: string, translated: boolean }} Article */

/**
 * @param {string} lang
 * @returns {Promise<Article[]>}
 */
export async function loadArticles(lang) {
  const names = Object.keys(INDEX)
    .filter((name) => INDEX[name].en)
    .sort();
  return Promise.all(
    names.map(async (name) => {
      const translated = lang === 'en' || Boolean(INDEX[name][lang]);
      const load = INDEX[name][translated ? lang : 'en'];
      return { name, markdown: /** @type {string} */ (await load()), translated };
    }),
  );
}
