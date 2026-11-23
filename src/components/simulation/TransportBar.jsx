import Select from '../Select.jsx';
import { SPEEDS } from '../../simulations/shared/modes.js';

/** @typedef {'idle' | 'running' | 'paused'} PlaybackStatus */

const STATUS_LABEL = { idle: 'Ready', running: 'Running', paused: 'Paused' };

const btn =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

/**
 * Playback controls between the viewport and the panel.
 *
 * @param {object} props
 * @param {PlaybackStatus} props.status
 * @param {() => void} props.onStrike
 * @param {() => void} props.onPauseToggle
 * @param {() => void} props.onReset
 * @param {number} props.speed
 * @param {(speed: number) => void} props.onSpeedChange
 */
export default function TransportBar({
  status,
  onStrike,
  onPauseToggle,
  onReset,
  speed,
  onSpeedChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
      <button
        type="button"
        onClick={onStrike}
        className={`${btn} bg-accent text-accent-fg hover:opacity-90`}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M7 4.5v15l12-7.5z" />
        </svg>
        Strike
      </button>
      <button
        type="button"
        onClick={onPauseToggle}
        disabled={status === 'idle'}
        className={`${btn} border border-line hover:bg-surface-2`}
      >
        {status === 'paused' ? 'Resume' : 'Pause'}
      </button>
      <button
        type="button"
        onClick={onReset}
        className={`${btn} border border-line hover:bg-surface-2`}
      >
        Reset
      </button>
      <span role="status" className="ml-1 flex items-center gap-1.5 text-xs text-muted">
        <span
          className={`size-2 rounded-full ${status === 'running' ? 'animate-pulse bg-accent' : 'bg-line'}`}
        />
        {STATUS_LABEL[status]}
      </span>
      <div className="ml-auto">
        <Select
          label="Speed"
          value={speed}
          onChange={(v) => onSpeedChange(Number(v))}
          options={SPEEDS}
        />
      </div>
    </div>
  );
}
