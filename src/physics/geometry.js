/**
 * Spherical-coordinate geometry for the head model and the incoming blow.
 *
 * Head-fixed frame (right-handed): origin at the center of the brain model,
 * x → front (nose), y → left, z → up.
 * Spherical coordinates follow the physics / ISO 80000-2 convention:
 *   ρ  radial distance [m]
 *   θ  polar angle from +z (top of the head) [rad], 0 … π
 *   φ  azimuth in the xy-plane from +x (front), counter-clockwise seen from above [rad], 0 … 2π
 */

/** @typedef {[number, number, number]} Vec3 */

/**
 * @param {number} rho    Radial distance [m]
 * @param {number} theta  Polar angle [rad]
 * @param {number} phi    Azimuth [rad]
 * @returns {Vec3} Cartesian position [m]
 */
export function sphericalToCartesian(rho, theta, phi) {
  const s = Math.sin(theta);
  return [rho * s * Math.cos(phi), rho * s * Math.sin(phi), rho * Math.cos(theta)];
}

/**
 * @param {Vec3} p  Cartesian position [m]
 * @returns {{ rho: number, theta: number, phi: number }} φ normalized to [0, 2π)
 */
export function cartesianToSpherical([x, y, z]) {
  const rho = Math.hypot(x, y, z);
  if (rho === 0) return { rho: 0, theta: 0, phi: 0 };
  const phi = Math.atan2(y, x);
  return { rho, theta: Math.acos(z / rho), phi: phi < 0 ? phi + 2 * Math.PI : phi };
}

/**
 * Local orthonormal basis at (θ, φ): r̂ (outward), θ̂ (toward the chin, along the meridian),
 * φ̂ (sideways, counter-clockwise seen from above).
 * @param {number} theta [rad]
 * @param {number} phi   [rad]
 * @returns {{ rHat: Vec3, thetaHat: Vec3, phiHat: Vec3 }}
 */
export function sphericalBasis(theta, phi) {
  const [st, ct, sp, cp] = [Math.sin(theta), Math.cos(theta), Math.sin(phi), Math.cos(phi)];
  return {
    rHat: [st * cp, st * sp, ct],
    thetaHat: [ct * cp, ct * sp, -st],
    phiHat: [-sp, cp, 0],
  };
}

/** @param {Vec3} a @param {Vec3} b @returns {Vec3} */
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
/** @param {Vec3} a @param {number} k @returns {Vec3} */
const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

/**
 * Geometry of a blow arriving from direction (θ, φ), traveling toward the head center, optionally
 * shifted sideways by an offset so that it glances off-center (producing rotation).
 *
 * The offset lies in the plane perpendicular to the blow: ψ = 0 shifts it along φ̂ (horizontally,
 * like a hook), ψ = 90° shifts it along −θ̂ (upward).
 *
 * @param {object} p
 * @param {number} p.theta            Polar angle of the blow's origin [rad]
 * @param {number} p.phi              Azimuth of the blow's origin [rad]
 * @param {number} p.offset           Off-center distance d of the blow line [m], ≥ 0
 * @param {number} p.offsetDirection  Offset direction ψ [rad]
 * @param {number} p.radius           Head (sphere) radius R [m]
 * @returns {{
 *   direction: Vec3,        unit vector the blow travels along (−r̂)
 *   offsetVector: Vec3,     closest point of the blow line to the center [m]
 *   hitPoint: Vec3 | null,  where the blow first meets the sphere [m], null if it misses (d ≥ R)
 *   leverArm: number        moment arm of the blow about the center [m] (= d)
 * }}
 */
export function blowGeometry({ theta, phi, offset, offsetDirection, radius }) {
  const { rHat, thetaHat, phiHat } = sphericalBasis(theta, phi);
  const offsetVector = add(
    scale(phiHat, offset * Math.cos(offsetDirection)),
    scale(thetaHat, -offset * Math.sin(offsetDirection)),
  );
  const hitPoint =
    offset < radius ? add(offsetVector, scale(rHat, Math.sqrt(radius ** 2 - offset ** 2))) : null;
  return { direction: scale(rHat, -1), offsetVector, hitPoint, leverArm: offset };
}
