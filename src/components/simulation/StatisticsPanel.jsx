const STATS = [
  { label: 'Peak force', unit: 'kN' },
  { label: 'Peak pressure', unit: 'kPa' },
  { label: 'Max strain', unit: '%' },
  { label: 'Wave arrival (far side)', unit: 'ms' },
];

const CHARTS = ['Force over time', 'Strain over time'];

/**
 * Statistics tab. Layout placeholder: values and charts arrive with the physics engine
 * (chart library not chosen yet).
 */
export default function StatisticsPanel() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-bg p-4">
            <div className="text-xs text-muted">{s.label}</div>
            <div className="mt-1 font-display text-2xl font-semibold tabular-nums">
              —<span className="ml-1 text-sm font-normal text-muted">{s.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {CHARTS.map((title) => (
          <div key={title} className="rounded-lg border border-line bg-bg p-4">
            <div className="text-sm font-medium">{title}</div>
            <div className="mt-3 grid h-32 place-items-center rounded-md border border-dashed border-line text-xs text-muted">
              Chart appears after a simulation run
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
