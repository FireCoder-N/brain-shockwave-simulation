# Brain Shockwave Simulation

Interactive, browser-based simulations of shockwave propagation through the brain.

**Live site:** https://firecoder-n.github.io/brain-shockwave-simulation/

> Status: early setup. The site skeleton is in place; simulations are in development.

## Getting started

Requirements: [Node.js](https://nodejs.org/) 24 (see `.nvmrc`) and npm.

```bash
git clone https://github.com/FireCoder-N/brain-shockwave-simulation.git
cd brain-shockwave-simulation
npm install
npm run dev        # http://localhost:5173
```

| Command             | Purpose                                 |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start the dev server                    |
| `npm run build`     | Production build into `dist/`           |
| `npm run preview`   | Preview the production build            |
| `npm run check`     | Lint, format check, tests and build     |
| `npm run refs:sync` | Update the bibliography from local PDFs |

## Repository layout

| Path          | Contents                                                         |
| ------------- | ---------------------------------------------------------------- |
| `src/`        | React application (pages, components, simulations, physics)      |
| `public/`     | Static files served as-is                                        |
| `references/` | Bibliography (`references.bib`) and per-paper notes              |
| `prototypes/` | Archived original HTML prototypes (reference only, not deployed) |
| `docs/`       | Project documentation and decision log                           |
| `scripts/`    | Development tooling                                              |

## Scientific references

Papers are cited through [`references/references.bib`](references/references.bib), with reading
notes in [`references/notes/`](references/notes/). PDFs are kept locally and are **not** committed
(copyright). See [`references/README.md`](references/README.md).

## Deployment

Every push to `main` is built and deployed to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

- Code: [MIT](LICENSE)
- Written content, figures and documentation: [CC BY 4.0](LICENSE-CONTENT)
