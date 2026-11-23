# AGENTS.md

Instructions for AI coding assistants (Claude Code, Copilot, Codex, etc.) working in this repository.
Human contributors should read [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## Project

A React website, hosted on GitHub Pages, that simulates and visualizes **shockwave propagation
through the brain** (e.g. head impacts, blast loading). Simulations run entirely in the browser.

- Live site: https://firecoder-n.github.io/brain-shockwave-simulation/
- Repo: https://github.com/FireCoder-N/brain-shockwave-simulation

## Working agreement (most important)

- The project owner is the **senior project manager and site designer**. The assistant is a helper.
- **Ask before deciding.** Do not make assumptions or decisions about architecture, dependencies,
  design (colors, typography, layout), physics models, or folder structure without explicit
  approval. Present options with a recommendation, then wait.
- Record approved non-trivial decisions in `docs/decisions/` (see the README there).
- Do not push to GitHub unless asked; the owner usually pushes.

## Stack

- **Vite 8 + React 19**, **JavaScript (JSX)** with type checking via JSDoc + `jsconfig.json`
  (`checkJs`). Do not convert files to TypeScript without approval.
- **React Router (HashRouter)**: URLs look like `/#/simulations`. Required because GitHub Pages
  has no server rewrites. Do not switch to BrowserRouter.
- **Node 24 / npm** (see `.nvmrc`). Use `npm`, not pnpm or yarn.
- **Tailwind CSS v4** (via `@tailwindcss/vite`); fonts Inter (body) + Space Grotesk (headings),
  self-hosted via `@fontsource-variable`.
- **ESLint + Prettier**, **Vitest**, **EditorConfig**.
- Deploy: **GitHub Actions** builds and publishes on every push to `main`.

## Commands

| Command              | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `npm install`        | Install dependencies                                 |
| `npm run dev`        | Dev server at http://localhost:5173                  |
| `npm run build`      | Production build into `dist/`                        |
| `npm run preview`    | Serve the production build locally                   |
| `npm run lint`       | ESLint                                               |
| `npm run format`     | Prettier (write)                                     |
| `npm test`           | Vitest (single run)                                  |
| `npm run check`      | Lint + format check + tests + build (run before PRs) |
| `npm run refs:sync`  | Sync `references/references.bib` with local PDFs     |
| `npm run refs:check` | Same, dry run                                        |

## Repository layout

```
.github/workflows/   ci.yml (PR checks), deploy.yml (build + deploy main to Pages)
docs/                project docs; docs/decisions/ = decision log (ADRs)
prototypes/          archived original HTML prototypes. Reference only, NOT deployed, do not edit
references/
  references.bib     bibliography (committed)
  notes/<key>.md     per-paper reading notes (committed)
  papers/            local PDFs, GITIGNORED; never commit PDFs
scripts/             Node tooling (sync-references.mjs, lib/)
public/              static files served as-is (meshes, textures, icons)
src/
  pages/             route-level components: Simulation (/), Project (/project), Team (/team)
  components/        shared UI components
    simulation/      simulation-page UI (Viewport, Hud, TransportBar, ParameterPanel, ...)
  simulations/
    shared/          data + helpers shared by all simulations (parameters, presets, modes, colormap)
    <name>/          one folder per simulation engine
  physics/           pure, framework-free math/solvers. No React, no DOM. Unit tested
  styles/            global CSS
  assets/            images etc. imported from code
```

## Conventions

- **Physics code is pure.** Solvers and models in `src/physics/` take plain inputs and return plain
  outputs. They must not import React or touch the DOM, so they can be tested and reused.
- **Units:** use SI units internally (m, kg, s, Pa). Convert only at the UI boundary. Document the
  units of every physical parameter in JSDoc, e.g. `@param {number} shearModulus Shear modulus [Pa]`.
- **Cite sources.** When a model or parameter comes from the literature, reference the citation key
  from `references/references.bib` in a comment, e.g. `// G0 from bilston2001linear, Table 2`.
- **Tests:** colocate as `*.test.js` next to the module. Every physics function gets tests.
- **Static asset paths:** files in `public/` must be referenced with `import.meta.env.BASE_URL`
  (the site is served from `/brain-shockwave-simulation/`), or imported from `src/assets/`.
- **Components:** function components, one per file, PascalCase filenames (`ImpactControls.jsx`).
- **Styling (Tailwind):** use only the semantic theme colors (`bg-bg`, `bg-surface`, `bg-surface-2`,
  `border-line`, `text-fg`, `text-muted`, `text-accent`, `bg-accent`, `text-accent-fg`,
  `bg-accent-soft`). Never use raw colors (`bg-slate-900`, `#hex`) or `dark:` overrides for colors.
  Tokens live only in `src/styles/global.css`; light and dark are inverses with the same sky-blue
  accent hue. Visual design changes need the owner's approval.
- **Heatmaps:** always use `src/simulations/shared/colormap.js`. Its test guarantees ≥ 3:1
  contrast against every theme background; if you change the palette, the test must still pass.
- **Parameters:** add or change simulation parameters in `src/simulations/shared/parameters.js`
  (the panel is generated from it). UI values are display units; convert with `toSI()`.

## References workflow

- PDFs go in `references/papers/` (local only, copyrighted, never committed).
- **After PDFs are added or changed, run `npm run refs:sync`.** It extracts DOIs, fetches BibTeX
  from doi.org, appends entries to `references.bib`, and creates `references/notes/<key>.md`.
  At the start of a session, if `references/papers/` contains PDFs, run `npm run refs:check`
  and offer to sync if anything is missing.
- Entries marked `TODO` in `references.bib` are stubs where no DOI was found. Fill them in by hand.

## Git workflow

- **GitHub Flow:** `main` is always deployable. Work on short-lived branches (`feat/...`, `fix/...`,
  `docs/...`, `chore/...`) and merge via pull request.
- **Conventional Commits:** `type(scope): summary`. Types: `feat`, `fix`, `docs`, `style`,
  `refactor`, `perf`, `test`, `build`, `ci`, `chore`. Example: `feat(physics): add Kelvin-Voigt solver`.
- Run `npm run check` before opening a PR.
