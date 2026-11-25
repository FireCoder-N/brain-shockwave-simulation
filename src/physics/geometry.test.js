import { describe, expect, it } from 'vitest';
import {
  blowGeometry,
  cartesianToSpherical,
  sphericalBasis,
  sphericalToCartesian,
} from './geometry.js';

const deg = Math.PI / 180;
/** @param {number[]} a @param {number[]} b */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** @param {number[]} a */
const norm = (a) => Math.hypot(...a);
/** @param {number[]} actual @param {number[]} expected */
function expectVec(actual, expected) {
  actual.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 10));
}

describe('sphericalToCartesian', () => {
  it('maps landmark directions of the head frame', () => {
    expectVec(sphericalToCartesian(1, 0, 0), [0, 0, 1]); // top of head
    expectVec(sphericalToCartesian(1, 90 * deg, 0), [1, 0, 0]); // front (nose)
    expectVec(sphericalToCartesian(1, 90 * deg, 90 * deg), [0, 1, 0]); // left
    expectVec(sphericalToCartesian(2, 180 * deg, 0), [0, 0, -2]); // bottom
  });

  it('round-trips with cartesianToSpherical', () => {
    for (const [r, t, p] of [
      [0.08, 30 * deg, 45 * deg],
      [1, 120 * deg, 300 * deg],
      [3, 90 * deg, 180 * deg],
    ]) {
      const s = cartesianToSpherical(sphericalToCartesian(r, t, p));
      expect(s.rho).toBeCloseTo(r, 10);
      expect(s.theta).toBeCloseTo(t, 10);
      expect(s.phi).toBeCloseTo(p, 10);
    }
  });
});

describe('sphericalBasis', () => {
  it('is orthonormal and right-handed (r̂ × θ̂ = φ̂)', () => {
    const { rHat, thetaHat, phiHat } = sphericalBasis(70 * deg, 200 * deg);
    for (const v of [rHat, thetaHat, phiHat]) expect(norm(v)).toBeCloseTo(1, 12);
    expect(dot(rHat, thetaHat)).toBeCloseTo(0, 12);
    expect(dot(rHat, phiHat)).toBeCloseTo(0, 12);
    expect(dot(thetaHat, phiHat)).toBeCloseTo(0, 12);
    const cross = [
      rHat[1] * thetaHat[2] - rHat[2] * thetaHat[1],
      rHat[2] * thetaHat[0] - rHat[0] * thetaHat[2],
      rHat[0] * thetaHat[1] - rHat[1] * thetaHat[0],
    ];
    expectVec(cross, phiHat);
  });
});

describe('blowGeometry', () => {
  const R = 0.075;

  it('a centered blow hits the sphere at (θ, φ) and travels toward the center', () => {
    const g = blowGeometry({
      theta: 90 * deg,
      phi: 90 * deg,
      offset: 0,
      offsetDirection: 0,
      radius: R,
    });
    expectVec(g.direction, [0, -1, 0]);
    expectVec(/** @type {number[]} */ (g.hitPoint), [0, R, 0]);
    expect(g.leverArm).toBe(0);
  });

  it('an offset blow hits the sphere surface, off-center by d, perpendicular to its path', () => {
    const d = 0.03;
    const g = blowGeometry({
      theta: 60 * deg,
      phi: 30 * deg,
      offset: d,
      offsetDirection: 40 * deg,
      radius: R,
    });
    const hit = /** @type {number[]} */ (g.hitPoint);
    expect(norm(hit)).toBeCloseTo(R, 12);
    expect(norm(g.offsetVector)).toBeCloseTo(d, 12);
    expect(dot(g.offsetVector, g.direction)).toBeCloseTo(0, 12);
  });

  it('ψ = 0 shifts horizontally (hook-like), ψ = 90° shifts upward', () => {
    const side = blowGeometry({
      theta: 90 * deg,
      phi: 90 * deg,
      offset: 0.02,
      offsetDirection: 0,
      radius: R,
    });
    expectVec(side.offsetVector, [-0.02, 0, 0]); // φ̂ at the left temple points backward
    const up = blowGeometry({
      theta: 90 * deg,
      phi: 90 * deg,
      offset: 0.02,
      offsetDirection: 90 * deg,
      radius: R,
    });
    expectVec(up.offsetVector, [0, 0, 0.02]);
  });

  it('misses when the offset is at least the radius', () => {
    expect(
      blowGeometry({ theta: 1, phi: 1, offset: R, offsetDirection: 0, radius: R }).hitPoint,
    ).toBeNull();
  });
});
