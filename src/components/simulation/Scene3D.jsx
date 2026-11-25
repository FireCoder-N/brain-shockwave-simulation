import { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { blowGeometry, sphericalBasis } from '../../physics/geometry.js';
import { HEAD_RADIUS } from '../../simulations/shared/parameters.js';
import { HEAT_STOPS, heatColor } from '../../simulations/shared/colormap.js';
import useThemeColors from './useThemeColors.js';

// Scene uses the physics head frame directly: x = front, y = left, z = up.
THREE.Object3D.DEFAULT_UP.set(0, 0, 1);

const DEG = Math.PI / 180;

/** @typedef {{ center: [number, number, number], scale: [number, number, number] }} Shape */

/** Scene units: head radius = 1. Lobes are ellipsoids left (+y) and right (−y) of the midline. */
const SHAPES = {
  /** @type {Shape[]} */
  sphere: [{ center: [0, 0, 0], scale: [1, 1, 1] }],
  /** @type {Shape[]} */
  twoLobes: [
    { center: [0, 0.5, 0], scale: [1, 0.47, 0.85] },
    { center: [0, -0.5, 0], scale: [1, 0.47, 0.85] },
  ],
};

/** @param {Shape} shape @param {number} size  1 = outer surface @param {number} segments */
function shapeGeometry(shape, size, segments) {
  const g = new THREE.SphereGeometry(1, segments, Math.max(6, Math.round(segments * 0.75)));
  g.scale(shape.scale[0] * size, shape.scale[1] * size, shape.scale[2] * size);
  g.translate(...shape.center);
  return g;
}

/** Dispose GPU resources when a memoized object is replaced or unmounted. @param {{ dispose(): void }} obj */
function useDispose(obj) {
  useEffect(() => () => obj.dispose(), [obj]);
}

/**
 * PREVIEW coloring: stress falls off with distance from the impact point.
 * Placeholder until the physics engine provides real values.
 * @param {{ shape: Shape, segments: number, hit: number[] | null }} props
 */
function HeatPart({ shape, segments, hit }) {
  const geometry = useMemo(() => {
    const g = shapeGeometry(shape, 1, segments);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const d = hit
        ? Math.hypot(pos.getX(i) - hit[0], pos.getY(i) - hit[1], pos.getZ(i) - hit[2])
        : 2;
      const [r, gr, b] = heatColor(1 - d / 2);
      c.setRGB(r / 255, gr / 255, b / 255, THREE.SRGBColorSpace);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [shape, segments, hit]);
  useDispose(geometry);
  return (
    <mesh geometry={geometry}>
      <meshLambertMaterial vertexColors />
    </mesh>
  );
}

/** @param {{ shape: Shape, size: number, segments: number, color: string, opacity: number, wireframe?: boolean }} props */
function ShellPart({ shape, size, segments, color, opacity, wireframe = false }) {
  const geometry = useMemo(() => shapeGeometry(shape, size, segments), [shape, size, segments]);
  useDispose(geometry);
  return (
    <mesh geometry={geometry}>
      {wireframe ? (
        <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
      ) : (
        <meshLambertMaterial color={color} transparent opacity={opacity} depthWrite={false} />
      )}
    </mesh>
  );
}

const UP = new THREE.Vector3(0, 1, 0); // cylinder/cone geometry axis

/**
 * Solid arrow (cylinder shaft + cone head). WebGL lines are always 1 px wide, so solid
 * geometry keeps arrows visible at any zoom.
 * @param {{ origin: number[], dir: number[], length: number, color: string, radius?: number, head?: number }} props
 */
function Arrow({ origin, dir, length, color, radius = 0.02, head = 0.16 }) {
  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(UP, new THREE.Vector3(...dir).normalize()),
    [dir],
  );
  const shaft = Math.max(0, length - head);
  return (
    <group position={/** @type {[number, number, number]} */ (origin)} quaternion={quaternion}>
      <mesh position={[0, shaft / 2, 0]}>
        <cylinderGeometry args={[radius, radius, shaft, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, shaft + head / 2, 0]}>
        <coneGeometry args={[radius * 2.8, head, 20]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Interactive 3D view: orbit with mouse/touch, Blender-style axis gizmo (click an axis to view
 * along it). Shows the head model, the selected display mode and the incoming blow.
 *
 * @param {object} props
 * @param {'sphere' | 'twoLobes'} props.model
 * @param {'heatmap' | 'deformation' | 'force'} props.display
 * @param {Record<string, number>} props.values  Display-unit parameter values.
 * @param {string} props.label  Accessible description.
 */
export default function Scene3D({ model, display, values, label }) {
  const colors = useThemeColors();
  const shapes = SHAPES[model] ?? SHAPES.sphere;
  const segments = values.resolution;
  const layers = values.layers;
  const { impactPolar, impactAzimuth, offset, offsetDirection } = values;

  const blow = useMemo(() => {
    const theta = impactPolar * DEG;
    const phi = impactAzimuth * DEG;
    const g = blowGeometry({
      theta,
      phi,
      offset: (offset * 0.01) / HEAD_RADIUS, // cm → m → scene units
      offsetDirection: offsetDirection * DEG,
      radius: 1,
    });
    const basis = sphericalBasis(theta, phi);
    // The blow arrow starts outside the head and ends at the hit point (or passes by on a miss).
    const start = g.hitPoint
      ? g.hitPoint.map((v, i) => v + basis.rHat[i] * 1.6)
      : g.offsetVector.map((v, i) => v + basis.rHat[i] * 2);
    return { ...g, basis, start };
  }, [impactPolar, impactAzimuth, offset, offsetDirection]);

  const { direction, hitPoint, basis, start: blowStart } = blow;

  const fan = useMemo(() => {
    if (!hitPoint) return [];
    const { thetaHat, phiHat } = basis;
    return [
      [0, phiHat],
      [-35, phiHat],
      [35, phiHat],
      [-35, thetaHat],
      [35, thetaHat],
    ].map(([a, e]) => {
      const r = /** @type {number} */ (a) * DEG;
      const dir = direction.map(
        (d, i) => Math.cos(r) * d + Math.sin(r) * /** @type {number[]} */ (e)[i],
      );
      return { dir, length: 1.5 * Math.cos(r) + 0.1 };
    });
  }, [hitPoint, direction, basis]);

  return (
    <div role="img" aria-label={label} className="absolute inset-0">
      <Canvas
        flat // no tone mapping: keeps heatmap colors (and their tested contrast) intact
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [2.7, 2.0, 1.4], fov: 40, near: 0.1, far: 100 }}
      >
        {/* Lighting never brightens a color above its true value (max 0.8π + 0.2π = π). */}
        <ambientLight intensity={0.8 * Math.PI} />
        <directionalLight position={[3, 2, 4]} intensity={0.2 * Math.PI} />

        {display === 'heatmap' &&
          shapes.map((s, i) => <HeatPart key={i} shape={s} segments={segments} hit={hitPoint} />)}

        {display === 'deformation' &&
          shapes.map((s, i) => (
            <group key={i}>
              <ShellPart
                shape={s}
                size={1}
                segments={segments}
                color={colors.surface2}
                opacity={0.35}
              />
              {Array.from({ length: layers }, (_, k) => (k + 1) / layers).map((size) => (
                <ShellPart
                  key={size}
                  shape={s}
                  size={size}
                  segments={Math.max(8, Math.round(segments / 2))}
                  color={colors.accent}
                  opacity={0.2 + 0.5 * size}
                  wireframe
                />
              ))}
            </group>
          ))}

        {display === 'force' && (
          <>
            {shapes.map((s, i) => (
              <ShellPart
                key={i}
                shape={s}
                size={1}
                segments={segments}
                color={colors.surface2}
                opacity={0.45}
              />
            ))}
            {hitPoint &&
              fan.map((a, i) => (
                <Arrow
                  key={i}
                  origin={hitPoint}
                  dir={a.dir}
                  length={a.length}
                  color={colors.accent}
                  radius={0.014}
                  head={0.12}
                />
              ))}
          </>
        )}

        {/* Incoming blow */}
        <Arrow
          origin={blowStart}
          dir={direction}
          length={hitPoint ? 1.55 : 4}
          color={colors.fg}
          radius={0.03}
          head={0.2}
        />
        {hitPoint && (
          <mesh position={/** @type {[number, number, number]} */ (hitPoint)}>
            <sphereGeometry args={[0.045, 16, 12]} />
            <meshBasicMaterial color={colors.fg} />
          </mesh>
        )}

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping={false}
          minDistance={2.2}
          maxDistance={9}
        />
        <GizmoHelper alignment="top-right" margin={[64, 64]}>
          {/* Conventional axis colors x/y/z ≈ red/green/blue, taken from the tested heat palette. */}
          <GizmoViewport
            axisColors={[HEAT_STOPS[4], HEAT_STOPS[2], HEAT_STOPS[0]]}
            labelColor="#ffffff"
            axisHeadScale={0.9}
          />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}
