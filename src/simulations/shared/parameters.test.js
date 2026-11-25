import { describe, expect, it } from 'vitest';
import {
  HEAD_RADIUS,
  PARAMETERS,
  PRESETS,
  defaultValues,
  matchPreset,
  presetValues,
  toSI,
} from './parameters.js';

describe('parameter definitions', () => {
  it('have unique ids and defaults inside their range', () => {
    expect(new Set(PARAMETERS.map((p) => p.id)).size).toBe(PARAMETERS.length);
    for (const p of PARAMETERS) {
      expect(p.min).toBeLessThan(p.max);
      expect(p.default).toBeGreaterThanOrEqual(p.min);
      expect(p.default).toBeLessThanOrEqual(p.max);
    }
  });

  it('presets only use known parameters, within range', () => {
    for (const preset of PRESETS) {
      for (const [id, value] of Object.entries(preset.values)) {
        const def = PARAMETERS.find((p) => p.id === id);
        expect(def, id).toBeDefined();
        expect(value).toBeGreaterThanOrEqual(def?.min ?? -Infinity);
        expect(value).toBeLessThanOrEqual(def?.max ?? Infinity);
      }
    }
  });

  it('the largest offset still hits the head', () => {
    const offset = /** @type {import('./parameters.js').ParameterDef} */ (
      PARAMETERS.find((p) => p.id === 'offset')
    );
    expect(offset.max * offset.scale).toBeLessThan(HEAD_RADIUS);
  });
});

describe('toSI', () => {
  it('converts display units to SI', () => {
    const si = toSI({
      ...defaultValues(),
      shearModulus: 2.4,
      guard: 50,
      impactPolar: 90,
      offset: 3,
    });
    expect(si.shearModulus).toBeCloseTo(2400); // kPa → Pa
    expect(si.guard).toBeCloseTo(0.5); // % → fraction
    expect(si.impactPolar).toBeCloseTo(Math.PI / 2); // ° → rad
    expect(si.offset).toBeCloseTo(0.03); // cm → m
  });
});

describe('matchPreset', () => {
  it('recognizes presets and falls back to custom', () => {
    expect(matchPreset(presetValues('jab'))).toBe('jab');
    expect(matchPreset(presetValues('hook'))).toBe('hook');
    expect(matchPreset({ ...presetValues('jab'), viscosity: 19 })).toBe('custom');
  });
});
