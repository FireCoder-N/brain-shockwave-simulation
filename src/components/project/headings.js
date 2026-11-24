/**
 * URL fragment for a heading. Keeps letters of any script (Greek, Cyrillic, ...),
 * strips accents and punctuation: "Off-center blows" → "off-center-blows".
 * @param {string} text
 */
export function slugify(text) {
  return (
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

/** @typedef {{ level: 2 | 3, text: string, id: string }} Heading */

/**
 * The ## and ### headings of a Markdown document (ignoring code and display-math blocks),
 * used to build the table of contents.
 * @param {string} markdown
 * @returns {Heading[]}
 */
export function extractHeadings(markdown) {
  /** @type {Heading[]} */
  const headings = [];
  let inFence = false;
  let inMath = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    else if (/^\s*\$\$\s*$/.test(line)) inMath = !inMath;
    if (inFence || inMath) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const text = m[2].trim();
      headings.push({ level: /** @type {2 | 3} */ (m[1].length), text, id: slugify(text) });
    }
  }
  return headings;
}
