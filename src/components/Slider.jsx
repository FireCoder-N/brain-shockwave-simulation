import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import InfoTip from './InfoTip.jsx';
import { formatNumber } from '../i18n/format.js';

/** Decimal places implied by a slider step (0.5 → 1, 0.1 → 1, 5 → 0). @param {number} step */
function decimals(step) {
  const s = String(step);
  return s.includes('.') ? s.split('.')[1].length : 0;
}

/**
 * Labeled range slider with live value readout and an ⓘ explanation.
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
  const { t, i18n } = useTranslation();
  const id = useId();
  const descId = `${id}-desc`;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1">
          <label htmlFor={id} className="truncate text-sm font-medium">
            {label}
            {/* Serif italic, like math notation: Inter's italic θ and d read as "6" and "a". */}
            {symbol && (
              <span className="ml-1.5 font-serif font-normal text-muted italic">{symbol}</span>
            )}
          </label>
          {description && <InfoTip text={description} label={t('panel.about', { name: label })} />}
        </div>
        <output htmlFor={id} className="shrink-0 text-sm font-semibold text-accent tabular-nums">
          {formatNumber(value, decimals(step), i18n.language)}
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
        <span id={descId} className="sr-only">
          {description}
        </span>
      )}
    </div>
  );
}
