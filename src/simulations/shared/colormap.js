/**
 * Heatmap color scale shared by all simulations: blue (low) → cyan → green → amber → red (high).
 *
 * The stops are tuned so every color along the scale keeps ≥ 3:1 contrast (WCAG non-text) against
 * BOTH theme backgrounds. Bright yellow is deliberately replaced by amber because yellow
 * disappears on light backgrounds. See colormap.test.js.
 */
export const HEAT_STOPS = ['#4f7cf0', '#0a8db0', '#5a8c0c', '#cf6807', '#e5383b'];

/** @param {string} hex  "#rrggbb" @returns {[number, number, number]} */
export function hexToRgb(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

const RGB_STOPS = HEAT_STOPS.map(hexToRgb);

/**
 * Color at position t along the scale.
 * @param {number} t  Normalized value in [0, 1] (clamped).
 * @returns {[number, number, number]} sRGB components 0–255.
 */
export function heatColor(t) {
  const x = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0)) * (RGB_STOPS.length - 1);
  const k = Math.min(Math.floor(x), RGB_STOPS.length - 2);
  const f = x - k;
  const a = RGB_STOPS[k];
  const b = RGB_STOPS[k + 1];
  return /** @type {[number, number, number]} */ (a.map((v, i) => Math.round(v + (b[i] - v) * f)));
}

/** @param {number} t @returns {string} CSS color */
export function heatColorCss(t) {
  return `rgb(${heatColor(t).join(' ')})`;
}

/** CSS linear-gradient of the whole scale, e.g. for legends. @param {string} [direction] */
export function heatGradientCss(direction = 'to right') {
  return `linear-gradient(${direction}, ${HEAT_STOPS.join(', ')})`;
}
