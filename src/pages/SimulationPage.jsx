import { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from '../components/Tabs.jsx';
import Viewport from '../components/simulation/Viewport.jsx';
import TransportBar from '../components/simulation/TransportBar.jsx';
import ParameterPanel from '../components/simulation/ParameterPanel.jsx';
import StatisticsPanel from '../components/simulation/StatisticsPanel.jsx';
import { defaultValues, presetValues } from '../simulations/shared/parameters.js';
import { initialPlayback, playbackReducer } from '../simulations/shared/playback.js';
import { formatNumber } from '../i18n/format.js';

/**
 * Home page. Desktop: fills one screen, simulation window and panel split 50/50 (panel scrolls
 * inside). Mobile: stacks and the page scrolls. "Expand" turns the simulation window into a
 * full-page overlay with a floating, collapsible parameter panel.
 */
export default function SimulationPage() {
  const { t, i18n } = useTranslation();
  const [model, setModel] = useState('sphere');
  const [display, setDisplay] = useState('heatmap');
  const [values, setValues] = useState(defaultValues);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [playback, dispatch] = useReducer(playbackReducer, initialPlayback);
  const [speed, setSpeed] = useState(1 / 30);
  const [tab, setTab] = useState('parameters');
  const [expanded, setExpanded] = useState(false);
  const [floatingOpen, setFloatingOpen] = useState(true);

  // Advance simulated time while running. PLACEHOLDER clock until the physics engine exists.
  useEffect(() => {
    if (playback.status !== 'running') return;
    let last = performance.now();
    let frame = requestAnimationFrame(function loop(now) {
      dispatch({ type: 'tick', dt: ((now - last) / 1000) * speed });
      last = now;
      frame = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(frame);
  }, [playback.status, speed]);

  // Full view: Esc closes it, and the page behind doesn't scroll.
  useEffect(() => {
    if (!expanded) return;
    /** @param {KeyboardEvent} e */
    const onKey = (e) => e.key === 'Escape' && setExpanded(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [expanded]);

  /** Changing the model changes the physics, so the run restarts. @param {string} id */
  const changeModel = (id) => {
    setModel(id);
    dispatch({ type: 'reset' });
  };

  const parameterPanel = (/** @type {boolean} */ compact) => (
    <ParameterPanel
      compact={compact}
      values={values}
      onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))}
      onPreset={(id) => setValues(presetValues(id))}
      onReset={() => setValues(defaultValues())}
      showAdvanced={showAdvanced}
      onShowAdvancedChange={setShowAdvanced}
    />
  );

  const floatingPanel = expanded && (
    <div className="absolute top-36 right-3 bottom-3 flex w-[min(22rem,calc(100%-1.5rem))] flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setFloatingOpen((o) => !o)}
        aria-expanded={floatingOpen}
        className="rounded-lg border border-line bg-bg/90 px-3 py-1.5 text-xs font-medium backdrop-blur hover:bg-surface-2"
      >
        {floatingOpen ? t('panel.hidePanel') : t('panel.showPanel')}
      </button>
      {floatingOpen && (
        <div className="min-h-0 w-full flex-1 overflow-y-auto rounded-xl border border-line bg-bg/90 p-3 shadow-lg backdrop-blur">
          {parameterPanel(true)}
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 p-3 sm:px-5 md:h-[calc(100dvh-3.5rem)]">
      <div
        className={
          expanded
            ? 'fixed inset-0 z-50 flex bg-bg p-2 sm:p-3'
            : 'flex h-[70vh] min-h-96 md:h-auto md:min-h-0 md:flex-1'
        }
      >
        <Viewport
          className="min-w-0 flex-1"
          model={model}
          onModelChange={changeModel}
          display={display}
          onDisplayChange={setDisplay}
          values={values}
          hud={[
            { label: t('viewport.hud.peakForce'), value: '—', unit: 'kN' },
            { label: t('viewport.hud.maxStrain'), value: '—', unit: '%' },
            {
              label: t('viewport.hud.time'),
              value:
                playback.status === 'idle'
                  ? '—'
                  : formatNumber(playback.time * 1000, 1, i18n.language),
              unit: 'ms',
            },
          ]}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((e) => !e)}
          overlay={floatingPanel}
          transport={
            <TransportBar
              playback={playback}
              dispatch={dispatch}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          }
        />
      </div>

      <section className="flex min-h-0 flex-col rounded-xl border border-line bg-surface md:flex-1">
        <div className="border-b border-line px-2">
          <Tabs
            idPrefix="panel"
            label={t('panel.label')}
            tabs={[
              { id: 'parameters', label: t('panel.parameters') },
              { id: 'statistics', label: t('panel.statistics') },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>
        <div
          role="tabpanel"
          id={`panel-panel-${tab}`}
          aria-labelledby={`panel-tab-${tab}`}
          className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4"
        >
          {tab === 'parameters' ? parameterPanel(false) : <StatisticsPanel />}
        </div>
      </section>
    </div>
  );
}
