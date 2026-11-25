import { useId } from 'react';

/**
 * Labeled native <select> (native for accessibility and mobile pickers).
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string | number} props.value
 * @param {(value: string) => void} props.onChange
 * @param {{ value: string | number, label: string }[]} props.options
 * @param {boolean} [props.hideLabel]  Keep the label for screen readers only.
 */
export default function Select({ label, value, onChange, options, hideLabel = false }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-xs font-medium text-muted'}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-bg px-2.5 py-1.5 text-sm text-fg"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
