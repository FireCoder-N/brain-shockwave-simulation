import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HEAT_STOPS, heatColor, hexToRgb } from './colormap.js';

/** WCAG relative luminance. @param {number[]} rgb */
function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** @param {number[]} a @param {number[]} b */
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Read the background tokens straight from the stylesheet so the test tracks the palette. */
function themeBackgrounds() {
  const css = readFileSync(new URL('../../styles/global.css', import.meta.url), 'utf8');
  return [...css.matchAll(/--(?:bg|surface|surface-2):\s*(#[0-9a-f]{6})/gi)].map((m) => m[1]);
}

describe('heatColor', () => {
  it('starts and ends at the first and last stop, and clamps out-of-range input', () => {
    expect(heatColor(0)).toEqual(hexToRgb(HEAT_STOPS[0]));
    expect(heatColor(1)).toEqual(hexToRgb(HEAT_STOPS.at(-1)));
    expect(heatColor(-5)).toEqual(heatColor(0));
    expect(heatColor(7)).toEqual(heatColor(1));
    expect(heatColor(NaN)).toEqual(heatColor(0));
  });

  it('keeps ≥ 3:1 contrast against every light and dark background token', () => {
    const backgrounds = themeBackgrounds();
    expect(backgrounds.length).toBe(6); // bg, surface, surface-2 × light/dark
    for (const bg of backgrounds) {
      for (let i = 0; i <= 200; i++) {
        expect(contrast(heatColor(i / 200), hexToRgb(bg))).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
