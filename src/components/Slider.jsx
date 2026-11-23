import { useId } from 'react';

/** Decimal places implied by a slider step (0.5 → 1, 0.1 → 1, 5 → 0). @param {number} step */
function decimals(step) {
  const s = String(step);
  return s.includes('.') ? s.split('.')[1].length : 0;
}

/**
 * Labeled range slider with live value readout.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.symbol]
 * @param {string} props.unit
 * @param {number} props.min
 * @param {number} props.max
 * @param {number} props.step
 * @param {number} props.value
 * @param {(value: number) => void} props.onChange
 * @param {string} [props.description]
 */
export default function Slider({
  label,
  symbol,
  unit,
  min,
  max,
  step,
  value,
  onChange,
  description,
}) {
  const id = useId();
  const descId = `${id}-desc`;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
          {symbol && <span className="ml-1.5 font-normal text-muted italic">{symbol}</span>}
        </label>
        <output htmlFor={id} className="text-sm font-semibold text-accent tabular-nums">
          {value.toFixed(decimals(step))}
          {unit && <span className="ml-1 font-normal text-muted">{unit}</span>}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={description ? descId : undefined}
        className="w-full accent-accent"
      />
      {description && (
        <p id={descId} className="text-xs text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
