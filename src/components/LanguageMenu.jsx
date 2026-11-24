import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n/languages.js';

/** Globe button + dropdown listing languages by their own names. */
export default function LanguageMenu() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    /** @param {PointerEvent} e */
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(/** @type {Node} */ (e.target))) setOpen(false);
    };
    /** @param {KeyboardEvent} e */
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t('language.label')}: ${current.name}`}
        title={t('language.label')}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        {current.short}
      </button>
      {open && (
        <ul className="absolute right-0 z-30 mt-1 w-48 overflow-hidden rounded-lg border border-line bg-bg py-1 shadow-lg">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                lang={lang.code}
                aria-current={lang.code === current.code ? 'true' : undefined}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2 ${
                  lang.code === current.code ? 'font-semibold text-accent' : 'text-fg'
                }`}
              >
                {lang.name}
                <span className="text-xs text-muted">{lang.short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
