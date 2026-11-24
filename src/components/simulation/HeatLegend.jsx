import { useTranslation } from 'react-i18next';
import { heatGradientCss } from '../../simulations/shared/colormap.js';

/** Color scale legend for the heatmap display. @param {{ className?: string }} props */
export default function HeatLegend({ className = '' }) {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-lg border border-line bg-bg/80 px-3 py-2 text-xs backdrop-blur ${className}`}
    >
      <div className="mb-1 font-medium">{t('viewport.legend.stress')}</div>
      <div className="h-2 w-36 rounded-full" style={{ background: heatGradientCss() }} />
      <div className="mt-1 flex justify-between text-muted">
        <span>{t('viewport.legend.low')}</span>
        <span>{t('viewport.legend.high')}</span>
      </div>
    </div>
  );
}
