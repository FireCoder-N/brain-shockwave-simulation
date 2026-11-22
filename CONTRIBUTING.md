# Contributing

## Workflow (GitHub Flow)

1. Update `main`: `git switch main && git pull`
2. Create a branch: `git switch -c feat/short-description`
   (prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(physics): add Kelvin-Voigt wave solver
   fix(ui): clamp impact velocity slider
   docs: describe material parameters
   ```
4. Run `npm run check` (lint, formatting, tests, build).
5. Push and open a pull request into `main`. CI must pass before merging.
6. Merging to `main` deploys the site automatically.

## Code style

- Formatting is handled by Prettier, and linting by ESLint. With the recommended VS Code extensions
  (`.vscode/extensions.json`), files are formatted on save.
- Use SI units internally and document units in JSDoc.
- Keep physics code in `src/physics/` free of React/DOM, and cover it with tests.

## Adding a paper

1. Put the PDF in `references/papers/` (it stays local).
2. Run `npm run refs:sync`.
3. Fill in the generated note in `references/notes/<key>.md`.
4. Commit `references.bib` and the note, never the PDF.
