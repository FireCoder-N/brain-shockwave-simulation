/**
 * Always-visible key readouts overlaid on the viewport.
 *
 * @param {object} props
 * @param {{ label: string, value: string, unit: string }[]} props.items
 * @param {string} [props.className]
 */
export default function Hud({ items, className = '' }) {
  return (
    <dl
      className={`grid grid-cols-[auto_auto] gap-x-4 gap-y-1 rounded-lg border border-line bg-bg/80 px-3 py-2 text-xs backdrop-blur ${className}`}
    >
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-muted">{item.label}</dt>
          <dd className="text-right font-semibold tabular-nums">
            {item.value}
            {item.unit && <span className="ml-1 font-normal text-muted">{item.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
