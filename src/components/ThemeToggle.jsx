import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** @typedef {'light' | 'dark'} Theme */

const STORAGE_KEY = 'theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

/** @returns {Theme} */
function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/** @returns {Theme | null} */
function savedTheme() {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

/** @param {Theme} theme */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

/**
 * Light/dark switch. The initial theme comes from index.html (saved choice, else OS setting).
 * Until the visitor clicks, the site keeps following OS changes live.
 */
export default function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(currentTheme);

  useEffect(() => {
    const mq = media();
    /** @param {MediaQueryListEvent} e */
    const onChange = (e) => {
      if (savedTheme()) return;
      const next = e.matches ? 'dark' : 'light';
      applyTheme(next);
      setTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    /** @type {Theme} */
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable: choice lasts for this page view only */
    }
  };

  const label = theme === 'dark' ? t('theme.toLight') : t('theme.toDark');
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {theme === 'dark' ? (
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}
