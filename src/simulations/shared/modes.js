/**
 * Simulation modes, kept on two independent axes (labels: models.<id> / displays.<id> in the
 * translation files):
 * - MODELS change the physics (geometry) and restart the simulation.
 * - DISPLAYS only change how the same simulation is drawn, and can switch live.
 */

export const MODELS = ['sphere', 'twoLobes'];

export const DISPLAYS = ['heatmap', 'deformation', 'force'];

/** Playback speeds as a fraction of real time (1 is labeled "Real time"). */
export const SPEEDS = [1, 1 / 10, 1 / 30, 1 / 100];
