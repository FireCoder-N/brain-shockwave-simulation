import { useTranslation } from 'react-i18next';
import Select from '../Select.jsx';
import { SPEEDS } from '../../simulations/shared/modes.js';
import { FRAME_DT, RUN_DURATION, frameAt } from '../../simulations/shared/playback.js';
import { formatNumber } from '../../i18n/format.js';

const iconBtn =
  'grid size-8 shrink-0 place-items-center rounded-lg text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40';

/** @param {{ d: string }} props */
function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  play: 'M7 4.5v15l12-7.5z',
  pause: 'M6 4.5h4v15H6zm8 0h4v15h-4z',
  replay: 'M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z',
  reset: 'M6 6h12v12H6z',
  prev: 'M6 5h2v14H6zm3.5 7L18 5v14z',
  next: 'M16 5h2v14h-2zm-1.5 7L6 19V5z',
};

/**
 * Playback controls and timeline, docked at the bottom of the simulation window.
 *
 * @param {object} props
 * @param {import('../../simulations/shared/playback.js').PlaybackState} props.playback
 * @param {(action: import('../../simulations/shared/playback.js').PlaybackAction) => void} props.dispatch
 * @param {number} props.speed
 * @param {(speed: number) => void} props.onSpeedChange
 */
export default function TransportBar({ playback, dispatch, speed, onSpeedChange }) {
  const { t, i18n } = useTranslation();
  const { status, time, recorded } = playback;
  const idle = status === 'idle';
  const ms = (/** @type {number} */ s) => formatNumber(s * 1000, 1, i18n.language);
  const frameText = t('transport.frame', { current: frameAt(time), total: frameAt(RUN_DURATION) });

  const toggle = {
    running: { action: 'pause', label: t('transport.pause'), icon: ICONS.pause },
    paused: { action: 'resume', label: t('transport.resume'), icon: ICONS.play },
    finished: { action: 'replay', label: t('transport.replay'), icon: ICONS.replay },
    idle: { action: 'resume', label: t('transport.resume'), icon: ICONS.play },
  }[status];

  return (
    <div
      role="group"
      aria-label={t('transport.controls')}
      className="flex flex-wrap items-center gap-x-1.5 gap-y-2 border-t border-line bg-surface px-2 py-2 sm:px-3"
    >
      <button
        type="button"
        onClick={() => dispatch({ type: 'strike' })}
        className="mr-1 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
      >
        <Icon d={ICONS.play} />
        {t('transport.strike')}
      </button>
      <button
        type="button"
        className={iconBtn}
        disabled={idle}
        aria-label={toggle.label}
        title={toggle.label}
        onClick={() =>
          dispatch({ type: /** @type {'pause' | 'resume' | 'replay'} */ (toggle.action) })
        }
      >
        <Icon d={toggle.icon} />
      </button>
      <button
        type="button"
        className={iconBtn}
        disabled={idle}
        aria-label={t('transport.reset')}
        title={t('transport.reset')}
        onClick={() => dispatch({ type: 'reset' })}
      >
        <Icon d={ICONS.reset} />
      </button>
      <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
      <button
        type="button"
        className={iconBtn}
        disabled={idle || time <= 0}
        aria-label={t('transport.previousFrame')}
        title={t('transport.previousFrame')}
        onClick={() => dispatch({ type: 'step', frames: -1 })}
      >
        <Icon d={ICONS.prev} />
      </button>
      <button
        type="button"
        className={iconBtn}
        disabled={idle || time >= recorded}
        aria-label={t('transport.nextFrame')}
        title={t('transport.nextFrame')}
        onClick={() => dispatch({ type: 'step', frames: 1 })}
      >
        <Icon d={ICONS.next} />
      </button>

      {/* Timeline: full track, recorded range, played part, and the draggable playhead. */}
      <div className="relative order-last basis-full sm:order-none sm:mx-2 sm:min-w-40 sm:flex-1 sm:basis-auto">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="absolute inset-y-0 left-0 bg-line"
            style={{ width: `${(recorded / RUN_DURATION) * 100}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: `${(time / RUN_DURATION) * 100}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={RUN_DURATION}
          step={FRAME_DT}
          value={time}
          disabled={idle}
          onChange={(e) => dispatch({ type: 'seek', time: Number(e.target.value) })}
          aria-label={t('transport.timeline')}
          aria-valuetext={`${ms(time)} ms, ${frameText}`}
          className="range-bare relative block w-full"
        />
      </div>

      <span
        className="ml-auto text-xs whitespace-nowrap text-muted tabular-nums sm:ml-0"
        title={frameText}
      >
        <span className="font-semibold text-fg">{ms(time)}</span> / {ms(RUN_DURATION)} ms
      </span>
      <span role="status" className="sr-only">
        {t(`transport.status.${status}`)}
      </span>
      <div className="ml-2">
        <Select
          label={t('transport.speed')}
          hideLabel
          value={speed}
          onChange={(v) => onSpeedChange(Number(v))}
          options={SPEEDS.map((s) => ({
            value: s,
            label: s === 1 ? t('transport.realTime') : `1/${Math.round(1 / s)}×`,
          }))}
        />
      </div>
    </div>
  );
}
