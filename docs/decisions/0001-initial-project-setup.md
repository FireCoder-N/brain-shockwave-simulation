# 0001. Initial project setup and stack

- Status: accepted
- Date: 2026-11-22

## Context

The project needs a React website on GitHub Pages to host brain shockwave simulations. Two
standalone HTML prototypes existed. The repository layout loosely follows
[Realiscapeverse](https://github.com/FireCoder-N/Realiscapeverse), with modern tooling added.

## Decision

| Topic        | Choice                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| Build / UI   | Vite 8 + React 19                                                                                        |
| Language     | JavaScript (JSX) with JSDoc type checking (`checkJs`); TypeScript possible later                         |
| Routing      | React Router `HashRouter` (GitHub Pages has no server rewrites)                                          |
| Deployment   | GitHub Actions → GitHub Pages on push to `main`                                                          |
| Runtime      | Node 24 LTS, npm                                                                                         |
| Quality      | ESLint + Prettier, Vitest, EditorConfig, VS Code settings                                                |
| Git workflow | GitHub Flow + Conventional Commits                                                                       |
| License      | MIT (code) + CC BY 4.0 (content)                                                                         |
| Papers       | `references.bib` + notes committed; PDFs local and gitignored; `npm run refs:sync` keeps the bib in sync |
| Prototypes   | Archived unmodified in `prototypes/`, not deployed                                                       |
| Agent docs   | `AGENTS.md` only                                                                                         |
| Styling      | Not decided yet (pending design)                                                                         |

## Consequences

- URLs contain `#` (e.g. `/#/simulations`), but deep links always work on Pages.
- PDFs must be shared among team members outside git.
- The Vite `base` is `/brain-shockwave-simulation/` in production; renaming the repo requires
  updating `vite.config.js`.
