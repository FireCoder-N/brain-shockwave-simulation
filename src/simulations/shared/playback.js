/**
 * Playback state for "record while running": a run computes frames as simulated time advances;
 * the user can seek back over anything already recorded.
 *
 * PROVISIONAL: duration and frame step are placeholders until the physics engine defines them.
 */

/** Simulated duration of one run [s]. */
export const RUN_DURATION = 0.02;
/** Simulated time between frames [s]. */
export const FRAME_DT = 1e-4;

/** @typedef {'idle' | 'running' | 'paused' | 'finished'} PlaybackStatus */
/** @typedef {{ status: PlaybackStatus, time: number, recorded: number }} PlaybackState */
/**
 * @typedef {{ type: 'strike' | 'pause' | 'resume' | 'replay' | 'reset' }
 *   | { type: 'tick', dt: number }
 *   | { type: 'seek', time: number }
 *   | { type: 'step', frames: number }} PlaybackAction
 */

/** @type {PlaybackState} */
export const initialPlayback = { status: 'idle', time: 0, recorded: 0 };

/** @param {number} t */
const snap = (t) => Math.round(t / FRAME_DT) * FRAME_DT;

/**
 * @param {PlaybackState} state
 * @param {PlaybackAction} action
 * @returns {PlaybackState}
 */
export function playbackReducer(state, action) {
  switch (action.type) {
    case 'strike':
      return { status: 'running', time: 0, recorded: 0 };
    case 'pause':
      return state.status === 'running' ? { ...state, status: 'paused' } : state;
    case 'resume':
      return state.status === 'paused' && state.time < RUN_DURATION
        ? { ...state, status: 'running' }
        : state;
    case 'replay':
      return state.status === 'idle' ? state : { ...state, status: 'running', time: 0 };
    case 'reset':
      return initialPlayback;
    case 'tick': {
      if (state.status !== 'running') return state;
      const time = Math.min(RUN_DURATION, state.time + action.dt);
      return {
        status: time >= RUN_DURATION ? 'finished' : 'running',
        time,
        recorded: Math.max(state.recorded, time),
      };
    }
    case 'seek': {
      if (state.status === 'idle') return state;
      const time = Math.min(state.recorded, Math.max(0, action.time));
      // Seeking pauses playback; the end of a complete run stays "finished".
      const status = time >= RUN_DURATION ? 'finished' : 'paused';
      return { ...state, time, status };
    }
    case 'step':
      return playbackReducer(state, {
        type: 'seek',
        time: snap(state.time) + action.frames * FRAME_DT,
      });
    default:
      return state;
  }
}

/** Frame index for a simulated time. @param {number} time [s] */
export function frameAt(time) {
  return Math.round(time / FRAME_DT);
}
