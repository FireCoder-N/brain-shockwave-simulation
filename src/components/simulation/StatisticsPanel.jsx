import { useTranslation } from 'react-i18next';

const STATS = [
  { key: 'stats.peakForce', unit: 'kN' },
  { key: 'stats.peakPressure', unit: 'kPa' },
  { key: 'stats.maxStrain', unit: '%' },
  { key: 'stats.waveArrival', unit: 'ms' },
];

const CHARTS = ['stats.forceOverTime', 'stats.strainOverTime'];

/**
 * Statistics tab. Layout placeholder: values and charts arrive with the physics engine
 * (chart library not chosen yet).
 */
export default function StatisticsPanel() {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.key} className="rounded-lg border border-line bg-bg p-4">
            <div className="text-xs text-muted">{t(s.key)}</div>
            <div className="mt-1 font-display text-2xl font-semibold tabular-nums">
              —<span className="ml-1 text-sm font-normal text-muted">{s.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {CHARTS.map((key) => (
          <div key={key} className="rounded-lg border border-line bg-bg p-4">
            <div className="text-sm font-medium">{t(key)}</div>
            <div className="mt-3 grid h-32 place-items-center rounded-md border border-dashed border-line text-xs text-muted">
              {t('stats.chartEmpty')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
