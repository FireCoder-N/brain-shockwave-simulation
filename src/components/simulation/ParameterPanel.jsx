import { useTranslation } from 'react-i18next';
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
 * @param {boolean} [props.compact]  Single column (floating panel in full view).
 */
export default function ParameterPanel({
  values,
  onChange,
  onPreset,
  onReset,
  showAdvanced,
  onShowAdvancedChange,
  compact = false,
}) {
  const { t } = useTranslation();
  const active = matchPreset(values);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div
          role="group"
          aria-label={t('panel.presets')}
          className="flex flex-wrap items-center gap-1"
        >
          <span className="mr-1 text-xs font-medium text-muted">{t('panel.preset')}</span>
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
              {t(`presets.${p.id}`)}
            </button>
          ))}
          {active === 'custom' && (
            <span className="rounded-full border border-dashed border-line px-3 py-1 text-xs text-muted">
              {t('panel.custom')}
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
          {t('panel.showAdvanced')}
        </label>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-accent hover:underline"
        >
          {t('panel.resetDefaults')}
        </button>
      </div>

      <div className={`grid gap-3 ${compact ? '' : 'md:grid-cols-3'}`}>
        {PARAMETER_GROUPS.map((group) => (
          <fieldset key={group.id} className="space-y-3 rounded-lg border border-line bg-bg p-4">
            <legend className="sr-only">{t(`groups.${group.id}`)}</legend>
            <h3
              aria-hidden="true"
              className="text-xs font-semibold tracking-wider text-muted uppercase"
            >
              {t(`groups.${group.id}`)}
            </h3>
            {group.params
              .filter((p) => showAdvanced || !p.advanced)
              .map((p) => (
                <Slider
                  key={p.id}
                  label={t(`params.${p.id}.label`)}
                  symbol={p.symbol}
                  unit={p.unit}
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={values[p.id]}
                  onChange={(v) => onChange(p.id, v)}
                  description={t(`params.${p.id}.description`)}
                />
              ))}
          </fieldset>
        ))}
      </div>
    </div>
  );
}
