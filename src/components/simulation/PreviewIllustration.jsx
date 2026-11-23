import { useId } from 'react';
import { HEAT_STOPS } from '../../simulations/shared/colormap.js';

const CX = 220;
const CY = 140;
const R = 100;

/**
 * Static placeholder drawing of the selected model and display mode, so the layout and mode
 * switching can be reviewed before the physics engine exists. NOT a simulation result.
 *
 * @param {object} props
 * @param {string} props.model     'sphere' | 'two-lobes'
 * @param {string} props.display   'heatmap' | 'deformation' | 'force'
 * @param {number} props.layers
 * @param {number} props.impactAngle  Degrees; 0 = hit from the left.
 * @param {string} [props.className]
 */
export default function PreviewIllustration({ model, display, layers, impactAngle, className }) {
  const uid = useId().replace(/:/g, '');
  const theta = (impactAngle * Math.PI) / 180;
  const hit = { x: CX - R * Math.cos(theta), y: CY - R * Math.sin(theta) };
  const dir = { x: Math.cos(theta), y: Math.sin(theta) }; // direction of travel of the blow

  /** Brain outline(s), scaled by s (1 = full size). @param {number} s @param {string} cls */
  const shape = (s, cls) =>
    model === 'two-lobes' ? (
      <g className={cls}>
        <ellipse cx={CX - 49 * s} cy={CY} rx={47 * s} ry={R * s} />
        <ellipse cx={CX + 49 * s} cy={CY} rx={47 * s} ry={R * s} />
      </g>
    ) : (
      <circle cx={CX} cy={CY} r={R * s} className={cls} />
    );

  const rings = Array.from({ length: layers }, (_, i) => (i + 1) / layers);
  const arrows = [-50, -25, 0, 25, 50].map((deg) => {
    const a = theta + (deg * Math.PI) / 180;
    const len = 150 - Math.abs(deg) * 1.2;
    return { x2: hit.x + Math.cos(a) * len, y2: hit.y + Math.sin(a) * len };
  });

  return (
    <svg
      viewBox="0 0 440 280"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label={`Preview illustration: ${model} model, ${display} view`}
    >
      <defs>
        <radialGradient
          id={`heat-${uid}`}
          gradientUnits="userSpaceOnUse"
          cx={hit.x}
          cy={hit.y}
          r={2 * R}
        >
          {[...HEAT_STOPS].reverse().map((c, i) => (
            <stop key={c} offset={i / (HEAT_STOPS.length - 1)} stopColor={c} />
          ))}
        </radialGradient>
        <marker
          id={`arrow-${uid}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0 0 10 5 0 10z" className="fill-accent" />
        </marker>
      </defs>

      {display === 'heatmap' && (
        <g fill={`url(#heat-${uid})`} className="stroke-line" strokeWidth="1.5">
          {shape(1, '')}
        </g>
      )}

      {display === 'deformation' && (
        <g fill="none" strokeWidth="1.5">
          {shape(1, 'fill-surface-2 stroke-line')}
          {rings.map((s) => (
            <g key={s} className="stroke-accent" opacity={0.35 + 0.65 * s}>
              {shape(s, '')}
            </g>
          ))}
        </g>
      )}

      {display === 'force' && (
        <g>
          {shape(1, 'fill-surface-2 stroke-line')}
          {arrows.map((a, i) => (
            <line
              key={i}
              x1={hit.x}
              y1={hit.y}
              x2={a.x2}
              y2={a.y2}
              className="stroke-accent"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd={`url(#arrow-${uid})`}
            />
          ))}
        </g>
      )}

      {/* Incoming blow */}
      <line
        x1={hit.x - dir.x * 90}
        y1={hit.y - dir.y * 90}
        x2={hit.x - dir.x * 8}
        y2={hit.y - dir.y * 8}
        className="stroke-fg"
        strokeWidth="4"
        strokeLinecap="round"
        markerEnd={`url(#arrow-${uid})`}
        opacity=".8"
      />
      <circle cx={hit.x} cy={hit.y} r="5" className="fill-fg" />
    </svg>
  );
}
