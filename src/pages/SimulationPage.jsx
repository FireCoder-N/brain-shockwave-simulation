import { useState } from 'react';
import Tabs from '../components/Tabs.jsx';
import Viewport from '../components/simulation/Viewport.jsx';
import TransportBar from '../components/simulation/TransportBar.jsx';
import ParameterPanel from '../components/simulation/ParameterPanel.jsx';
import StatisticsPanel from '../components/simulation/StatisticsPanel.jsx';
import { defaultValues, presetValues } from '../simulations/shared/parameters.js';

const PANEL_TABS = [
  { id: 'parameters', label: 'Parameters' },
  { id: 'statistics', label: 'Statistics' },
];

/**
 * Home page. Desktop: fills exactly one screen (viewport ~60%, panel ~40%, panel scrolls inside).
 * Mobile: stacks and the page scrolls.
 */
export default function SimulationPage() {
  const [model, setModel] = useState('sphere');
  const [display, setDisplay] = useState('heatmap');
  const [values, setValues] = useState(defaultValues);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState(/** @type {'idle' | 'running' | 'paused'} */ ('idle'));
  const [speed, setSpeed] = useState(1 / 30);
  const [tab, setTab] = useState('parameters');

  /** Changing the model changes the physics, so the run restarts. @param {string} id */
  const changeModel = (id) => {
    setModel(id);
    setStatus('idle');
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 p-3 sm:px-5 md:h-[calc(100dvh-3.5rem)]">
      <Viewport
        className="h-[55vh] min-h-72 md:h-auto md:flex-[3]"
        model={model}
        onModelChange={changeModel}
        display={display}
        onDisplayChange={setDisplay}
        values={values}
      />

      <TransportBar
        status={status}
        onStrike={() => setStatus('running')}
        onPauseToggle={() => setStatus((s) => (s === 'paused' ? 'running' : 'paused'))}
        onReset={() => setStatus('idle')}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <section className="flex min-h-0 flex-col rounded-xl border border-line bg-surface md:flex-[2]">
        <div className="border-b border-line px-2">
          <Tabs
            idPrefix="panel"
            label="Simulation panel"
            tabs={PANEL_TABS}
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
          {tab === 'parameters' ? (
            <ParameterPanel
              values={values}
              onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))}
              onPreset={(id) => setValues(presetValues(id))}
              onReset={() => setValues(defaultValues())}
              showAdvanced={showAdvanced}
              onShowAdvancedChange={setShowAdvanced}
            />
          ) : (
            <StatisticsPanel />
          )}
        </div>
      </section>
    </div>
  );
}
