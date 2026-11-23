import { useRef } from 'react';

/**
 * Accessible tab list (arrow keys move between tabs). The parent renders the panel with
 * role="tabpanel", id={`${idPrefix}-panel-${value}`} and aria-labelledby={`${idPrefix}-tab-${value}`}.
 *
 * @param {object} props
 * @param {string} props.idPrefix
 * @param {{ id: string, label: string }[]} props.tabs
 * @param {string} props.value
 * @param {(id: string) => void} props.onChange
 * @param {string} [props.label]  Accessible name of the tab list.
 */
export default function Tabs({ idPrefix, tabs, value, onChange, label }) {
  const refs = useRef(/** @type {(HTMLButtonElement | null)[]} */ ([]));

  /** @param {import('react').KeyboardEvent} e @param {number} index */
  const onKeyDown = (e, index) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className="flex gap-1">
      {tabs.map((tab, i) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
              selected ? 'text-accent' : 'text-muted hover:text-fg'
            }`}
          >
            {tab.label}
            {selected && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
