# Prototypes (archived)

Early, standalone HTML simulation attempts, kept **unmodified** for reference. They are not part of
the React app and are **not deployed**. Open a file directly in a browser to view it (needs internet
for CDN scripts).

| File                               | Description                                                                                                                                                                                    |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `3d_biomechanical_simulation.html` | "NeuroGuard 3D": 3D head-impact simulation with impact telemetry. Three.js 0.160 + Tailwind via CDN. Viscoelastic wave model with spatial damping; tissue density 1000 kg/m³; cites Bilston et al. |
| `cerebro-viscoelastico.html`       | (Spanish) Viscoelastic sphere struck by a hook punch. 2D canvas, no dependencies. Three concentric layers of Kelvin-Voigt spring-damper elements; adjustable viscosity.                         |

When a prototype is ported to React, note the corresponding `src/simulations/<name>/` folder here.
