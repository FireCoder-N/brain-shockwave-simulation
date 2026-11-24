import { useEffect, useState } from 'react';

/** Reads the current theme tokens from CSS so WebGL materials can follow light/dark mode. */
function readTokens() {
  const s = getComputedStyle(document.documentElement);
  /** @param {string} name */
  const v = (name) => s.getPropertyValue(name).trim();
  return {
    fg: v('--fg'),
    muted: v('--muted'),
    line: v('--line'),
    surface2: v('--surface-2'),
    accent: v('--accent'),
  };
}

/** Theme colors as hex strings; updates when <html data-theme> changes. */
export default function useThemeColors() {
  const [colors, setColors] = useState(readTokens);
  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readTokens()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);
  return colors;
}
