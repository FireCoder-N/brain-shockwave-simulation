/**
 * Simulation modes, kept on two independent axes:
 * - MODELS change the physics (geometry) and restart the simulation.
 * - DISPLAYS only change how the same simulation is drawn, and can switch live.
 */

/** @type {{ id: string, label: string, description: string }[]} */
export const MODELS = [
  { id: 'sphere', label: 'Sphere', description: 'A single viscoelastic sphere.' },
  { id: 'two-lobes', label: 'Two lobes', description: 'Left and right hemispheres.' },
];

/** @type {{ id: string, label: string, description: string }[]} */
export const DISPLAYS = [
  { id: 'heatmap', label: 'Stress heatmap', description: 'Color shows stress in the tissue.' },
  {
    id: 'deformation',
    label: 'Deformation',
    description: 'Shows how the layers bend and stretch.',
  },
  { id: 'force', label: 'Force propagation', description: 'Arrows show how force travels.' },
];

/** Playback speeds (fraction of real time). */
export const SPEEDS = [
  { value: 1, label: 'Real time' },
  { value: 1 / 10, label: '1/10×' },
  { value: 1 / 30, label: '1/30×' },
  { value: 1 / 100, label: '1/100×' },
];
