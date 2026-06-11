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
npm run assets:nutcracker-ui
npm run assets:nutcracker-actors
npm run assets:nutcracker-jpeg3
```

The SWF pass writes ignored proof artifacts to `app/generated/nutcracker-source-extract/full-swf-pass/`:

- `manifest.json`
- `dumps/*.placements.txt`
- `dumps/*.actions.txt`
- `dumps/*.text.txt`
- direct lossless PNG extraction records

The JPEG3 pass writes ignored repaired image proof artifacts to `app/generated/nutcracker-source-extract/direct-image-tags/`.

The actor promotion pass reads the ignored SWF output and writes committed actor assets to `app/src/assets/nutcracker-source/song#-track#-actor.png`.
It intentionally skips copying when ImageMagick reports the selected generated PNG is pixel-equivalent to the committed target, because `swfextract` can rewrite identical indexed PNG art with different bytes.

The UI promotion pass currently copies source UI bitmap evidence such as `song1__song/lossless-39.png` into correctly named committed assets like `song-curtain-scallop.png`. It also extracts/renders `nutchooser.swf` background shapes id `0016`, `0017`, and `0018` from composition sprite id `0021`, applies the id `0017` source CXForm add values `143 60 -10 0`, recreates the JPEG3-backed shape id `0020` from bitmap id `0019` with CXForm `mul 0 0 0 1` / `add 255 51 153 0`, and promotes `chooser-hallway-fill.png`, `chooser-hallway-portal-cxform.png`, `chooser-hallway-vector.png`, and `chooser-hallway-tint-cxform.png`; extracts/renders sprite `0068`, trims it, applies the root placement CXForm, and promotes `chooser-instruments-cxform.png`; extracts/renders `nutchooser.swf` shape id `0201` to promote normal visible `chooser-help-button-art.png`; and extracts/renders `nutchooser.swf` text id `0204` to promote chooser-local normal visible `chooser-exit-label.png`, because text id `0203` is the blue `buttonOFF` EXIT label. It extracts/renders `nutchooser.swf` sprites `0169`, `0170`, and `0177`, promoting translated-wrapper renders to `chooser-helpframe-talker.png` and `chooser-warningframe-talker.png`, plus chooser warning `YES`/`NO` source text labels. The same script now promotes the song-scene `helpframe` talker sprite id `0333` and `warningFrame` talker sprite id `0340` from `song1/song.swf`, plus song warning `YES`/`NO` labels from text ids `0345` and `0350`. It skips copying when ImageMagick reports the generated source and committed target are pixel-equivalent, to avoid PNG byte churn from regenerated metadata.

## Things Already Learned The Hard Way

- The local `swfrender` can render `song1/song.swf`, but `nutchooser.swf` and song 2-8 full composites fail with `No JPEG library compiled in`.
- `swfextract` can list JPEG IDs, but this local build cannot reliably extract those JPEGs. Use `app/scripts/extract-nutcracker-jpeg3.mjs`, which parses `DefineBitsJPEG3` directly, repairs the `FFD9 FFD8` marker quirk, inflates alpha, and writes transparent PNGs.
- `track*.swf` files are 600 x 460 MP3 soundstream carriers, not visual instrument sprites.
- `characters/anim*.swf` files contain the visible actor/timeline content. Direct lossless bitmaps are extractable, but exact timeline playback is not implemented.
- Do not reuse song 1 actor art for all eight song games. Several `characters/anim#.swf` files differ by song; for example, song 5 / 7 / 8 track 7 uses a standing drummer while song 1 track 7 uses the cannon. Run `npm run assets:nutcracker-actors` after `npm run assets:nutcracker-swf` and use `song#-track#-actor.png`.
- If `npm run assets:nutcracker-swf` causes actor PNG byte churn, rerun `npm run assets:nutcracker-actors`; the promotion script should skip pixel-equivalent copies so source-controlled actor files only change when the decoded art changes.
- Frame-specific SWF extraction/rendering is unreliable in this local toolchain. It can produce blank frames or crash on later character frames. Rendering full `characters/anim*.swf` files with the local `swfrender` only produced transparent first-frame 600 x 460 PNGs in spot checks, and this build has no frame selector. Do not claim exact `anim*.swf` playback unless a more robust renderer is added and verified.
- When `swfrender` clips a useful sprite because its source geometry has negative coordinates, try a translated wrapper before giving up: extract the sprite with `swfextract -i`, wrap it with `swfcombine --stack1 -X <w> -Y <h> -x <shiftX> -y <shiftY>`, then render the wrapper. This recovered a much more complete `nutchooser.swf` helpframe talker from nested sprite `0169` than direct rendering of `0169` or parent `0170`.
- Do not put modern chooser status text such as `Ready`, `Locked`, or `Cleared` visibly over the preserved `nutchooser.swf` viewport. Keep door state in `data-door-state` / `aria-label`; visible door composition should come from the source door movie clip art and placement records.
- Do not add modern hover glows, focus outlines, drop shadows, or disabled opacity to chooser doors. The recovered `m#` door placements run on-load ActionScript that derives `iam` from the instance name and sets `this._visible` from `_root.door#` loaded from `games/data/nutdoors.txt`. Until exact door button/timeline states are recovered, visible door state should remain the source door movie clip render, with modern lock/open state stored in behavior/data/ARIA only.
- Do not treat the Nutcracker chooser as a generic door grid with song-scene controls. `nutchooser.swf` has its own `helpButton` at x `556.50`, y `165.30` and `quiter` at x `585.90`, y `472.45`; use those source placements and ActionScript hover strings (`Help`, `Quit the Game`).
- Do not render chooser `helpButton` / `quiter` through the generic app-shell action strip. They are root display-list children inside `nutchooser.swf` at depths `0168` and `0173`, after the door instances. Keep them inside `.nutcracker-chooser`, and preserve their internal frame evidence in `data-source-state`: `helpButton` `buttonON` places button id `0200` plus shape id `0201`, while `buttonOFF` places shape id `0198` with alpha mul `0.4`; `quiter` `buttonON` places button id `0206`, while `buttonOFF` places chooser text id `0203` with scale `1.722` and CXForm add `102 102 204 0`.
- Do not use shape id `0198` as the normal visible chooser Help button art. It is the `helpButton` `buttonOFF` frame with alpha multiplier `0.4`. The normal visible source fallback is shape id `0201`, placed by sprite id `0202` at depth `0004` in `buttonON`; `npm run assets:nutcracker-ui` promotes it to `chooser-help-button-art.png`. Its CSS rectangle should come from the root placement plus bbox `[-18.05,-17.10,20.45,11.20]`, roughly left `532`, top `142`, width `52`, height `38`.
- Do not use chooser text id `0203` as the normal visible EXIT label. It is the blue `quiter` `buttonOFF` text, placed by sprite id `0207` with CXForm add `102 102 204 0`. The normal visible source fallback is text id `0204`, rendered peach/orange and promoted by `npm run assets:nutcracker-ui` to `chooser-exit-label.png`. Its CSS label rectangle should come from root `0207` placement, sprite text matrix `1.722 x -114.95 y -12.70`, and text bbox `[61.60,2.10,86.80,10.60]`, roughly left `578`, top `464`, width `39`, height `13`.
- Do not use `.source-control-help` blue tooltip spans on chooser controls. `nutchooser.swf` button id `0200` calls `_root.helpme(4, "Help")` and button id `0206` calls `_root.helpme(3, "Quit the Game")`; both call `_root.nohelp` on rollout. The current dumps do not expose a separate chooser `flyinghelp` placement, so use a documented `chooser-helpme-fallback` source-flying-help layer rather than generic tooltip cards.
- Rendering isolated chooser control sprites id `0202` / `0207` currently fails because nested button ids are unresolved. Render/promote the usable child art/text where possible, record the exact limitation, and keep `data-source-control` / `data-source-placement` in the DOM.
- Do not reuse a song-scene source asset for a chooser control just because the rendered pixels match. `nutchooser.swf` text id `0203` renders the same `EXIT` pixels as `song1/song.swf` text id `0145`, but chooser `quiter` should import `chooser-exit-label.png` so the runtime and docs point to the chooser-local source symbol.
- The chooser background sprite id `0021` still cannot be rendered directly with the local `swfrender` build because shape id `0020` depends on JPEG3 id `0019`. Do not stop at the repaired JPEG3 image only: shape id `0016` renders cleanly and is promoted as `chooser-hallway-fill.png`; shape id `0018` renders cleanly and is promoted as `chooser-hallway-vector.png`, restoring the source hallway/ceiling/columns layer. Shape id `0017` also renders cleanly and must receive its child placement CXForm add `143 60 -10 0`; it is promoted as `chooser-hallway-portal-cxform.png`. Shape id `0020` is a rectangular `BITMAPc 19` fill with bbox `[0.00,0.00,615.20,404.95]`; sprite id `0021` places it at depth `0012` with CXForm `mul 0 0 0 1` and `add 255 51 153 0`. Since local `swfrender` cannot flatten that JPEG3-backed shape, `npm run assets:nutcracker-ui` recreates it from the repaired JPEG3 id `0019` alpha, resizes to the shape bbox, fills with `#ff3399`, and promotes `chooser-hallway-tint-cxform.png`. The remaining gap is full sprite `0021` display-list playback, not missing child-layer evidence.
- The lower chooser instrument strip needs the root `PLACEOBJECT2` CXForm, not the raw orange sprite render. `nutchooser.swf` places sprite id `0068` at final depth `0069`, x `46.55`, y `285.85`, ratio `5`, with add values `-209 -153 134 -223`. `npm run assets:nutcracker-ui` now promotes `chooser-instruments-cxform.png` by applying those adds as `R subtract 81.9608%`, `G subtract 60%`, `B add 52.549%`, and `A subtract 87.451%`.
- Do not let the chooser help action fall back to the generic beige app modal or song `courtain` alert inside the preserved viewport. `nutchooser.swf` has its own `helpframe` at frame 23: sprite id `0170` is placed at depth `0001` with matrix scale `1.051`, x `-0.90`, y `39.65`, ratio `22`, and `noAction` id `0171` is placed at depth `0003`. Sprite `0170` animates nested talker sprite `0169` at scale `0.799`; direct `0169` rendering has more visible source pixels than parent `0170`, and the translated wrapper render recovers still more by avoiding the fixed render-origin clip. Use the recovered chooser frame art, promoted `chooser-helpframe-talker.png`, and `data-source-frame="nutchooser.swf helpframe"` / `data-source-placement`; exact frame-by-frame helpframe playback still needs a display-list renderer.
- Do not add visible chooser help instructions such as "Choose a song door." inside the source viewport. The current `nutchooser` dumps show `helpframe` sprite/talker placement but no visible instructional `DEFINEEDITTEXT`/`DEFINETEXT` for that frame. Keep accessibility copy screen-reader-only unless a source text object is recovered.
- Do not wire chooser `quiter` directly to the modern menu. Its ActionScript sets `_root.theNextFrame` to `warningFrame`. `warningFrame` places talker sprite id `0177`, noAction id `0178`, YES button id `0183`, NO button id `0188`, and close/transition sprite id `0189`. YES calls `_level0.gotoAndPlay("comeAgain")`; NO/close restore the chooser controls and send `quiter` to `buttonON`. Use promoted `chooser-warningframe-talker.png`, `chooser-warning-yes-label.png`, and `chooser-warning-no-label.png` before any fallback button styling.
- Rendering isolated chooser warning buttons id `0183` / `0188` fails with unresolved child IDs, and `swfextract -f 24/25` did not produce renderable full-frame SWFs for the root warning frame. Compose the source frame, warning talker, and source text labels with `data-source-frame="nutchooser.swf warningFrame"` until a real display-list renderer can render the whole timeline frame.
- Do not let source modal CSS override `.sr-only`. `.source-help-modal p` previously made screen-reader-only helper copy visible inside preserved Flash viewports. Use `.source-help-modal p:not(.sr-only)` plus an explicit `.source-help-modal .sr-only` rule so unproven help text stays accessible but not visible.
- Do not render app-level song Help fallback copy as visible modern instructions. `song1/song.swf` has a `helpFrame` path where root `helpframe` places sprite id `0333` and `noAction` id `0334`; that path sets `_root.theNextFrame = "helpFrame"` and drives `_root.usmus`. Use `song-help-art.png` plus promoted `song-helpframe-talker.png` for any song help fallback surface, and keep route help copy screen-reader-only unless a source text object is recovered.
- Do not wire song-scene `listenSong` / `EXIT` directly to the chooser. Its ActionScript sets `_root.theNextFrame` to `warningFrame` and drives `_root.usmus` through the warning/showUp animation. `song1/song.swf warningFrame` places talker sprite id `0340`, noAction id `0341`, YES button id `0346`, NO button id `0351`, and close/transition sprite id `0352`. YES calls `_level0.gotoAndPlay("comeAgain")`; NO restores previews/instruments/speakers/focus/quiter state. Use promoted `song-warningframe-talker.png`, `song-warning-yes-label.png`, and `song-warning-no-label.png` before any fallback styling.
- Avoid using `status` as a shell loop variable in zsh; it is read-only. Use `rc` or another name.
- `song1__song.actions.txt` is often the fastest way to confirm behavior. Useful source terms include `testCombination`, `showHint`, `helpme`, `nohelp`, `doubleClick`, `dragInstrument`, `hitArea.hitTest`, `instOnScene`, `addINST`, and `removeAnim`.
- Do not render `gameSolution` as if it were a visible text field. In the recovered dumps it is ActionScript state (`ok` / `try again`) with no `DEFINEEDITTEXT` binding. Visible hint/check copy is written to `_root.message` inside the `courtain` sprite.
- The HINT/check feedback frame is `courtain` label `giveHint`: root sprite id `0063` at depth `0082`, x `319.85`, y `4.90`; `_root.message` edit text id `0058` at depth `0007`, matrix scale `0.953/0.843`, x `132.90`, y `96.80`, ratio `14`. Use this source-curtain area for visible HINT/try-again fallback copy so feedback stays inside the 640 x 480 frame.
- Do not re-add modern selected/correct/incorrect markers over the song viewport. Yellow hotspot fills, circular selected badges, and red/green actor glows are invented DOM feedback. The source-selected state is the actor animation appearing in the stage slots; the visible check/hint feedback is the `courtain` message.
- Do not guess the PLAY AGAIN position from the rendered label size. The source reset control is `gameController` sprite id `0115` at depth `0116`, matrix scale `1.140`, x `322.20`, y `317.70`; the winner timeline sends it to frame label `buttonAgain`.
- Do not implement song hover labels as one static tooltip per hotspot. Flash has one `flyinghelp` sprite (`id 0257`, depth `0306`) that `helpme(a,b)` moves with `startDrag(this)` after setting `_root.helpmessage`; `nohelp()` hides it and moves it to x `10000`.
- Song control hover labels also use `flyinghelp`, not `.source-control-help` spans. Preserve the ActionScript strings exactly: `Hint`, `Select a\ndifferent\nsong`, `Listen to the Original Music`, `Stop the Music`, and `Quit the Game`.
- `flyinghelp` is not a blue tooltip card. Song 1 instruments mostly call `helpme(2, label)`, saxophone calls frame 3, most song controls call frame 4, and quit calls frame 3. Frames 2/3 are layered `_root.helpmessage` edit-text stacks around 276 x 22 after scale; frame 4 places sprite id `0240`; frames 5-8 use shape ids `0241`, `0244`, `0246`, `0251`, and `0252`. Use layered DOM spans that mirror those edit-text stacks and carry `data-source-frame` / `data-source-bounds`, not one generic tooltip text node.
- Current local rendering still cannot flatten `flyinghelp`. `swfextract -i 240` and `swfextract -i 257` succeed, but `swfrender` produces fully transparent 512 x 512 PNGs; a translated `swfcombine --stack1 -X 360 -Y 200 -x 180 -y 120` wrapper around sprite `0257` also renders transparent and prints unresolved edit-text IDs `231`, `232`, and `233`. `swfextract -f 4` / `-f 8` against the extracted parent clip did not write usable frame SWFs. Do not retry that path as if it were untested; the next real improvement needs a renderer that can flatten dynamic text/timeline frames or a direct parser for `DEFINEEDITTEXT` style records.
- Be skeptical of old promoted asset names. `song-speaker.png` and `song-sound-icon.png` are direct bitmap evidence, but visual inspection showed they are not clean speaker/sound controls; `song-sound-icon.png` is curtain/scallop art, and the rendered song frame already contains the source side speaker panels. Use the correctly named `song-curtain-scallop.png` promoted by `npm run assets:nutcracker-ui` for the `courtain` overlay art.
- `courtain` cannot yet be rendered exactly with the local tools. `swfextract -i 63 -P` preserves the root placement, but `swfrender` only renders the first internal frame; `swfextract -f 15`/`-f 20` produced empty/invalid frame SWFs for the hint/alert states. Use the exact extracted scallop bitmap plus documented DOM fallback text/buttons until a real SWF timeline renderer exists.
- Be careful when mapping `instIMG#` help labels in `swfdump` output. `swfdump` can print symbol definitions after a root placement record, so a `helpme` constant pool printed after `PLACEOBJECT2 ... name "instIMG1"` may be defining a later symbol rather than the already placed root instance. Use the named root placement records plus ActionScript `_root.instIMG` + index references as the stable anchor.

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
- Instrument hotspots expose `data-source-placement`, `data-source-vector-bounds`, and `data-source-hit-rect` so placement provenance can be inspected directly in DOM output and tests. The hit rects are slightly padded/dom-pragmatic where Flash vector hit shapes are too narrow for reliable modern interaction.
- Selected actors use promoted per-song source-extracted character bitmaps and CSS motion derived from placement dumps, documented as a fallback rather than full timeline playback.
- Chooser door cards expose `data-source-placement` from the original `m1` through `m8` `PLACEOBJECT2` records, while visible door number/status overlays have been removed from the source viewport.
- Chooser scene art now exposes `data-source-placement` for the recovered hallway/background, frame, instrument sprite, help button, and quit control. Keep adding provenance attributes when a visible element remains DOM/CSS-backed.
- Chooser help uses the recovered chooser frame surface, records the `nutchooser.swf helpframe` placement for sprite `0170` / `noAction` id `0171`, and overlays `chooser-helpframe-talker.png` rendered from nested sprite `0169`, rather than sharing the song-scene help/courtain surfaces.
- Chooser quit uses the recovered `nutchooser.swf warningFrame` path. The DOM warning surface records placements for `0177`, `0178`, `0183`, `0188`, and `0189`, uses source-rendered warning talker/YES/NO assets, maps NO to the source control-restore behavior, and maps YES to the app's equivalent leave/restart flow.
- The song app-level Help fallback is source-mapped to the recovered `song1/song.swf helpframe` path. The DOM help surface records placements for `0333` and `0334`, uses source help art plus `song-helpframe-talker.png`, and keeps unproven instructional copy screen-reader-only.
- Song EXIT uses the recovered `song1/song.swf warningFrame` path. The DOM warning surface records placements for `0340`, `0341`, `0346`, `0351`, and `0352`, uses source-rendered warning talker/YES/NO assets, maps NO to the source control-restore behavior, and maps YES to the app's equivalent chooser-return flow.

## Known Remaining Gaps

- Full `characters/anim*.swf` timeline playback is still missing.
- Some song 2-8 scene composition remains source-derived but not full Flash display-list playback.
- Full root-frame rendering for song-scene `warningFrame` remains a display-list renderer gap. The app composes recovered sprite/text assets with source placement metadata and no invented warning wording until a renderer can play the complete frame.
- Exact `flyinghelp` frame rendering remains a dynamic text/timeline renderer gap. The current DOM fallback is source-layered from `PLACEOBJECT2` and `DEFINEEDITTEXT` evidence, not a rendered source bitmap.
- Browser visual approval is still Marcus-gated. Automated checks can prove build/test/extraction health, not that the UI is approved.

## Commit Discipline

- Keep generated proof output under `app/generated/` ignored unless Marcus explicitly asks to persist a generated artifact.
- Commit small source-backed increments with evidence in `docs/nutcracker-song-source-map.md` or this knowledge base.
- Update Linear `JIP-349` with commit SHA and validation evidence, but keep it In Review until Marcus approves the UI.
