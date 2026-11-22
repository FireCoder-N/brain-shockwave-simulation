# References

| Path             | Committed | Contents                                              |
| ---------------- | --------- | ----------------------------------------------------- |
| `references.bib` | yes       | BibTeX bibliography, the single source of citations   |
| `notes/<key>.md` | yes       | Reading notes per paper (equations, parameters, etc.) |
| `papers/`        | **no**    | Local PDFs (copyrighted, gitignored)                  |

## Adding papers

1. Drop PDFs into `papers/` (subfolders are fine).
2. Run `npm run refs:sync` (or `npm run refs:check` for a dry run).
   - The DOI is read from the PDF and BibTeX is fetched from doi.org.
   - The entry gets a key like `bilston2001linear` and a `file = {papers/...}` field.
   - A note template is created in `notes/<key>.md`.
   - If no DOI can be found, a `@misc` stub marked `TODO` is added. Complete it by hand.
3. Commit `references.bib` and the new notes.

Because PDFs are not shared through git, teammates exchange them separately (e.g. a shared drive).
The script reports bib entries whose PDF isn't present on the current machine.

## Citing in code

Reference the citation key in a comment next to the model or parameter it supports:

```js
// Shear modulus of brain tissue, bilston2001linear (Table 2)
const G0 = 1.2e3; // [Pa]
```
