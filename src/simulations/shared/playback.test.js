import { describe, expect, it } from 'vitest';
import { FRAME_DT, RUN_DURATION, frameAt, initialPlayback, playbackReducer } from './playback.js';

/** @param {import('./playback.js').PlaybackState} s @param {...import('./playback.js').PlaybackAction} actions */
const run = (s, ...actions) => actions.reduce(playbackReducer, s);

describe('playbackReducer', () => {
  it('strike starts a fresh run; ticks advance time and the recorded range', () => {
    const s = run(initialPlayback, { type: 'strike' }, { type: 'tick', dt: 0.005 });
    expect(s).toEqual({ status: 'running', time: 0.005, recorded: 0.005 });
  });

  it('finishes at the end of the run', () => {
    const s = run(initialPlayback, { type: 'strike' }, { type: 'tick', dt: 1 });
    expect(s).toEqual({ status: 'finished', time: RUN_DURATION, recorded: RUN_DURATION });
    expect(run(s, { type: 'resume' })).toBe(s);
  });

  it('seeking pauses and is limited to the recorded range', () => {
    const s = run(initialPlayback, { type: 'strike' }, { type: 'tick', dt: 0.01 });
    expect(run(s, { type: 'seek', time: 0.004 })).toEqual({
      status: 'paused',
      time: 0.004,
      recorded: 0.01,
    });
    expect(run(s, { type: 'seek', time: 0.5 }).time).toBe(0.01);
    expect(run(s, { type: 'seek', time: -1 }).time).toBe(0);
  });

  it('resuming after seeking back keeps the recorded range', () => {
    const s = run(
      initialPlayback,
      { type: 'strike' },
      { type: 'tick', dt: 0.01 },
      { type: 'seek', time: 0.002 },
      { type: 'resume' },
      { type: 'tick', dt: 0.001 },
    );
    expect(s.status).toBe('running');
    expect(s.time).toBeCloseTo(0.003);
    expect(s.recorded).toBe(0.01);
  });

  it('steps one frame at a time', () => {
    const s = run(
      initialPlayback,
      { type: 'strike' },
      { type: 'tick', dt: 0.01 },
      { type: 'seek', time: 0.005 },
    );
    expect(frameAt(run(s, { type: 'step', frames: 1 }).time)).toBe(frameAt(0.005) + 1);
    expect(frameAt(run(s, { type: 'step', frames: -1 }).time)).toBe(frameAt(0.005) - 1);
    expect(run(s, { type: 'step', frames: 1 }).time - 0.005).toBeCloseTo(FRAME_DT);
  });

  it('ignores seeking and ticking when idle; reset returns to idle', () => {
    expect(run(initialPlayback, { type: 'seek', time: 0.01 })).toBe(initialPlayback);
    expect(run(initialPlayback, { type: 'tick', dt: 0.01 })).toBe(initialPlayback);
    expect(run(initialPlayback, { type: 'strike' }, { type: 'reset' })).toEqual(initialPlayback);
  });

  it('replay restarts from 0 without discarding recorded frames', () => {
    const s = run(initialPlayback, { type: 'strike' }, { type: 'tick', dt: 1 }, { type: 'replay' });
    expect(s).toEqual({ status: 'running', time: 0, recorded: RUN_DURATION });
  });
});
