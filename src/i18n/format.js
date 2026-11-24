/**
 * Locale-aware number formatting (e.g. 2.4 in English, 2,4 in Spanish/Portuguese/Greek/Serbian).
 * @param {number} value
 * @param {number} decimals  Fixed number of fraction digits.
 * @param {string} lng       i18next language code.
 */
export function formatNumber(value, decimals, lng) {
  return new Intl.NumberFormat(lng, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
