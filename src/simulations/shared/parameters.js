/**
 * Parameter definitions for the simulation UI. The parameter panel is generated from this data.
 * Labels and descriptions are translated: see `params.<id>.label` / `.description` and
 * `groups.<id>` in src/i18n/locales/*.json.
 *
 * Values in the UI are in DISPLAY units (e.g. kPa). `scale` converts to SI: si = display × scale.
 * Convert with `toSI()` at the boundary to the physics engine.
 *
 * PROVISIONAL: ranges and defaults are placeholders inspired by the prototypes. They must be
 * validated against the literature (references/references.bib) before the physics is wired up.
 */

/**
 * @typedef {object} ParameterDef
 * @property {string} id           Also the translation key: params.<id>.label / .description
 * @property {string} [symbol]     Physics symbol, shown next to the label.
 * @property {string} unit         Display unit ('' for dimensionless).
 * @property {number} scale        Multiply a display value by this to get SI.
 * @property {number} min
 * @property {number} max
 * @property {number} step
 * @property {number} default
 * @property {boolean} [advanced]  Hidden unless "Show advanced" is on.
 */

/**
 * @typedef {object} ParameterGroup
 * @property {string} id  Translation key: groups.<id>
 * @property {ParameterDef[]} params
 */

const DEG = Math.PI / 180;

/** Radius of the spherical head model [m]. PROVISIONAL. */
export const HEAD_RADIUS = 0.075;

/** @type {ParameterGroup[]} */
export const PARAMETER_GROUPS = [
  {
    id: 'impact',
    params: [
      {
        id: 'punchSpeed',
        symbol: 'v',
        unit: 'm/s',
        scale: 1,
        min: 2,
        max: 15,
        step: 0.5,
        default: 8,
      },
      { id: 'guard', unit: '%', scale: 0.01, min: 0, max: 100, step: 5, default: 50 },
      {
        id: 'impactPolar',
        symbol: 'θ',
        unit: '°',
        scale: DEG,
        min: 0,
        max: 180,
        step: 5,
        default: 90,
      },
      {
        id: 'impactAzimuth',
        symbol: 'φ',
        unit: '°',
        scale: DEG,
        min: 0,
        max: 360,
        step: 5,
        default: 90,
      },
      { id: 'offset', symbol: 'd', unit: 'cm', scale: 0.01, min: 0, max: 6, step: 0.5, default: 0 },
      {
        id: 'offsetDirection',
        symbol: 'ψ',
        unit: '°',
        scale: DEG,
        min: 0,
        max: 360,
        step: 15,
        default: 0,
        advanced: true,
      },
      {
        id: 'fistMass',
        symbol: 'm',
        unit: 'kg',
        scale: 1,
        min: 0.5,
        max: 3,
        step: 0.1,
        default: 1.2,
        advanced: true,
      },
    ],
  },
  {
    id: 'tissue',
    params: [
      {
        id: 'shearModulus',
        symbol: 'G',
        unit: 'kPa',
        scale: 1e3,
        min: 0.5,
        max: 10,
        step: 0.1,
        default: 2.4,
      },
      {
        id: 'viscosity',
        symbol: 'η',
        unit: 'Pa·s',
        scale: 1,
        min: 0,
        max: 20,
        step: 0.5,
        default: 5,
      },
      {
        id: 'density',
        symbol: 'ρ',
        unit: 'kg/m³',
        scale: 1,
        min: 1000,
        max: 1100,
        step: 5,
        default: 1040,
        advanced: true,
      },
    ],
  },
  {
    id: 'model',
    params: [
      { id: 'layers', unit: '', scale: 1, min: 1, max: 5, step: 1, default: 3 },
      {
        id: 'resolution',
        unit: '',
        scale: 1,
        min: 8,
        max: 64,
        step: 8,
        default: 32,
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
 * Presets for non-expert visitors (translation key: presets.<id>). Display units; unspecified
 * parameters use defaults. PROVISIONAL placeholder values (see file header).
 * @type {{ id: string, values: Partial<ParameterValues> }[]}
 */
export const PRESETS = [
  {
    id: 'jab',
    values: { punchSpeed: 6, fistMass: 0.9, guard: 50, impactPolar: 80, impactAzimuth: 0 },
  },
  {
    id: 'hook',
    values: {
      punchSpeed: 11,
      fistMass: 1.8,
      guard: 20,
      impactPolar: 90,
      impactAzimuth: 90,
      offset: 3,
    },
  },
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
