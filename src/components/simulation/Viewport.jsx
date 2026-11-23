import Select from '../Select.jsx';
import Hud from './Hud.jsx';
import HeatLegend from './HeatLegend.jsx';
import PreviewIllustration from './PreviewIllustration.jsx';
import { DISPLAYS, MODELS } from '../../simulations/shared/modes.js';

/**
 * The main simulation window: mode selectors on top, rendering area with HUD overlay below.
 *
 * @param {object} props
 * @param {string} props.model
 * @param {(id: string) => void} props.onModelChange
 * @param {string} props.display
 * @param {(id: string) => void} props.onDisplayChange
 * @param {Record<string, number>} props.values
 * @param {string} [props.className]
 */
export default function Viewport({
  model,
  onModelChange,
  display,
  onDisplayChange,
  values,
  className = '',
}) {
  return (
    <section
      aria-label="Simulation"
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-surface ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line px-3 py-2">
        <Select
          label="Model"
          value={model}
          onChange={onModelChange}
          options={MODELS.map((m) => ({ value: m.id, label: m.label }))}
        />
        <Select
          label="Display"
          value={display}
          onChange={onDisplayChange}
          options={DISPLAYS.map((d) => ({ value: d.id, label: d.label }))}
        />
        <span className="ml-auto rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
          Preview · physics not connected yet
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        <PreviewIllustration
          model={model}
          display={display}
          layers={values.layers}
          impactAngle={values.impactAngle}
          className="absolute inset-0 size-full p-4"
        />
        <Hud
          className="absolute top-3 left-3"
          items={[
            { label: 'Peak force', value: '—', unit: 'kN' },
            { label: 'Max strain', value: '—', unit: '%' },
            { label: 'Time', value: '—', unit: 'ms' },
          ]}
        />
        {display === 'heatmap' && (
          <HeatLegend label="Stress" className="absolute bottom-3 left-3" />
        )}
      </div>
    </section>
  );
}
