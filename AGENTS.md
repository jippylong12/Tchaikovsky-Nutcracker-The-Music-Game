# Agent Instructions

## Tool Preferences

- Do not use the Browser plugin, in-app browser, browser-use tooling, or browser automation unless Marcus explicitly asks for Browser in the current request.
- For UI work, prefer code inspection, automated tests, build checks, and user-provided screenshots. Ask before starting browser-based visual review.

## Project Source Of Truth

- Treat the recovered Flash files under `analysis/setup/app/games/` as the authority for behavior, placement, text, and assets.
- For the Nutcracker song chooser/game work, read `docs/nutcracker-song-source-map.md` before changing UI or behavior.
- For recurring agent lessons, gotchas, and exact commands, read `docs/agent-knowledge-base.md` before starting source-reconstruction work.
- During source-reconstruction work, update `docs/nutcracker-song-source-map.md` with new source evidence and update `docs/agent-knowledge-base.md` with reusable mistakes/tool limits before claiming the pass is complete.
- For broader architecture and source inventory context, use:
  - `docs/source-inventory.md`
  - `docs/behavior-map.md`
  - `docs/asset-catalog-pipeline.md`
  - `docs/visual-asset-import-strategy.md`
  - `docs/remake-architecture-spec.md`

## Nutcracker Fidelity Rules

- Prefer extracted or rendered source assets in `app/src/assets/nutcracker-source/` before drawing CSS approximations.
- When a DOM fallback is necessary, document the exact SWF/tool limitation in `docs/nutcracker-song-source-map.md` or `docs/agent-knowledge-base.md`.
- Do not add generic app controls inside the preserved 640 x 480 Flash viewport when a source control, source text object, or source ActionScript behavior exists.
- If an asset name turns out to be wrong or misleading, add a correctly named promoted asset/script and update the docs instead of continuing to use the misleading name.
- If two rendered assets are pixel-identical but come from different source symbols or scenes, prefer a correctly named source-local promotion for the runtime import and document why. Pixel identity is not enough reason to keep misleading provenance.
- If a full sprite/frame render fails, inspect its child shapes/text/bitmaps before accepting a broad fallback. Promote recoverable child layers and document the remaining display-list or tooling gap in the source map and knowledge base.
- If a source button cannot be flattened as one symbol, compose recoverable source child layers rather than falling back to label-only or CSS-only UI. Example: chooser `quiter` uses shape id `0205` plus text id `0204` because button id `0206` renders locally as a 1 x 1 placeholder.
- For completion, reward, unlock, or progress visuals, inspect hidden/root-gated source instances before creating new badges or indicators. Example: chooser `magicKey` is sprite id `0213`, hidden until `nutDoorsVisited == 8`, and should be promoted from source art rather than replaced by generic completion UI.
- Keep `JIP-349` open for UI approval unless Marcus explicitly approves the UI. UI code changes should not be marked Done from automated checks alone.

## Source-Reconstruction Loop

For each Nutcracker chooser/song-game pass:

1. Inspect the relevant source SWF/data dumps under `analysis/setup/app/games/` and generated evidence under `app/generated/nutcracker-source-extract/`.
2. Promote or reuse source-backed runtime assets in `app/src/assets/nutcracker-source/` before adding DOM/CSS fallbacks.
3. Add source provenance to the DOM for any fallback that remains.
4. Update `docs/nutcracker-song-source-map.md` with the recovered placement/action/text evidence.
5. Update `docs/agent-knowledge-base.md` with reusable mistakes, renderer limits, and exact commands.
6. Run the validation baseline below before claiming the pass is ready for review.

When an extraction or render probe fails, record the exact source symbol/frame IDs, command shape, and observed output in the docs above. A failed probe is reusable project knowledge, not disposable chat context.

If Marcus reports that a page looks default, basic, or made up, treat that as a source-fidelity defect. Do not answer by only updating Linear or by polishing invented UI. Inspect the Flash source, extract/promote recoverable assets, update the source map and knowledge base, then change the page toward the recovered original.

## Validation Baseline

Run these from `app/` after Nutcracker source-fidelity changes:

```sh
npm run typecheck
npm test
npm run lint
npm run build
npm run assets:nutcracker-swf
npm run assets:nutcracker-ui
npm run assets:nutcracker-actors
npm run assets:nutcracker-jpeg3
```
