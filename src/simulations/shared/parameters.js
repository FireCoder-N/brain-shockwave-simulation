/**
 * Parameter definitions for the simulation UI. The parameter panel is generated from this data.
 *
 * Values in the UI are in DISPLAY units (e.g. kPa). `scale` converts to SI: si = display × scale.
 * Convert with `toSI()` at the boundary to the physics engine.
 *
 * PROVISIONAL: ranges and defaults are placeholders inspired by the prototypes. They must be
 * validated against the literature (references/references.bib) before the physics is wired up.
 */

/**
 * @typedef {object} ParameterDef
 * @property {string} id
 * @property {string} label        Plain-language name (audience: public + students).
 * @property {string} [symbol]     Physics symbol, shown next to the label.
 * @property {string} unit         Display unit ('' for dimensionless).
 * @property {number} scale        Multiply a display value by this to get SI.
 * @property {number} min
 * @property {number} max
 * @property {number} step
 * @property {number} default
 * @property {string} description  One-sentence explanation shown under the slider.
 * @property {boolean} [advanced]  Hidden unless "Show advanced" is on.
 */

/**
 * @typedef {object} ParameterGroup
 * @property {string} id
 * @property {string} label
 * @property {ParameterDef[]} params
 */

/** @type {ParameterGroup[]} */
export const PARAMETER_GROUPS = [
  {
    id: 'impact',
    label: 'Impact',
    params: [
      {
        id: 'punchSpeed',
        label: 'Punch speed',
        symbol: 'v',
        unit: 'm/s',
        scale: 1,
        min: 2,
        max: 15,
        step: 0.5,
        default: 8,
        description: 'How fast the fist is moving when it hits.',
      },
      {
        id: 'guard',
        label: 'Guard',
        unit: '%',
        scale: 0.01,
        min: 0,
        max: 100,
        step: 5,
        default: 50,
        description: 'How much of the blow is absorbed by blocking.',
      },
      {
        id: 'fistMass',
        label: 'Effective fist mass',
        symbol: 'm',
        unit: 'kg',
        scale: 1,
        min: 0.5,
        max: 3,
        step: 0.1,
        default: 1.2,
        description: 'Mass of the fist and arm that takes part in the impact.',
        advanced: true,
      },
      {
        id: 'impactAngle',
        label: 'Impact angle',
        symbol: 'θ',
        unit: '°',
        scale: Math.PI / 180,
        min: -90,
        max: 90,
        step: 5,
        default: 0,
        description: 'Direction of the blow; 0° hits the side of the head straight on.',
        advanced: true,
      },
    ],
  },
  {
    id: 'tissue',
    label: 'Brain tissue',
    params: [
      {
        id: 'shearModulus',
        label: 'Stiffness',
        symbol: 'G',
        unit: 'kPa',
        scale: 1e3,
        min: 0.5,
        max: 10,
        step: 0.1,
        default: 2.4,
        description: 'Resistance to shape change. Softer tissue deforms more.',
      },
      {
        id: 'viscosity',
        label: 'Viscosity',
        symbol: 'η',
        unit: 'Pa·s',
        scale: 1,
        min: 0,
        max: 20,
        step: 0.5,
        default: 5,
        description: 'Internal friction. Higher values damp the wave faster.',
      },
      {
        id: 'density',
        label: 'Density',
        symbol: 'ρ',
        unit: 'kg/m³',
        scale: 1,
        min: 1000,
        max: 1100,
        step: 5,
        default: 1040,
        description: 'Mass per volume of the tissue.',
        advanced: true,
      },
    ],
  },
  {
    id: 'model',
    label: 'Model',
    params: [
      {
        id: 'layers',
        label: 'Tissue layers',
        unit: '',
        scale: 1,
        min: 1,
        max: 5,
        step: 1,
        default: 3,
        description: 'Number of concentric layers the brain is divided into.',
      },
      {
        id: 'resolution',
        label: 'Mesh resolution',
        unit: '',
        scale: 1,
        min: 8,
        max: 64,
        step: 8,
        default: 24,
        description: 'Points per layer. Higher is more detailed but slower.',
        advanced: true,
      },
    ],
  },
];

/** All parameter definitions, flattened. */
export const PARAMETERS = PARAMETER_GROUPS.flatMap((g) => g.params);

/** @typedef {Record<string, number>} ParameterValues  Display-unit values keyed by parameter id. */

/** @returns {ParameterValues} */
export function defaultValues() {
  return Object.fromEntries(PARAMETERS.map((p) => [p.id, p.default]));
}

/**
 * Convert display-unit values to SI for the physics engine.
 * @param {ParameterValues} values
 * @returns {ParameterValues}
 */
export function toSI(values) {
  return Object.fromEntries(PARAMETERS.map((p) => [p.id, (values[p.id] ?? p.default) * p.scale]));
}

/**
 * Presets for non-expert visitors. Values are display units; unspecified parameters use defaults.
 * PROVISIONAL placeholder values (see file header).
 * @type {{ id: string, label: string, values: Partial<ParameterValues> }[]}
 */
export const PRESETS = [
  { id: 'jab', label: 'Jab', values: { punchSpeed: 6, fistMass: 0.9, guard: 50 } },
  { id: 'hook', label: 'Heavy hook', values: { punchSpeed: 11, fistMass: 1.8, guard: 20 } },
];

/** @param {string} presetId @returns {ParameterValues} */
export function presetValues(presetId) {
  const preset = PRESETS.find((p) => p.id === presetId);
  return { ...defaultValues(), ...(preset?.values ?? {}) };
}

/**
 * Which preset the current values match exactly, or 'custom'.
 * @param {ParameterValues} values
 */
export function matchPreset(values) {
  const match = PRESETS.find((p) => {
    const target = presetValues(p.id);
    return PARAMETERS.every((d) => target[d.id] === values[d.id]);
  });
  return match?.id ?? 'custom';
}
