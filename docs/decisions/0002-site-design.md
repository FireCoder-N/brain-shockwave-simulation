# 0002. Site design and simulation page layout

- Status: accepted
- Date: 2026-11-23

## Context

First real design of the site, derived from the two prototypes. The audience is mixed (public +
students), so the interface must be friendly by default but scientifically honest.

## Decision

| Topic         | Choice                                                                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages         | Simulation (home, `/`) · Project (`/project`, includes Sources) · Team (`/team`)                                                                         |
| Home layout   | Stacked and fits one screen on desktop: viewport ~60%, playback bar, tabbed panel ~40% (scrolls inside). Stacks with page scroll on mobile               |
| Panel         | Tabs: Parameters / Statistics                                                                                                                            |
| Live feedback | HUD overlay on the viewport (key numbers) + full charts in the Statistics tab                                                                            |
| Modes         | Two independent selectors: **Model** (sphere, two lobes, ...; restarts physics) and **Display** (heatmap, deformation, force; live switch)               |
| Parameters    | Grouped (Impact, Brain tissue, Model), presets (Jab, Heavy hook), "Show advanced" toggle                                                                 |
| Theme         | Follows OS setting + manual toggle. Light and dark are inverses; same sky-blue accent hue (`#38bdf8` dark, `#0369a1` light)                              |
| Heatmap       | Blue → cyan → green → amber → red; ≥ 3:1 contrast on all theme backgrounds (unit tested). Amber replaces yellow, which is invisible on light backgrounds |
| Styling       | Tailwind CSS v4 with semantic color tokens defined once in `global.css`                                                                                  |
| Fonts         | Inter (UI/body) + Space Grotesk (headings), self-hosted                                                                                                  |
| Charts        | Library not chosen yet; decide once physics outputs are known                                                                                            |

## Consequences

- Adding a model or display mode means adding an entry to `simulations/shared/modes.js` plus its
  renderer; the UI slots already exist.
- Parameter ranges and presets are provisional and must be validated against the literature.
- Project and Team pages contain placeholder text until the team writes it.
