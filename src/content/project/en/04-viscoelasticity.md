## Brain tissue as a viscoelastic material

> **Draft.** To be reviewed by the team, and checked against the literature.

Brain tissue is extremely soft. It behaves partly like an **elastic solid**, which springs back
after being deformed, and partly like a **viscous fluid**, which resists being deformed quickly.
Materials with both behaviors are called **viscoelastic**.

### The Kelvin–Voigt model

The simplest viscoelastic model places a spring and a damper side by side. In shear:

$$
\tau(t) = G\,\gamma(t) + \eta\,\dot\gamma(t)
$$

| Symbol   | Meaning                   | Unit |
| -------- | ------------------------- | ---- |
| $\tau$   | shear stress              | Pa   |
| $\gamma$ | shear strain              | –    |
| $G$      | shear modulus (stiffness) | Pa   |
| $\eta$   | viscosity                 | Pa·s |

Under a constant stress $\tau_0$ the strain does not appear instantly but creeps toward its final
value:

$$
\gamma(t) = \frac{\tau_0}{G}\left(1 - e^{-t/t_r}\right), \qquad t_r = \frac{\eta}{G}
$$

With the simulation's default values ($G = 2.4\ \text{kPa}$, $\eta = 5\ \text{Pa·s}$) the
retardation time is $t_r \approx 2.1\ \text{ms}$, comparable to the duration of an impact. This is
why both stiffness and viscosity matter in the simulation. Whether the Kelvin–Voigt model is
sufficient for brain tissue is an open question to check against the literature.

### How fast do waves travel?

In an elastic material, shear waves travel at

$$
c_s = \sqrt{\frac{G}{\rho}}
$$

With $G = 2.4\ \text{kPa}$ and $\rho = 1040\ \text{kg/m}^3$ this gives $c_s \approx 1.5\ \text{m/s}$,
about walking speed. Pressure (compression) waves are governed mainly by the bulk modulus $K$:

$$
c_p = \sqrt{\frac{K + \tfrac43 G}{\rho}} \approx \sqrt{\frac{K}{\rho}}
$$

For brain tissue, which is mostly water, this is roughly $1500\ \text{m/s}$. _[citation needed]_
A blow therefore launches a fast pressure wave that crosses a 15 cm head in about a tenth of a
millisecond, and a slow shear wave that needs around a tenth of a second.
