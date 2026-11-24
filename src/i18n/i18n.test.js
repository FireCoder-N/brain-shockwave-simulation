import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LANGUAGES } from './languages.js';
import { PARAMETER_GROUPS, PARAMETERS, PRESETS } from '../simulations/shared/parameters.js';
import { DISPLAYS, MODELS } from '../simulations/shared/modes.js';

/** @param {string} code */
const load = (code) =>
  JSON.parse(readFileSync(new URL(`./locales/${code}.json`, import.meta.url), 'utf8'));

/** Flatten nested keys: { a: { b: 'x' } } → { 'a.b': 'x' }. @param {any} obj @param {string} [prefix] */
function flatten(obj, prefix = '') {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') Object.assign(out, flatten(v, key));
    else out[key] = v;
  }
  return out;
}

/** @param {string} s */
const placeholders = (s) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();

const en = flatten(load('en'));

describe('locales', () => {
  it('cover every parameter, group, preset, model and display', () => {
    const required = [
      ...PARAMETERS.flatMap((p) => [`params.${p.id}.label`, `params.${p.id}.description`]),
      ...PARAMETER_GROUPS.map((g) => `groups.${g.id}`),
      ...PRESETS.map((p) => `presets.${p.id}`),
      ...MODELS.map((m) => `models.${m}`),
      ...DISPLAYS.map((d) => `displays.${d}`),
    ];
    for (const key of required) expect(en[key], key).toBeTruthy();
  });

  for (const { code } of LANGUAGES.filter((l) => l.code !== 'en')) {
    it(`${code} has exactly the English keys, non-empty, with the same {{placeholders}}`, () => {
      const tr = flatten(load(code));
      expect(Object.keys(tr).sort()).toEqual(Object.keys(en).sort());
      for (const [key, value] of Object.entries(en)) {
        if (key.startsWith('_meta')) continue;
        expect(tr[key], `${code}: ${key}`).toBeTruthy();
        expect(placeholders(tr[key]), `${code}: ${key}`).toEqual(placeholders(value));
      }
    });
  }
});
