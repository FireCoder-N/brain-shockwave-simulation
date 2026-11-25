## Spherical coordinates

> **Draft.** To be reviewed by the team.

The direction a blow comes from is described with **spherical coordinates** $(\rho, \theta, \varphi)$:
a distance and two angles, much like latitude and longitude on a globe.

### Definition

- $\rho$: distance from the origin, $\rho \ge 0$.
- $\theta$: **polar angle**, measured from the positive $z$-axis, $0 \le \theta \le \pi$
  ($0^\circ$ to $180^\circ$).
- $\varphi$: **azimuth**, measured in the $xy$-plane from the positive $x$-axis, counterclockwise
  when seen from above, $0 \le \varphi < 2\pi$ ($0^\circ$ to $360^\circ$).

This is the convention used in physics and by the ISO 80000-2 standard. Many mathematics texts
swap the names $\theta$ and $\varphi$, so it is worth checking which convention a source uses.

### Conversion to Cartesian coordinates

$$
x = \rho \sin\theta \cos\varphi, \qquad y = \rho \sin\theta \sin\varphi, \qquad z = \rho \cos\theta
$$

and back again:

$$
\rho = \sqrt{x^2 + y^2 + z^2}, \qquad \theta = \arccos\frac{z}{\rho}, \qquad \varphi = \operatorname{atan2}(y, x)
$$

### The head coordinate frame

The simulation uses a right-handed frame fixed to the head, with its origin at the center of the
model. These are the axes shown by the gizmo in the simulation window.

| Axis | Points toward    |
| ---- | ---------------- |
| $x$  | the front (nose) |
| $y$  | the left side    |
| $z$  | the top          |

Some example blow directions:

| Where the blow comes from | $\theta$    | $\varphi$   |
| ------------------------- | ----------- | ----------- |
| Top of the head           | $0^\circ$   | (any)       |
| Forehead                  | $60^\circ$  | $0^\circ$   |
| Left side (temple)        | $90^\circ$  | $90^\circ$  |
| Back of the head          | $90^\circ$  | $180^\circ$ |
| Right side                | $90^\circ$  | $270^\circ$ |
| Uppercut to the chin      | $150^\circ$ | $0^\circ$   |

### Local directions at the impact point

At every point on the sphere there are three perpendicular unit vectors:

$$
\hat{\mathbf r} = (\sin\theta\cos\varphi,\ \sin\theta\sin\varphi,\ \cos\theta)
$$

$$
\hat{\boldsymbol\theta} = (\cos\theta\cos\varphi,\ \cos\theta\sin\varphi,\ -\sin\theta)
$$

$$
\hat{\boldsymbol\varphi} = (-\sin\varphi,\ \cos\varphi,\ 0)
$$

$\hat{\mathbf r}$ points outward, $\hat{\boldsymbol\theta}$ points down along the surface (toward
the chin), and $\hat{\boldsymbol\varphi}$ points sideways.

### Off-center blows

A blow aimed at the center travels along $-\hat{\mathbf r}$. An **off-center** blow is shifted
sideways by a distance $d$, in a direction $\psi$ within the plane perpendicular to the blow:

$$
\mathbf o = d\,\left(\cos\psi\,\hat{\boldsymbol\varphi} - \sin\psi\,\hat{\boldsymbol\theta}\right)
$$

$\psi = 0^\circ$ shifts the blow horizontally (like a hook) and $\psi = 90^\circ$ shifts it upward.
For a spherical head of radius $R$, the blow first touches the surface at

$$
\mathbf h = \mathbf o + \sqrt{R^2 - d^2}\;\hat{\mathbf r}, \qquad d < R
$$

If $d \ge R$ the blow misses the head.

### Why the offset matters

A force $\mathbf F$ along the blow produces a torque about the center of the head:

$$
\boldsymbol\tau = \mathbf h \times \mathbf F = \mathbf o \times \mathbf F, \qquad |\boldsymbol\tau| = d\,|\mathbf F|
$$

The $\hat{\mathbf r}$ part of $\mathbf h$ is parallel to $\mathbf F$ and contributes nothing. A
centered blow ($d = 0$) pushes the head straight; an off-center blow also makes it rotate.
Rotational loading is widely considered an important mechanism of brain injury.
_[citation needed]_
