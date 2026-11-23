import Slider from '../Slider.jsx';
import { PARAMETER_GROUPS, PRESETS, matchPreset } from '../../simulations/shared/parameters.js';

/**
 * Grouped parameter sliders with presets and an "advanced" toggle.
 *
 * @param {object} props
 * @param {Record<string, number>} props.values
 * @param {(id: string, value: number) => void} props.onChange
 * @param {(presetId: string) => void} props.onPreset
 * @param {() => void} props.onReset
 * @param {boolean} props.showAdvanced
 * @param {(show: boolean) => void} props.onShowAdvancedChange
 */
export default function ParameterPanel({
  values,
  onChange,
  onPreset,
  onReset,
  showAdvanced,
  onShowAdvancedChange,
}) {
  const active = matchPreset(values);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div role="group" aria-label="Presets" className="flex items-center gap-1">
          <span className="mr-1 text-xs font-medium text-muted">Preset</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={active === p.id}
              onClick={() => onPreset(p.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active === p.id
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line text-muted hover:text-fg'
              }`}
            >
              {p.label}
            </button>
          ))}
          {active === 'custom' && (
            <span className="rounded-full border border-dashed border-line px-3 py-1 text-xs text-muted">
              Custom
            </span>
          )}
        </div>

        <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs font-medium text-muted">
          <input
            type="checkbox"
            checked={showAdvanced}
            onChange={(e) => onShowAdvancedChange(e.target.checked)}
            className="accent-accent"
          />
          Show advanced
        </label>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-accent hover:underline"
        >
          Reset to defaults
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {PARAMETER_GROUPS.map((group) => (
          <fieldset key={group.id} className="space-y-4 rounded-lg border border-line bg-bg p-4">
            <legend className="sr-only">{group.label}</legend>
            <h3
              aria-hidden="true"
              className="text-xs font-semibold tracking-wider text-muted uppercase"
            >
              {group.label}
            </h3>
            {group.params
              .filter((p) => showAdvanced || !p.advanced)
              .map((p) => (
                <Slider
                  key={p.id}
                  label={p.label}
                  symbol={p.symbol}
                  unit={p.unit}
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={values[p.id]}
                  onChange={(v) => onChange(p.id, v)}
                  description={p.description}
                />
              ))}
          </fieldset>
        ))}
      </div>
    </div>
  );
}
