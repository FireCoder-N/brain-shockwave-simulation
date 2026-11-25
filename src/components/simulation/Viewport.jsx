import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import Select from '../Select.jsx';
import Hud from './Hud.jsx';
import HeatLegend from './HeatLegend.jsx';
import { DISPLAYS, MODELS } from '../../simulations/shared/modes.js';

// three.js is large: load the 3D view in its own chunk so the rest of the page appears first.
const Scene3D = lazy(() => import('./Scene3D.jsx'));

/**
 * The simulation window: mode selectors and expand button on top, 3D view with HUD/legend
 * overlays in the middle, playback bar (passed as `transport`) at the bottom.
 *
 * @param {object} props
 * @param {string} props.model
 * @param {(id: string) => void} props.onModelChange
 * @param {string} props.display
 * @param {(id: string) => void} props.onDisplayChange
 * @param {Record<string, number>} props.values
 * @param {{ label: string, value: string, unit: string }[]} props.hud
 * @param {boolean} props.expanded
 * @param {() => void} props.onToggleExpanded
 * @param {import('react').ReactNode} props.transport
 * @param {import('react').ReactNode} [props.overlay]  Extra floating content (full-view panel).
 * @param {string} [props.className]
 */
export default function Viewport({
  model,
  onModelChange,
  display,
  onDisplayChange,
  values,
  hud,
  expanded,
  onToggleExpanded,
  transport,
  overlay,
  className = '',
}) {
  const { t } = useTranslation();
  const expandLabel = expanded ? t('viewport.collapse') : t('viewport.expand');

  return (
    <section
      aria-label={t('viewport.label')}
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-surface ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line px-3 py-2">
        <Select
          label={t('viewport.model')}
          value={model}
          onChange={onModelChange}
          options={MODELS.map((m) => ({ value: m, label: t(`models.${m}`) }))}
        />
        <Select
          label={t('viewport.display')}
          value={display}
          onChange={onDisplayChange}
          options={DISPLAYS.map((d) => ({ value: d, label: t(`displays.${d}`) }))}
        />
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent sm:inline">
            {t('viewport.preview')}
          </span>
          <button
            type="button"
            onClick={onToggleExpanded}
            aria-label={expandLabel}
            aria-pressed={expanded}
            title={expandLabel}
            className="grid size-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {expanded ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 4v5H4m11-5v5h5M9 20v-5H4m11 5v-5h5"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <Suspense
          fallback={
            <div className="grid h-full place-items-center text-sm text-muted">
              {t('viewport.loading3d')}
            </div>
          }
        >
          <Scene3D
            model={/** @type {'sphere' | 'twoLobes'} */ (model)}
            display={/** @type {'heatmap' | 'deformation' | 'force'} */ (display)}
            values={values}
            label={t('viewport.sceneLabel', { model: t(`models.${model}`) })}
          />
        </Suspense>

        {/* Overlays don't capture the pointer, so dragging still rotates the scene. */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-2">
          <Hud items={hud} />
          {display === 'heatmap' && <HeatLegend />}
        </div>
        {overlay}
      </div>

      {transport}
    </section>
  );
}
