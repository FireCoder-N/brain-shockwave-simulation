import { heatGradientCss } from '../../simulations/shared/colormap.js';

/**
 * Color scale legend for the heatmap display.
 * @param {{ label: string, className?: string }} props
 */
export default function HeatLegend({ label, className = '' }) {
  return (
    <div
      className={`rounded-lg border border-line bg-bg/80 px-3 py-2 text-xs backdrop-blur ${className}`}
    >
      <div className="mb-1 font-medium">{label}</div>
      <div className="h-2 w-40 rounded-full" style={{ background: heatGradientCss() }} />
      <div className="mt-1 flex justify-between text-muted">
        <span>low</span>
        <span>high</span>
      </div>
    </div>
  );
}
