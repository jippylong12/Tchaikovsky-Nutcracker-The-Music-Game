# Agent Knowledge Base

This document captures reusable lessons from the Nutcracker source-reconstruction work so future sessions do not relearn the same Flash/SWF constraints.

## Start Here

- Main fidelity map: `docs/nutcracker-song-source-map.md`
- Current implementation hotspots:
  - `app/src/app.ts`
  - `app/src/styles.css`
  - `app/src/data/nutcrackerSongGames.ts`
  - `app/scripts/extract-nutcracker-swf-assets.mjs`
  - `app/scripts/extract-nutcracker-jpeg3.mjs`
- Source files that matter most:
  - `analysis/setup/app/games/nutcrackergame/nutchooser.swf`
  - `analysis/setup/app/games/nutcrackergame/song*/song.swf`
  - `analysis/setup/app/games/nutcrackergame/song*/trackinfo.txt`
  - `analysis/setup/app/games/nutcrackergame/song*/track*.swf`
  - `analysis/setup/app/games/nutcrackergame/song*/characters/anim*.swf`
  - `analysis/setup/app/games/data/nutdoors.txt`

## Reproducible Evidence Commands

Run from `app/`:

```sh
npm run assets:nutcracker-swf
npm run assets:nutcracker-jpeg3
```

The SWF pass writes ignored proof artifacts to `app/generated/nutcracker-source-extract/full-swf-pass/`:

- `manifest.json`
- `dumps/*.placements.txt`
- `dumps/*.actions.txt`
- `dumps/*.text.txt`
- direct lossless PNG extraction records

The JPEG3 pass writes ignored repaired image proof artifacts to `app/generated/nutcracker-source-extract/direct-image-tags/`.

## Things Already Learned The Hard Way

- The local `swfrender` can render `song1/song.swf`, but `nutchooser.swf` and song 2-8 full composites fail with `No JPEG library compiled in`.
- `swfextract` can list JPEG IDs, but this local build cannot reliably extract those JPEGs. Use `app/scripts/extract-nutcracker-jpeg3.mjs`, which parses `DefineBitsJPEG3` directly, repairs the `FFD9 FFD8` marker quirk, inflates alpha, and writes transparent PNGs.
- `track*.swf` files are 600 x 460 MP3 soundstream carriers, not visual instrument sprites.
- `characters/anim*.swf` files contain the visible actor/timeline content. Direct lossless bitmaps are extractable, but exact timeline playback is not implemented.
- Frame-specific SWF extraction/rendering is unreliable in this local toolchain. It can produce blank frames or crash on later character frames. Do not claim exact `anim*.swf` playback unless a more robust renderer is added and verified.
- Avoid using `status` as a shell loop variable in zsh; it is read-only. Use `rc` or another name.
- `song1__song.actions.txt` is often the fastest way to confirm behavior. Useful source terms include `testCombination`, `showHint`, `helpme`, `nohelp`, `doubleClick`, `dragInstrument`, `hitArea.hitTest`, `instOnScene`, `addINST`, and `removeAnim`.

## Source-Backed Behaviors Already Implemented

- Song controls are placed from SWF instance evidence:
  - `helpButton` -> HINT
  - `hintButton` -> CHANGE SONG
  - `songChooser` -> LISTEN/STOP
  - `listenSong` -> EXIT
- `CHANGE SONG` opens the source-style confirmation using the ActionScript message `press "Yes" to change this song or "No" to cancel`.
- YES/NO labels are rendered from source text ids 345 and 350.
- Instrument interaction follows the source model more closely:
  - single click previews source track audio
  - double-click selects/removes
  - drag onto stage selects
  - fourth selected track auto-checks
- Track preview starts use detected audible MP3 start times, not only `firstFrame#`, because some `firstFrame#` values do not match audible preview timing.
- Instrument hover/focus help mirrors source `helpme` strings where available.
- Selected actors use source-extracted character bitmaps and CSS motion derived from placement dumps, documented as a fallback rather than full timeline playback.

## Known Remaining Gaps

- Full `characters/anim*.swf` timeline playback is still missing.
- Some song 2-8 scene composition remains source-derived but not full Flash display-list playback.
- `listenSong` release routes the SWF through `warningFrame`, but that handler does not set `_root.message`; do not invent unknown static warning-frame wording.
- Browser visual approval is still Marcus-gated. Automated checks can prove build/test/extraction health, not that the UI is approved.

## Commit Discipline

- Keep generated proof output under `app/generated/` ignored unless Marcus explicitly asks to persist a generated artifact.
- Commit small source-backed increments with evidence in `docs/nutcracker-song-source-map.md` or this knowledge base.
- Update Linear `JIP-349` with commit SHA and validation evidence, but keep it In Review until Marcus approves the UI.

