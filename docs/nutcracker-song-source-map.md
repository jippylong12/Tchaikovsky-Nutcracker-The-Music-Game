# Nutcracker Song Game Source Map

This note captures the source evidence used for the Nutcracker song chooser and song-game scene reconstruction.

## Source files inspected

* `analysis/setup/app/games/nutcrackergame/nutchooser.swf`
* `analysis/setup/app/games/nutcrackergame/song1/song.swf`
* `analysis/setup/app/games/nutcrackergame/song*/trackinfo.txt`
* `analysis/setup/app/games/data/nutdoors.txt`

## Movie metadata

* `nutchooser.swf`: 640 x 480, 15 fps.
* `song1/song.swf`: 640 x 480, 12 fps.
* `track*.swf`: 600 x 460, 15 fps, MP3 soundstream only.
* `characters/anim*.swf`: 600 x 460, 15 fps.

Official Ruffle `v0.5.0` renders the complete normal chooser state even though the installed SWFTools build cannot flatten sprite `0021`. The committed source-runtime evidence is `app/source-evidence/nutcracker/nutchooser-source-normal.png`, 640 x 480, SHA-256 `969c1b97245244a589b5480f802a6bc9d732e23ba1bb0f97867f23c341e2c390`. It was captured losslessly from the 1280 x 960 DPR-2 page surface after the intro mascot cleared, downsampled to the native stage, and stripped of PNG metadata. `npm run assets:nutcracker-ui` hash-locks and promotes the same pixels as `app/src/assets/nutcracker-source/nutchooser-source-normal.png`.

## Runtime source-fidelity classification gate

The chooser/song DOM now exposes `data-source-classification` on the key visible runtime layers so the source-map categories are inspectable rather than only prose. Every selected actor also carries its exact `song#/characters/anim#.swf` path in `data-source-animation` and the current renderer/timeline limit in `data-source-fallback`: local `swfrender` has no frame selector, representative full animation SWFs render transparent at frame 1, and extracted later frames can crash.

| Visible runtime surface | Classification | Evidence or limit |
| --- | --- | --- |
| Complete normal chooser frame and repaired per-song JPEG3 scenery | SWF-derived recreation / original asset | The chooser uses the hash-locked official-Ruffle normal frame; direct PNG/JPEG3 records remain extraction proof and JPEG3 marker/alpha repair does not replace source pixels. |
| Chooser opened-door art, warning/help/key art, and song frame/curtain/control compositions | SWF-derived recreation | Rendered source shapes/sprites/text plus recovered matrices, depth order, ratios, and color transforms. |
| Source control labels and dynamic song strings | original text | Rendered `DEFINETEXT` objects where flattening works; exact recovered ActionScript strings for `_root.message` where dynamic text must remain DOM-backed. |
| Door availability, fourth-selection checking, and final key visibility | inferred behavior | Modern state mirrors recovered ActionScript and progress variables; visible modern status is kept in data/ARIA rather than painted over source art. |
| Selected actors, flying-help dynamic text, instrument hit rectangles, and unflattened timeline frames | documented fallback | The deterministic display-list pass proves the relevant symbol/placement records but cannot rasterize arbitrary animation frames with the installed tools. Per-song source bitmaps plus restrained source-derived motion, layered DOM edit text, and source-bounded hit areas retain exact SWF provenance and the concrete tool failure in the DOM. |
| Generic cards, visible progress/status labels, debug/provenance copy, generated art, correctness glows/badges, or generic modals inside the 640 x 480 viewport | defect | These are not source-backed and must not be reintroduced. |

## ActionScript behavior

`song1/song.swf` initializes `theSong = 1`, loads `games/nutcrackergame/song1/trackinfo.txt`, then loops from 1 to 8 loading:

* `games/nutcrackergame/song1/characters/anim#.swf` into `anim#`
* `games/nutcrackergame/song1/track#.swf` into `inst#`
* `games/nutcrackergame/song1/track#.swf` into `prevTrack#`

The song game uses these original visible strings:

* `HINT`
* `LISTEN`
* `EXIT`
* `ok`
* `try again`
* `you have `
* ` correct instruments and `
* ` incorrect instruments `
* `All songs are played by 4 instruments!`
* `Listen to the original song and find  4 correct instruments. Double click on the instruments or drag them onto the stage.`
* `Play again and find a hidden tune.`

`nutchooser.swf` loads `games/data/nutdoors.txt` into `_level1`, stores `nutDoorsVisited`, and has eight button actions that load `games/nutcrackergame/song#/song.swf`.

## Extracted or rendered source assets

Committed source-backed assets live in `app/src/assets/nutcracker-source/`:

* `nutchooser-source-normal.png`: complete official-Ruffle normal chooser state. It replaces the visibly incomplete child-layer runtime composition, preserves the source blue frame/tint, hallway, instrument bed, Help, and EXIT art in one source-rendered frame, and leaves only dynamic completed-door and magic-key layers outside the capture.
* `song1-source-interactive.png` through `song8-source-interactive.png`: complete official-Ruffle normal interactive song states. Each song was loaded with its `track#.swf` children available and its external `characters/anim#.swf` files intentionally withheld, the tutorial was dismissed, and the actor-free DPR-2 capture was downsampled to the native 640 x 480 stage and metadata-stripped. These per-song frames preserve the ornamental shell, correct scenery, eight instrument choices, speaker surfaces, and normal Help/Hint/Listen/Change Song/Exit art in one source-rendered image while leaving selected actors as dynamic DOM layers. Their SHA-256 hashes are locked in `app/src/tests/nutcrackerSongGames.test.ts` and rechecked by `npm run assets:nutcracker-ui`.
* `song-game-render.png`: legacy `swfrender` first-frame evidence from `song1/song.swf`; retained for provenance but no longer used as the runtime song stage because it does not reproduce the normal interactive display list.
* `nutchooser-frame-source.png`: PNG asset 31 extracted from `nutchooser.swf`; same ornamental frame family as the earlier `nutchooser-frame.png`.
* `chooser-open-door.png`: source-local 100 x 190 crop at x `130`, y `105` from the 512 x 512 render of movie clip id 80 (`m#` opened-door sprite). The runtime applies the recovered `m1`-`m8` root matrices to this correctly named promotion. The older `chooser-door.png` full render remains source evidence only; it includes a renderer-origin artifact and must not be stretched into each button box.
* `chooser-hallway.png`: repaired and alpha-composited JPEG3 id 19 from `nutchooser.swf`; retained as direct bitmap evidence for the chooser background fill used by shape id 20.
* `chooser-hallway-fill.png`: trimmed render of `nutchooser.swf` background fill shape id 16 from composition sprite id 21. It remains deterministic child-layer evidence; the complete normal runtime frame now comes from the official-Ruffle capture.
* `chooser-hallway-vector.png`: trimmed render of `nutchooser.swf` background vector shape id 18 from composition sprite id 21. The full sprite id `0021` still cannot be rendered directly with this local `swfrender` build because shape id `0020` depends on JPEG3 id `0019`, but shape id `0018` renders cleanly and restores the recovered hallway/ceiling/columns layer that was previously missing from the DOM composition.
* `chooser-hallway-portal-cxform.png`: trimmed render of `nutchooser.swf` background shape id 17 from composition sprite id 21 with the source child placement CXForm applied (`R add 56.078%`, `G add 23.529%`, `B subtract 3.922%`, matching add values `143 60 -10 0`). It remains depth/CXForm evidence for the source capture rather than a separately stretched visible runtime layer.
* `chooser-hallway-tint-cxform.png`: source-derived recreation of `nutchooser.swf` background shape id 20 from composition sprite id 21. `swfdump -D` on the extracted shape shows a rectangular `BITMAPc 19` fill with bbox `[0.00,0.00,615.20,404.95]`; sprite id `0021` places it at depth `0012` with CXForm `mul 0 0 0 1` and `add 255 51 153 0`. Because local `swfrender` cannot render the JPEG3-backed shape, `npm run assets:nutcracker-ui` retains a repaired, transformed child-layer proof; the complete visible tint comes from the official-Ruffle normal capture.
* `chooser-instruments.png`: trimmed render of sprite id 68 extracted from `nutchooser.swf`; retained as untransformed source evidence for the chooser lower instrument art.
* `chooser-instruments-cxform.png`: source render of sprite id 68 with the root placement color transform applied. `npm run assets:nutcracker-ui` extracts id `0068`, renders and trims it, then applies the final root `PLACEOBJECT2` CXForm add values `-209 -153 134 -223` as ImageMagick channel operations (`R subtract 81.9608%`, `G subtract 60%`, `B add 52.549%`, `A subtract 87.451%`). It remains explicit transform evidence; the complete visible lower instrument bed is preserved by the official-Ruffle normal capture.
* `chooser-help-button-art.png`: trimmed render of chooser `helpButton` normal visible shape id `0201` from `nutchooser.swf`. Sprite id `0202` places this shape in its `buttonON` frame at depth `0004`; the older shape id `0198` render is only the `buttonOFF` frame at depth `0002` with alpha multiplier `0.4`. Rendering the full button sprite id `0202` still fails with unresolved nested button id `0200`, so this promoted child shape is the documented visible fallback for the source control.
* `chooser-exit-button-art.png`: trimmed render of chooser `quiter` button body shape id `0205` from `nutchooser.swf`. Shape id `0205` is defined immediately before `DEFINEBUTTON2` id `0206` and has bbox `[-40.20,-26.00,40.20,26.10]`; it remains button-state evidence because isolated full button id `0206` rendering currently produces only a 1 x 1 placeholder.
* `chooser-exit-label.png`: trimmed render of chooser `quiter` normal/on text id `0204` from `nutchooser.swf`. Text id `0204` renders the peach `EXIT` label associated with the buttonON path near button id `0206`; text id `0203` is the blue `buttonOFF` label placed by sprite id `0207` at depth `0001` with matrix scale `1.722`, x `-114.95`, y `-12.70`, and CXForm add `102 102 204`. The promoted label remains button-state evidence; the normal visible EXIT art is baked into the complete source-runtime capture.
* `chooser-magic-key.png`: rendered chooser `magicKey` sprite id `0213` from `nutchooser.swf`. The root places it at depth `0175`, matrix scale `0.642`, x `316.05`, y `175.80`, ratio `5`; the on-load ActionScript reads `_level0.nutDoorsVisited` and sets `this._visible` to `1` only when the value equals `8`, otherwise `0`. Direct rendering clipped the negative-coordinate key art, so `npm run assets:nutcracker-ui` wraps the extracted sprite with `swfcombine --stack1 -X 180 -Y 180 -x 80 -y 90`, renders the wrapper, trims the result, and promotes the full key image.
* `chooser-helpframe-talker.png`: rendered nested chooser helpframe talker sprite id 169 from `nutchooser.swf`; sprite id 170 animates this nested sprite and the root `helpframe` places id 170. Direct `swfrender` clipped the negative-coordinate sprite at the 512 x 512 render origin, so `npm run assets:nutcracker-ui` now extracts id `0169`, wraps it with `swfcombine --stack1 -X 360 -Y 260 -x 150 -y 120`, renders that translated SWF, and promotes the resulting `helpframe-169-wrapped.png`. The wrapped render preserves substantially more visible source art than direct `0169` or parent `0170` rendering, but exact animated `helpframe` playback remains a display-list renderer target.
* `chooser-warningframe-talker.png`: rendered chooser `warningFrame` sprite id 177 from `nutchooser.swf`. Direct `swfrender` clips the negative-coordinate source art at the render origin, so `npm run assets:nutcracker-ui` extracts id `0177`, wraps it with `swfcombine --stack1 -X 360 -Y 220 -x 130 -y 90`, renders the translated wrapper, and promotes `warningframe-177-wrapped.png`.
* `chooser-warning-yes-body.png`: trimmed render of `nutchooser.swf` warning `YES` normal body shape id `0179`, paired with text id `0180` by button id `0183`.
* `chooser-warning-no-body.png`: trimmed render of `nutchooser.swf` warning `NO` normal body shape id `0184`, paired with text id `0185` by button id `0188`.
* `chooser-warning-yes-label.png` and `chooser-warning-no-label.png`: trimmed renders of `nutchooser.swf` warning text ids `0180` (`YES`) and `0185` (`NO`). The root `warningFrame` places button ids `0183` and `0188`; rendering the full button symbols as isolated SWFs fails with unresolved child IDs, so the DOM composes the recoverable source body shapes and source text labels with documented fallback button hit areas.
* `song-hint-label.png`: trimmed render of text id 122 from `song1/song.swf`.
* `song-change-song-label.png`: trimmed render of text id 130 from `song1/song.swf`; used for the source `CHANGE SONG` chooser control.
* `song-listen-label.png`: trimmed render of text id 134 from `song1/song.swf`.
* `song-exit-label.png`: trimmed render of text id 145 from `song1/song.swf`.
* `song-stop-label-blue.png` and `song-stop-label-black.png`: trimmed renders of text ids 139 and 141 from `song1/song.swf`; retained as source evidence for playback-state controls.
* `song-play-again-label.png`: trimmed render of text id 111 from `song1/song.swf`; used for the source-backed reset/play-again control after feedback.
* `song-control-help-body.png`: trimmed render of `song1/song.swf` help control source shape id `0119`. The `helpButton` sprite id `0120` places this shape at depth `0004` in `buttonON`; the root places `helpButton` at x `556.50`, y `165.30`, scale `1.350`.
* `song-control-button-body.png`: trimmed render of shared song-control source shape id `0126`. The `hintButton` sprite id `0127`, `songChooser` sprite id `0133`, and `listenSong` sprite id `0144` place this shape in their `buttonON` frames.
* `song-play-again-button-body.png`: trimmed render of source shape id `0113`, sibling evidence for `gameController` `buttonAgain` button id `0114`. `gameController` sprite id `0115` places id `0114` at x `-0.90`, y `1.75` in the `buttonAgain` frame after a correct solve.
* `song-yes-label.png`: trimmed render of text id 345 from `song1/song.swf`; used by the source-backed change-song confirmation.
* `song-no-label.png`: trimmed render of text id 350 from `song1/song.swf`; used by the source-backed change-song confirmation.
* `song-curtain-fill.png`: trimmed render of `song1/song.swf` `courtain` base sprite id `0042` child shape id `0038`, placed at depth `0001` with bbox `[-219.20,-343.85,219.25,-4.05]`.
* `song-curtain-curve-cxform.png`: trimmed render of `courtain` base sprite id `0042` child shape id `0040`, placed at depth `0002`, matrix x `2.80`, y `-56.45`, with CXForm `mul 0 0 0 1` / `add 0 102 255 0` applied.
* `song-curtain-stars.png`: trimmed render of `courtain` base sprite id `0042` child shape id `0041`, placed at depth `0003` with bbox `[-208.10,-261.85,205.75,-41.45]`.
* `song-warningframe-talker.png`: rendered song-scene `warningFrame` sprite id 340 from `song1/song.swf`. Direct `swfrender` clips the negative-coordinate source art at the render origin, so `npm run assets:nutcracker-ui` extracts id `0340`, wraps it with `swfcombine --stack1 -X 360 -Y 240 -x 140 -y 80`, renders the translated wrapper, and promotes `song-warningframe-340-wrapped.png`.
* `song-warning-yes-body.png`: trimmed render of `song1/song.swf` warning `YES` visible body shape id `0344`, paired with text id `0345` by button id `0346`.
* `song-warning-no-body.png`: trimmed render of `song1/song.swf` warning `NO` visible body shape id `0349`, paired with text id `0350` by button id `0351`.
* `song-warning-yes-label.png` and `song-warning-no-label.png`: trimmed renders of `song1/song.swf` warning text ids `0345` (`YES`) and `0350` (`NO`). The root `warningFrame` places button ids `0346` and `0351`; the DOM composes these source body shapes and source text labels with documented fallback hit areas.
* `song-helpframe-talker.png`: rendered song-scene `helpframe` sprite id 333 from `song1/song.swf`. Direct `swfrender` clips the negative-coordinate source art at the render origin, so `npm run assets:nutcracker-ui` extracts id `0333`, wraps it with `swfcombine --stack1 -X 360 -Y 240 -x 140 -y 60`, renders the translated wrapper, and promotes `helpframe-333-wrapped.png`.
* `song-keyframe-talker.png`: rendered song-scene `keyFrame` sprite id 355 from `song1/song.swf`. The final winner timeline sets `_root.theNextFrame` to `keyFrame` only when `_level0.nutDoorsVisited` equals `7` before saving the just-cleared final door, then calls `saveKey1.exe`, sets `_level0.gameKey1`, calls `updateKeys`, and plays `_root.usmus.showUp`. Direct rendering clips the negative-coordinate source art, so `npm run assets:nutcracker-ui` wraps id `0355` with `swfcombine --stack1 -X 700 -Y 260 -x 260 -y 120`, renders the wrapper, trims the 523 x 97 source surface, and promotes it.
* `song-speaker.png`: PNG asset 3 extracted from `song1/song.swf`; retained as direct bitmap evidence, but not used as a standalone speaker control because visual inspection shows it is not the clean `spk1`/`spk2` sprite.
* `song-sound-icon.png`: PNG asset 39 extracted from `song1/song.swf`; retained as direct bitmap evidence, but visual inspection shows this is decorative curtain/scallop art rather than a sound-control icon.
* `song-curtain-scallop.png`: correctly named promotion of `song1/song.swf` lossless bitmap id 39. This is the dark blue scallop bitmap used by the `courtain` base sprite id `0042`; the DOM uses it inside hint/check/change-song overlays while the vector panel and dynamic message remain documented fallbacks.
* `song-help-art.png`: PNG asset 73 extracted from `song1/song.swf`.
* `track1-nutcracker.png` through `track8-round-doll.png`: source-identical lossless bitmaps extracted from `song1/characters/anim*.swf`; retained as fallback actor art.
* `song1-track1-actor.png` through `song8-track8-actor.png`: promoted representative lossless bitmaps from each song's own `characters/anim#.swf`; used as visible selected-stage actors in the modern scene.
* `song2-scenery.png`: repaired and alpha-composited JPEG3 id 7 from `song2/song.swf`; retained as child-layer evidence but no longer stretched over the runtime stage because the complete source-runtime capture includes it at the source display-list transform.
* `song3-scenery-primary.png`: repaired and alpha-composited JPEG3 id 14 from `song3/song.swf`.
* `song3-scenery-secondary.png`: repaired and alpha-composited JPEG3 id 39 from `song3/song.swf`; retained as recovered source evidence, but not rendered in the current frame-1 scene because the display-list placement parser did not find it active on frame 1.
* `song4-scenery.png`: repaired and alpha-composited JPEG3 id 11 from `song4/song.swf`; retained as child-layer evidence rather than a separately stretched runtime layer.
* `song5-scenery.png`: repaired and alpha-composited JPEG3 id 12 from `song5/song.swf`; retained as child-layer evidence rather than a separately stretched runtime layer.
* `song6-scenery.png`: repaired and alpha-composited JPEG3 id 11 from `song6/song.swf`; retained as child-layer evidence rather than a separately stretched runtime layer.
* `song7-scenery.png`: repaired and alpha-composited JPEG3 id 9 from `song7/song.swf`; retained as child-layer evidence rather than a separately stretched runtime layer.
* `song8-scenery.png`: repaired and alpha-composited JPEG3 id 4 from `song8/song.swf`; retained as child-layer evidence rather than a separately stretched runtime layer.

Generated proof assets remain ignored under `app/generated/nutcracker-source-extract/`.

The broader song-scene PNG extraction pass generated a clean proof inventory under `app/generated/nutcracker-source-extract/all-song-images-clean/`, plus `contact-strip.png`. For `song1` through `song8`, the extractable PNGs are the repeated 449 x 313, 412 x 138, and 600 x 460 assets, although their SWF asset IDs vary by song. Pixel-hash checks show those PNGs are mostly repeated source assets rather than unique per-song scene backgrounds. Song-specific variation appears to live in vector/JPEG/timeline composition.

The JPEG3 recovery is now reproducible with `npm run assets:nutcracker-jpeg3` from `app/`. The script lives at `app/scripts/extract-nutcracker-jpeg3.mjs` and writes proof artifacts to `app/generated/nutcracker-source-extract/direct-image-tags/`.

The broader SWF evidence pass is reproducible with `npm run assets:nutcracker-swf` from `app/`. The script lives at `app/scripts/extract-nutcracker-swf-assets.mjs` and writes:

* direct `DEFINEBITSLOSSLESS2` PNGs from `nutchooser.swf`, `song*/song.swf`, and `song*/characters/anim*.swf`
* placement dumps from `swfdump -b -p`
* ActionScript dumps from `swfdump -a`
* text dumps from `swfdump -t`
* `manifest.json` linking source SWFs, extracted asset IDs, dimensions, and output files

The same command now parses every placement dump into structured display-list evidence instead of leaving matrices and nested ownership only in prose. The reusable parser is `app/scripts/lib/swf-display-list.mjs`. It records sprite ownership, shape/bitmap definitions, bounds, depth, names, matrices, morph ratios, frame labels, and color transforms. The pass writes:

* one full JSON display list per inspected SWF under `app/generated/nutcracker-source-extract/full-swf-pass/display-list/`
* `display-list/targets.json`, covering chooser hallway/frame/instruments and song curtain/help/warning targets
* `display-list/contact-sheet.html`, a deterministic source-evidence review sheet; it is not replacement art
* `app/src/data/generated/nutcrackerDisplayListCatalog.ts`, a compact committed catalog that future UI code and tests can consume without guessing symbol IDs or placement matrices

The required target gate currently resolves six targets with zero hidden blockers: chooser sprite ids `0021`, `0034`, and `0068`; song sprite ids `0063`, `0333`, and `0340`. The curtain target preserves labels `home@1`, `alert@2`, `bye@6`, `giveHint@11`, and `quitNow@16`. Song help/warning placements are locked to owner sprite `0359`, frames `28`/`30`, depth `0001`, and ratios `27`/`29`; the proof also retains and requires the help-frame `0333`/`0334` pair and warning-frame `0340`/`0341`/`0346`/`0351`/`0352` composition. A missing source SWF, promoted runtime asset, target symbol, exact owner/frame/depth/name placement, required child, or required frame sibling now fails the extraction command with a concrete blocker instead of accepting another placement of the same symbol.

Representative selected-actor assets are promoted from that generated SWF output with `npm run assets:nutcracker-actors`. The script lives at `app/scripts/promote-nutcracker-actor-assets.mjs` and copies one source PNG per `song#/characters/anim#.swf` into `app/src/assets/nutcracker-source/song#-track#-actor.png`.

Reusable source UI assets that are not actor/scenery assets are promoted with `npm run assets:nutcracker-ui`. The script currently promotes the `courtain` scallop bitmap from `song1__song/lossless-39.png` to `app/src/assets/nutcracker-source/song-curtain-scallop.png` so the runtime does not keep relying on the misleading old `song-sound-icon.png` name. It also extracts/renders the recoverable `courtain` base sprite id `0042` child shapes `0038`, `0040`, and `0041`, applies the source CXForm to shape `0040`, and promotes `song-curtain-fill.png`, `song-curtain-curve-cxform.png`, and `song-curtain-stars.png`; extracts/renders source song-control shapes `0119`, `0126`, and `0113` for `song-control-help-body.png`, `song-control-button-body.png`, and `song-play-again-button-body.png`; extracts/renders `nutchooser.swf` sprite `0068` and applies the root CXForm for `chooser-instruments-cxform.png`; extracts/renders `nutchooser.swf` shape id `0201` for normal visible `chooser-help-button-art.png`; extracts/renders chooser shape id `0205` and text id `0204` for the composed normal visible `quiter` control (`chooser-exit-button-art.png` plus `chooser-exit-label.png`); extracts/renders and translated-wrapper trims chooser `magicKey` sprite id `0213` for `chooser-magic-key.png`; extracts/renders `nutchooser.swf` sprites `0169`, `0170`, and `0177`; promotes translated-wrapper renders for chooser `helpframe` and `warningFrame` talkers; promotes chooser warning body shapes `0179` and `0184` plus `YES`/`NO` text ids `0180` and `0185`; promotes the song-scene `helpframe` sprite id `0333`; promotes song-scene `keyFrame` sprite id `0355`; and promotes the song-scene `warningFrame` sprite id `0340` plus song warning body shapes `0344` and `0349` and `YES`/`NO` text ids `0345` and `0350`.

## Current renderer limits

The installed `swfrender` can render `song1/song.swf`, but `nutchooser.swf` and `song2` through `song8` fail with `No JPEG library compiled in`. `ffmpeg` can decode an embedded 449 x 313 alpha image from the song SWFs, but it is not the full 640 x 480 stage composite and is not used as a scene background.

`swfextract` can list the JPEG IDs in `nutchooser.swf` and `song2` through `song8`, but this local build also fails to extract those JPEGs with `jpeg_load_from_mem: No JPEG support compiled in`. To avoid losing those source assets, the current extraction pass parses SWF tags directly:

* `DefineBitsJPEG3` tag 35 is read from the uncompressed SWF body.
* The SWF JPEG marker quirk is repaired by removing the stray `FFD9 FFD8` pair from the JPEG data.
* The compressed alpha stream is inflated and applied as image opacity.
* The repaired transparent PNGs are copied into `app/src/assets/nutcracker-source/`.

Because `swfrender` still cannot render full song 2-8 composites, the current implementation uses the source-rendered song 1 stage as the shared song-game scene reference, overlays recovered song-specific JPEG3 scenery where frame-1 display-list placement can be recovered, and places modern HTML hotspots at positions derived from the visible source render and `nutchooser.swf` placement data.

The full `characters/anim*.swf` timelines are not yet played in the DOM. Instead, selected instruments render a representative source-extracted lossless bitmap from the current song's own `characters/anim#.swf` on the stage and apply a small CSS motion pass derived from the SWF placement dumps. This is closer to the original than invisible-only, static selection state, or reusing song 1 actor art for every song, but it is still a documented fallback for the real Flash behavior, which loads each `anim#.swf` into the corresponding `anim#` movie slot and plays timeline animation.

## Character animation fallback evidence

Each selected actor element now records its corresponding source movie as `data-source-animation="games/nutcrackergame/song#/characters/anim#.swf"`. It also records the current toolchain failure in `data-source-fallback`: local `swfrender` has no frame selector, representative full animation SWFs render transparent at frame 1, and extracted later frames can crash. The browser does not execute those SWFs, so the DOM fallback uses the promoted per-song lossless actor bitmap plus restrained `steps()` CSS transforms. The transform direction and relative size come from the placement dumps under `app/generated/nutcracker-source-extract/full-swf-pass/dumps/`, with targeted overrides where promoted actors have different source shapes.

The actor contract now lives in `NutcrackerTrack`: every one of the 64 song/track rows carries `actorSourcePath`, `actorPlayback = "documented source-derived fallback"`, and the exact `actorFallbackReason`. Runtime actor metadata is generated from those fields, preventing song 1 provenance from being reused accidentally. This is the accepted M06B source-derived fallback until a renderer with verified arbitrary-frame selection replaces the current toolchain; it is not represented as exact animation playback.

This matters visibly: song 5, song 7, and song 8 track 7 promote a 167 x 358 standing drummer actor from their own `anim7.swf`, while song 1 track 7 remains the 129 x 64 cannon. The previous global `track7-cannon.png` fallback was source-backed only for song 1 and was wrong for those later songs.

The measured `PLACEOBJECT2 moves object` ranges in `song1__characters__anim*.placements.txt` show repeated timeline movement rather than static actors:

* `anim1`: multiple depths move across roughly `510-648px` x and `64-189px` y, so the DOM Nutcracker uses a broad but bounded side-to-side walk/bob.
* `anim2`: the main moving depths cover roughly `318-446px` x and `37-46px` y, so the mouse uses a flatter scurry.
* `anim3`: the train depths cover roughly `803-813px` x and `40-41px` y, so the train uses mostly horizontal translation.
* `anim4`: elephant depths cover roughly `480-514px` x and `42-48px` y, so the elephant uses a slow lateral sway.
* `anim5`: dancer depths cover roughly `331-603px` x and `19-76px` y, so the dancer uses lateral motion with a stronger vertical lift.
* `anim6`: horseman depths cover roughly `496-577px` x and `53-106px` y, so the horseman uses a gallop-like x/y bob.
* `anim7`: cannon depths move only about `12-23px` x and under `1px` y, so the cannon uses a short recoil.
* `anim8`: round-doll depths cover roughly `670px` x and `22-27px` y, so the doll uses mostly horizontal gliding.

Frame-specific SWF rendering was tested as a possible route to exact spritesheets, but this local `swfrender` build does not expose a frame option, and rendering frame-extracted character SWFs can crash on later frames. A later check also rendered representative full character SWFs such as `song5/characters/anim7.swf`, `song2/characters/anim5.swf`, and `song1/characters/anim1.swf`; all produced fully transparent 600 x 460 first-frame PNGs because the visible actor content starts after the initial frame. Until a more robust SWF timeline renderer is added, the promoted per-song bitmap plus CSS motion is the source-documented fallback rather than exact playback.

## Song scenery placement evidence

A direct SWF parser was used to combine `DefineShape` bounds, bitmap fills, sprite timelines, and nested `PlaceObject2` matrices for the recovered JPEG3 scenery. These global frame-1 rectangles remain child-layer placement evidence; the runtime now gets their exact visible transforms from each complete source-runtime capture instead of separately stretching the repaired JPEG3s:

* `song2-scenery.png`: bitmap id 7, shape id 8, path `root>18>9>8`, rect `left 159.8314 top 20.7466 right 469.3663 bottom 204.1571`.
* `song3-scenery-primary.png`: bitmap id 14, shape id 15, path `root>43>17>16>15`, rect `left 234.1066 top 41.2409 right 410.7124 bottom 183.0319`.
* `song4-scenery.png`: bitmap id 11, shape id 12, path `root>33>14>13>12`, rect `left 244.9247 top 41.3908 right 389.3497 bottom 176.0600`.
* `song5-scenery.png`: bitmap id 12, shape id 13, path `root>31>15>14>13`, rect `left 137.3983 top 34.8997 right 515.5420 bottom 206.5749`.
* `song6-scenery.png`: bitmap id 11, shape id 12, path `root>41>15>13>12`, rect `left 228.6588 top 35.5335 right 393.9672 bottom 190.1374`.
* `song7-scenery.png`: bitmap id 9, shape id 10, path `root>32>12>11>10`, rect `left 115.0077 top 36.4098 right 585.5344 bottom 230.5284`.
* `song8-scenery.png`: bitmap id 4, shape id 5, path `root>35>7>6>5`, rect `left 84.9492 top 50.2054 right 518.1815 bottom 213.3434`.

The parser recovered `song3-scenery-secondary.png` from JPEG3 id 39, but did not find an active frame-1 placement for that bitmap in the current timeline pass. It remains in the source asset folder as evidence, but the app does not render it as visible song 3 scenery until its timeline usage is proven.

## Song-game behavior evidence

`song1/song.swf` defines `testCombination()` and `showHint()` in its root ActionScript. `testCombination()` computes `_root.instCorrect`, `_root.instNoCorrect`, and `_root.gameSolution`, setting `gameSolution` to `ok` when every selected scene instrument is correct and to `try again` otherwise. `showHint()` calls `testCombination()` and then writes the visible message:

* `you have ` + `instCorrect` + ` correct instruments and ` + `instNoCorrect` + ` incorrect instruments `
* `All songs are played by 4 instruments!`
* `Listen to the original song and find  4 correct instruments. Double click on the instruments or drag them onto the stage.`

`gameSolution` is only ActionScript state in the recovered dumps; no `DEFINEEDITTEXT` field is bound to `_root.gameSolution`. The visible hint/check copy uses `_root.message` inside the `courtain` sprite. `courtain` is placed on the root timeline as sprite id `0063` at depth `0082`, x `319.85`, y `4.90`. In the `giveHint` frame, edit text id `0058` is placed at depth `0007` with matrix scale `0.953/0.843`, x `132.90`, y `96.80`, ratio `14`. The DOM therefore treats HINT and incorrect-check feedback as a source-curtain fallback rather than a normal always-visible page banner. The change-song prompt uses the related `alert` frame, where edit text id `0054` is placed at depth `0012`, x `155.90`, y `97.10`, ratio `4`.

The `courtain` base art is partly recoverable today. `swfextract -i 63 -P` preserves the root placement and confirms the placed sprite, but `swfrender` only renders the first internal/home frame and produces a nearly empty 640 x 480 PNG because this local build cannot seek to the `alert` or `giveHint` internal frames. Direct isolated render of base sprite id `0042` also produced a blank 512 x 512 PNG, but its child shapes render cleanly: id `0038` is the dark fill, id `0040` is the curved/scalloped line layer with source CXForm `add 0 102 255`, and id `0041` is the star layer. The app composes those promoted child layers at the source-derived open `courtain` rectangle, then overlays DOM `_root.message` text and source YES/NO labels. This is closer to the recovered SWF than the earlier modern bordered rectangle, but still a documented fallback for dynamic text and exact `courtain` frame playback.

Instrument button handlers in the SWF also call `_root.testCombination()` after instrument add/remove interactions. The modern implementation mirrors that effective behavior by checking automatically when the fourth instrument is selected, instead of adding an invented visible submit button.

The root timeline places empty/shared movie slots named `inst1` through `inst8`, `anim1` through `anim8`, and `prevTrack1` through `prevTrack8`. Its ActionScript and child button actions reference `doubleClick`, `dragInstrument`, `hitArea.hitTest`, `instOnScene`, `_root.activeInst#`, `addINST`, `removeAnim`, and `testCombination`.

The modern implementation now follows that interaction model more closely: a single click previews the source track stream, while double-clicking an instrument or dragging it onto the stage selects it and renders the source-extracted actor art. Full `anim*.swf` timeline playback remains a fidelity gap to close with a deeper SWF display-list renderer.

Modern selected/correct/incorrect badges, yellow hotspot fills, and red/green actor glows are not source-backed. The SWF communicates selected instruments by loading the corresponding `characters/anim#.swf` into `anim#` slots and communicates hint/check results through `_root.message` in the `courtain` sprite. The DOM therefore keeps selected/correctness state in classes/data/ARIA for behavior and tests, but avoids visible invented badges/glows over the preserved viewport.

The SWF `helpme(a, b)` function sets `_root.helpmessage`, sends `_root.flyinghelp` to frame `a`, starts dragging `_root.flyinghelp`, and makes that help clip visible. `nohelp()` clears `_root.helpmessage`, hides `_root.flyinghelp`, and moves it to x `10000`. The root timeline places `flyinghelp` as sprite id `0257`, depth `0306`, initial matrix x `1143.85`, y `195.55`. Instrument rollovers call `helpme` with source labels including `BASS`, `VIOLIN`, `TRUMPET`, `FLUTE`, `VIBRAPHONE`, `PIANO`, `DRUM`, `SAXOPHONE`, `MARIMBA`, `OBOE`, and `TIMPANI`; rollouts call `nohelp()`. Song 1 instrument calls mostly use `helpme(2, label)`, while `SAXOPHONE` uses `helpme(3, "SAXOPHONE")`. Song controls use `helpme(4, ...)` for `Hint`, `Select a\ndifferent\nsong`, `Listen to the Original Music`, and `Stop the Music`, while `Quit the Game` uses frame 3. The DOM mirrors that with one source-provenance `.source-flying-help` element driven by pointer/focus state, carrying `data-source-frame` and `data-source-bounds` from the recovered frame calls instead of rendering separate static tooltip boxes. Song 7 track 2 uses the source-specific `VIOLIN (PIZZICATO)` label found in `song7__song.actions.txt`. `English Horn` is retained as an uppercase trackinfo-derived fallback because no matching source help string was found in the current song 3 dumps.

`flyinghelp` frames 2 and 3 are layered `_root.helpmessage` edit-text stacks: ids `0231`-`0233` for frame 2 and ids `0234`-`0236` for frame 3, each with source bbox roughly `228 x 18` at scale `1.2`, or about `276 x 22` in DOM pixels. Frame 2 places those layers at x `18.00`, `17.45`, and `16.75` with y `-23.70`, `-24.05`, and `-24.75`; frame 3 places ids `0234`-`0236` at x `-287.30`, `-280.90`, and `-285.80` with y `-24.90`, `-25.25`, and `-25.95`. Frame 4 places sprite id `0240` at x `80.00`, y `37.20`; sprite `0240` fades in nested sprite id `0239`, which contains dynamic edit text ids `0237` and `0238` at x `-61.40` / `-62.20` and y `-61.70` / `-62.50`. Frames 5 through 8 introduce shape ids `0241`, `0244`, `0246`, `0251`, and `0252`.

Rendering exact `flyinghelp` frames is still blocked in this local toolchain. `swfextract -i 240` and `swfextract -i 257` against `song1/song.swf` succeeded, but `swfrender` produced fully transparent 512 x 512 PNGs for both `flyinghelp-frame4-240.png` and `flyinghelp-257.png`. `swfcombine --stack1 -X 360 -Y 200 -x 180 -y 120` around extracted sprite `0257` also produced a fully transparent `flyinghelp-257-shifted.png` and printed unresolved dynamic text IDs `231`, `232`, and `233`. `swfextract -f 4` / `-f 8` did not write usable frame SWFs for the extracted parent clip. The DOM therefore now mirrors the recovered source display list with layered text spans and normalized source offsets for frames 2, 3, and 4. This replaces the earlier single-node `text-shadow` approximation, but it remains a documented fallback until a renderer can flatten dynamic text timeline frames.

## Instrument hotspot placement evidence

The DOM instrument hotspots now carry `data-source-placement`, `data-source-vector-bounds`, and `data-source-hit-rect` attributes so each clickable area can be audited against `song1__song.placements.txt`. The SWF root places each instrument button as an `instIMG#` movie instance with action code; those instances drive double-click, drag, preview, and hover-help behavior.

`swfdump` prints later symbol definitions between root placement records, so help-label constant pools printed after `instIMG#` do not always belong to that already-placed instance. The stable placement evidence is the named root `PLACEOBJECT2` record plus the already-known `instIMG#` / track-number convention from the ActionScript references to `_root.instIMG` + `i`.

The recovered root instance evidence for song 1 is:

* Track 1 / `instIMG1`: id `0171`, depth `0153`, matrix scale `1.055`, x `153.20`, y `405.50`; immediate shape id `0172` bbox `[-62.50,-29.15,62.45,29.20]`, approximate source rect `87.26,374.74,131.82,61.55`.
* Track 2 / `instIMG2`: id `0213`, depth `0253`, matrix scale `1.055`, x `103.10`, y `355.75`; immediate shape id `0214` bbox `[-56.65,-24.15,56.65,24.10]`, approximate source rect `43.33,330.27,119.53,50.90`.
* Track 3 / `instIMG3`: id `0221`, depth `0282`, matrix scale `1.055`, x `141.15`, y `317.25`; immediate shape id `0222` bbox `[-66.65,-5.15,66.65,5.20]`, approximate source rect `70.84,311.82,140.63,10.92`.
* Track 4 / `instIMG4`: id `0229`, depth `0294`, matrix scale `1.055`, x `317.45`, y `352.35`; nested sprite id `0229` uses frame-labeled button states. Frame `face1` places id `0092`, which contains shape id `0091` bbox `[-66.65,-5.15,66.65,5.20]`, yielding approximate source rect `248.14,348.82,140.63,10.92`.
* Track 5 / `instIMG5`: id `0179`, depth `0169`, matrix scale `1.055`, x `307.70`, y `402.20`; immediate shape id `0180` bbox `[-45.50,-51.25,45.60,51.30]`, approximate source rect `259.70,348.13,96.11,108.20`.
* Track 6 / `instIMG6`: id `0187`, depth `0201`, matrix scale `1.055`, x `444.65`, y `366.70`; immediate shape id `0188` bbox `[-24.90,-36.65,24.90,36.65]`, approximate source rect `418.38,328.04,52.54,77.33`.
* Track 7 / `instIMG7`: id `0195`, depth `0229`, matrix scale `1.055`, x `522.90`, y `408.05`; immediate shape id `0196` bbox `[-34.90,-51.45,34.95,51.45]`, approximate source rect `486.08,353.76,73.70,108.56`.
* Track 8 / `instIMG8`: id `0203`, depth `0241`, matrix scale `1.055`, x `556.35`, y `339.60`; immediate shape id `0204` bbox `[-54.00,-20.40,53.50,20.35]`, approximate source rect `499.38,318.08,113.41,42.99`.

The DOM hit rectangles intentionally remain slightly larger than some vector bounds because several source button shapes are narrow lines or nested timeline states while the visible source render has overlapping instrument art. The rectangles are source-derived targets, not exact Flash hit-test playback. Track 4 was corrected from the earlier far-right fallback hotspot to the recovered `instIMG4` placement area.

## Source song control placement evidence

The DOM song controls now use the source instance names, button ActionScript, placement records, and calculated source hit rectangles from `song1__song.actions.txt` / `song1__song.placements.txt`. The prior mapping inferred semantics from misleading instance names and was wrong; the button ids are authoritative:

* `helpButton`: sprite id `0120` at depth `0122`, matrix scale `1.350`, x `556.50`, y `165.30`. Nested button id `0118` has hover text `Help`; on release it sets `_root.theNextFrame = "helpFrame"`, drives `_root.usmus` to `helpFrame` / `showUp`, stops previews, pauses instruments, disables focus/speakers, and sends `quiter` to `buttonOFF`. Its DOM hit rectangle is `532.13,141.95,51.98,38.48` and opens the recovered song help frame.
* `hintButton`: sprite id `0127` at depth `0127`, matrix scale `1.350`, x `556.35`, y `267.95`. Nested button id `0125` has hover text `Hint`; on release it stops the current preview, calls `instframebuttonOFF` / `pauseInst` / `instFrameHold`, calls `showHint()`, drives `_root.courtain` to `giveHint`, disables speakers/focus/quiter, and holds the instrument controls. Its DOM hit rectangle is `532.76,240.75,51.96,38.21` and maps to `data-song-action="hint-song"`.
* `YES` / `NO`: warning-frame text ids `345` and `350` are rendered as `song-yes-label.png` and `song-no-label.png` for the change-song alert, and separately promoted as `song-warning-yes-label.png` / `song-warning-no-label.png` for the song-exit warning. Warning-frame placement records put YES button id `0346` and NO button id `0351` into the warning flow.
* `songChooser`: sprite id `0133` at depth `0133`, matrix scale `1.598`, x `84.10`, y `163.70`. Nested button id `0132` has hover text `Select a\ndifferent\nsong`; on release it sets `_root.message` to `press "Yes" to change this song or "No" to cancel` and drives `_root.courtain` to `alert`. Its DOM hit rectangle is `57.82,136.05,56.73,43.23` and maps to `data-song-action="confirm-change-song"`.
* `listenSong`: sprite id `0144` at depth `0138`, matrix scale `1.524`, x `81.75`, y `266.30`. Nested button id `0137` has hover text `Listen to the Original Music`; on release it calls `previewSong()` and changes to the `songStop` state, whose button id `0143` calls `stopPreview()` / `resumeInst()` / `instFrameShow()` and has hover text `Stop the Music`. Its DOM hit rectangle is `52.18,235.59,64.39,43.13` and maps to the listen/stop behavior.
* `gameController`: sprite id `0115`, depth `0116`, matrix scale `1.140`, x `322.20`, y `317.70`; its `buttonAgain` frame places button id `0114` at x `-0.90`, y `1.75`, ratio `3`. The winner timeline sends `_root.gameController` to `buttonAgain` after a correct solve, so the DOM reset/play-again control is positioned from this source placement rather than the earlier guessed top-stage position.
* `quiter`: sprite id `0150` at depth `0145`, matrix scale `0.900`, x `585.90`, y `472.45`. Nested button id `0148` has hover text `Quit the Game`; on release it stops previews/instruments, sets `_root.theNextFrame = "warningFrame"`, and drives `_root.usmus` to `warningFrame` / `showUp`. Its DOM hit rectangle is `549.72,449.05,72.36,46.89` and maps to `data-song-action="confirm-exit-song"`.

The complete normal source-runtime frame now supplies the visible normal art for all five controls, while transparent buttons preserve pointer/keyboard input at the calculated Flash bounds. This avoids duplicating or distorting the baked source controls. `listenSong` can still layer recovered source button/STOP-label evidence over the normal capture while the preview is active, and `gameController` `buttonAgain` remains a composed fallback using source shape id `0113` plus text id `0111` because it is not part of the captured normal state.

The recovered `courtain` `giveHint` state is interactive rather than a passive message. It places button id `0057` at depth `0005`, `_root.message` edit id `0058` at depth `0007`, and action-bearing clip id `0059` at depth `0008`. Button `0057` stops the preview, restores the instrument frame and speakers/focus/quiter state, and plays the `courtain` `bye` timeline. The DOM therefore exposes the full source curtain as `data-song-action="dismiss-hint"`, keeps the hint visible until that source action is activated, and restores focus to `hintButton`. While Help, HINT, change-song, or the exit warning is active, the underlying track/drop/control surface is `inert`, its buttons are disabled, actor CSS timelines are paused, and event guards reject synthetic background activation. This mirrors the source `noAction`, `focus(...buttonOFF)`, and `instFrameHold` behavior rather than relying only on pointer-event styling.

The same source controls also call `helpme`/`nohelp` on hover. The recovered control hover strings are `Help`, `Hint`, `Select a\ndifferent\nsong`, `Listen to the Original Music`, `Stop the Music`, and `Quit the Game`; the DOM routes them through the shared `.source-flying-help` element instead of per-button tooltip spans.

The song scene still has a generic app-level `renderHelp()` fallback for non-source shells, but it is now source-mapped instead of showing generic instructional copy in the source viewport. The recovered `helpFrame` path sets `_root.theNextFrame` to `helpFrame`, drives `_root.usmus` to `helpFrame` / `showUp`, stops previews, pauses/holds instruments, turns speakers/focus off, and sends `_root.quiter` to `buttonOFF`. The root `helpframe` places sprite id `0333` at depth `0001` with matrix scale `1.051`, x `-5.00`, y `74.95`, ratio `27`, and places `noAction` id `0334` at depth `0003` with matrix scale `12.497`, x `-319.25`, y `-234.35`, ratio `27`. Sprite id `0333` places nested sprite id `0332` at scale `0.799`; the DOM fallback overlays `song-helpframe-talker.png` rendered from sprite `0333` and keeps the route help copy screen-reader-only because no source text object for visible instructional copy has been recovered in the `helpframe` dump. The source helper auto-exits only after its streamed sprite timeline; because the static fallback cannot replay that full timeline, it uses one documented full-frame dismiss surface, focuses it while open, and restores focus to `helpButton` when dismissed.

The song-scene `quiter` release follows the recovered `warningFrame` path. The root `warningFrame` places sprite id `0340` at depth `0001` with matrix scale `1.051`, x `-15.45`, y `52.40`, ratio `29`; places `noAction` id `0341` at depth `0003`; places YES button id `0346` at depth `0005`, x `-66.15`, y `-43.55`; places NO button id `0351` at depth `0008`, x `27.30`, y `-43.55`; and places close/transition sprite id `0352` at depth `0011`, x `96.30`, y `-143.70`. Shape id `0344` plus text id `0345` render the visible `YES` button, and shape id `0349` plus text id `0350` render the visible `NO` button. Button id `0346` calls `_level0.gotoAndPlay("comeAgain")`; button id `0351` runs the source cleanup path that calls `stopPreview`, `resumeInst`, `instFrameShow`, restores speakers/focus/quiter state, and leaves the song scene active. Because local frame extraction for the full root `warningFrame` is still not a full display-list renderer, the DOM composes `song-warningframe-talker.png` and source YES/NO button layers with source metadata as a documented fallback rather than adding invented warning text.

The final Nutcracker song completion path shows the source `keyFrame`. In the winner timeline, `song1/song.swf` first sends `_root.gameController` to `buttonAgain`, calls `FSCommand:exec saveNutDoor<theSong>.exe`, and checks `_level0.nutDoorsVisited`. When that value equals `7`, meaning the current solve completes the eighth door, it calls `saveKey1.exe`, sets `_level0.gameKey1 = 1`, calls `_level0.updateKeys(0)`, sets `_root.theNextFrame` to `keyFrame`, and sends `_root.usmus` to `showUp`. The root `keyFrame` places sprite id `0355` at depth `0001` with matrix scale `1.051`, x `-15.05`, y `53.20`, ratio `30`, and `noAction` id `0356` at depth `0003`. Direct render of id `0355` clips the left-side source art; the translated-wrapper render produces `song-keyframe-talker.png`, which the DOM shows only for the final all-doors-complete correct solve.

The old generic song-page HINT/EXIT wrapper is no longer rendered over song scenes. The generic beige help modal is also replaced for song scenes by the recovered `song-help-art.png` frame when scene help is opened.

## Track preview timing evidence

The extracted `track*.mp3` streams are full-length synchronized song tracks. They often contain leading silence before the selected instrument enters. `trackinfo.txt` has `firstFrame#` values, but those frame values are not reliable as audio-preview seek points across all songs: for example, song 8 track 2 has `firstFrame2=559` while the extracted audio is already audible near the start.

All 64 runtime MP3s are root `MP3 Soundstream` records in `song1` through `song8` `track1.swf` through `track8.swf`; they are not standalone files in the recovered tree. Because `npm run assets:pipeline` owns and clears `app/public/local-media/audio`, it now preflights the ordered source-path/SHA-256 manifest (`394f2c02bf6e59b1fe733b0f5183c245d5bb0fda0417a76038a9bae1ca65908c`) and runs `swfextract -m` for every track after copying external audio. The runtime data test stats every mapped output, so a destructive pipeline rebuild cannot leave the source atlas green while silently removing the song audio.

The modern preview interaction therefore keeps `firstFrame` as recovered metadata, but uses `ffmpeg silencedetect` against the extracted MP3s for the audible preview seek point. This directly addresses the slow-feeling song 1 track 5 and track 8 previews:

* `song1/track5.mp3`: first audible sample detected around `10.9s`.
* `song1/track8.mp3`: first audible sample detected around `19.3s`.
* `song8/track2.mp3`: first audible sample detected around `0.6s`, despite `firstFrame2=559`.

Main instrument hotspots now start the extracted track preview directly; the earlier separate HTML play icons were removed because they were invented viewport UI and the SWF source uses the instrument interaction itself.

## Chooser button placement evidence

`nutchooser.swf` sets the movie background to white and places source scene assets with these records:

* Background/composition sprite `id 0021`: depth `0001`, matrix scale `0.743`, x `87.85`, y `46.15`; this sprite contains JPEG3 id `0019` and vector/color-shape composition. It places shape id `0016` at depth `0001`, shape id `0017` at depth `0007` with matrix x `273.35`, y `137.75` and CXForm add `143 60 -10 0`, shape id `0018` at depth `0011`, and shape id `0020` at depth `0012` with CXForm mul `0 0 0 1` and add `255 51 153 0`. Extracting/rendering the full sprite directly still fails locally with `No JPEG library compiled in` because shape id `0020` depends on JPEG3 id `0019`. The promoted child layers remain deterministic depth/matrix/CXForm evidence, but the visible normal runtime now uses `nutchooser-source-normal.png`, the complete official-Ruffle capture, because separately stretching those children did not reproduce the source frame exactly.
* Frame sprite `id 0034`: final depth `0055`, matrix scale `1.055`, x `5.55`, y `-3.85`, ratio `5`; the complete official-Ruffle normal capture preserves this placement, while `nutchooser-frame-source.png` remains available for help/warning compositions.
* Instrument sprite `id 0068`: final depth `0069`, matrix scale `1.000`, x `46.55`, y `285.85`, ratio `5`, color transform add `-209 -153 134 -223`; the complete official-Ruffle normal capture preserves the visible transformed instrument bed. `chooser-instruments-cxform.png` and the untransformed `chooser-instruments.png` remain committed transformation evidence.

`nutchooser.swf` places the shared door movie clip id 80 as instances `m1` through `m8`. The modern implementation uses these placement records as the basis for door hotspot positions:

* `m1`: matrix scale 1.077, x -20.25, y -5.55.
* `m2`: matrix scale -1.077, x 658.65, y -6.40.
* `m3`: matrix scale 0.674, x 104.20, y 70.95.
* `m4`: matrix scale -0.673, x 532.85, y 70.95.
* `m5`: matrix scale 0.437, x 184.90, y 114.05.
* `m6`: matrix scale -0.436, x 446.55, y 112.95.
* `m7`: matrix scale 0.293, x 237.55, y 135.60.
* `m8`: matrix scale -0.293, x 397.90, y 136.70.

The chooser DOM now records those original placements in `data-source-placement` on each door card. Modern `Ready`, `Locked`, and `Cleared` state text is intentionally not visible in the 640 x 480 source viewport because the recovered Flash scene shows the door movie clips, not a modern status label overlay. The opened-door sprite is visible only when the corresponding recovered `door#` completion flag equals `1`; ready and locked doors use transparent hit areas over the hallway art. The state remains available as `data-door-state` and `aria-label` for accessibility and automated checks. Source-specific CSS explicitly cancels the generic `.door-button:disabled` border/background so locked doors cannot regress into beige HTML rectangles.

The eight navigation buttons are separate source button ids `0086` through `0093`, all backed by shape id `0085`. Shape `0085` has local bounds x `36.75` to `80.65` and y `-69.45` to `38.15`. Applying each root button matrix yields the runtime hit rectangles: door 1 `(105.02, 107.96, 77.97, 191.10)`, door 2 `(447.07, 102.91, 77.97, 191.10)`, door 3 `(187.93, 134.17, 47.76, 131.81)`, door 4 `(393.59, 130.74, 53.21, 140.31)`, door 5 `(239.34, 145.03, 28.84, 98.02)`, door 6 `(361.66, 152.45, 33.93, 89.63)`, door 7 `(270.60, 157.47, 20.55, 75.64)`, and door 8 `(341.66, 150.00, 17.03, 81.02)`. The earlier DOM used the root translation as if it were the transformed shape origin, leaving the invisible controls materially offset from the actual hallway doors.

The full 512 x 512 isolated sprite-id-80 render also contains unrelated render-origin pixels, so stretching that whole image into a hit rectangle produced a thin white artifact. `npm run assets:nutcracker-ui` now crops the stable source-local rectangle `100x190+130+105`, strips metadata, hash-locks it as `chooser-open-door.png` (`6145ebfc7db5002496463222057d950c77a6cabc6f7d0b04d72bf4e4eab293df`), and the DOM applies each `m#` matrix independently of the button geometry. Negative-scale `m2`, `m4`, `m6`, and `m8` placements are mirrored with `scaleX(-1)`.

Each `m#` door placement also has source on-load ActionScript. It derives `iam` from `this._name.substr(1,1)`, reads `_root.door#` from the variables loaded out of `games/data/nutdoors.txt`, and sets `this._visible` to `1` or `0`. The DOM mirrors completion visibility with the opened-door image, and mirrors sequential clickability with `disabled`, `data-door-state`, and ARIA, without modern dimming, backgrounds, hover outlines, glow filters, or extra shadows.

A standalone official-Ruffle probe with a temporary `games/data/nutdoors.txt` containing `door1=1` did not issue the text-file request when `nutchooser.swf` was loaded outside the recovered projector/level lifecycle, so it could not be used as completed-state proof. The opened-door reconstruction therefore relies on the extracted id-80 clip, its source-local bounds, the eight root matrices above, and the recovered on-load visibility ActionScript; the complete normal-state capture remains the visual reference for the otherwise hidden door layers.

The chooser also has its own source controls, not just the song-scene labels:

* `helpButton`: sprite id `0202`, depth `0168`, matrix scale `1.350`, x `556.50`, y `165.30`, ratio `5`; its ActionScript hover string is `Help` and its release path sets `_root.theNextFrame` to `helpFrame`.
* `quiter`: sprite id `0207`, depth `0173`, matrix scale `0.900`, x `585.90`, y `472.45`, ratio `5`; its ActionScript hover string is `Quit the Game` and its release path sets `_root.theNextFrame` to `warningFrame`.
* `magicKey`: sprite id `0213`, depth `0175`, matrix scale `0.642`, x `316.05`, y `175.80`, ratio `5`; its on-load ActionScript reads `_level0.nutDoorsVisited`, compares it to integer `8`, then sets `this._visible` to `1` only on equality and `0` otherwise. The DOM mirrors that by rendering the promoted key image only when `openedNutDoorCount === 8`; state remains in `data-source-visible` when hidden.

These controls are root display-list children after the door instances, so their transparent source-bounded buttons remain inside `.nutcracker-chooser` instead of the external app-shell action strip. `helpButton` sprite id `0202` has `buttonON` placing button id `0200` at depth `0001` and shape id `0201` at depth `0004`; its `buttonOFF` frame places shape id `0198` at depth `0002` with alpha multiplier `0.4`. The normal visible Help art is baked into the complete source-runtime capture; the hit rectangle still comes from the root matrix plus shape bbox `[-18.05,-17.10,20.45,11.20]`, approximately left `532`, top `142`, width `52`, height `38`. `quiter` sprite id `0207` has `buttonON` placing button id `0206` at depth `0001`; shape id `0205` and text id `0204` remain separately promoted button-state evidence. The normal visible EXIT art is baked into the source-runtime capture while the transparent hit rectangle retains approximately left `550`, top `449`, width `72`, height `47`. The DOM exposes the recovered button records in `data-source-state`.

Chooser control hover text also uses source ActionScript calls, not generic blue tooltip spans. Button id `0200` pushes string `Help`, frame `4`, and calls `_root.helpme`, while rollout calls `_root.nohelp`. Button id `0206` pushes string `Quit the Game`, frame `3`, and calls `_root.helpme`, while rollout calls `_root.nohelp`. The current `nutchooser` dumps expose those button actions but do not expose an independent chooser `flyinghelp` display-list placement like `song1/song.swf` does, so the DOM uses the recovered song `flyinghelp` frame-layer fallback with chooser-specific `data-source-control="chooser-helpme-fallback"` provenance until a fuller chooser timeline/display-list parser recovers the actual hover clip.

Rendering full chooser control sprites id `0202` and `0207` as isolated SWFs failed locally because nested button ids `0200` and `0206` were unresolved. A direct isolated render probe for button id `0206` produced only a 1 x 1 `quiter-button-206-trim.png` placeholder. Official Ruffle nevertheless renders both controls correctly in the complete normal chooser frame, so the runtime now uses that captured normal art with transparent source-bounded buttons. The separate shape/text promotions remain evidence for button-state work; exact rollover/down timeline playback is still not claimed.

The chooser help click no longer opens the generic app help modal or the song `courtain` alert fallback inside the source viewport. `nutchooser.swf` has a real `helpframe` at frame 23: the root timeline removes depths `0001` and `0003`, labels the frame `helpframe`, places sprite id `0170` at depth `0001` with matrix scale `1.051`, x `-0.90`, y `39.65`, ratio `22`, and places `noAction` sprite id `0171` at depth `0003` with matrix scale `12.497/9.449`, x `-319.25`, y `-234.35`, ratio `22`. Sprite `0170` animates nested sprite `0169` at scale `0.799`; direct `0169` rendering recovers more talker pixels than direct `0170` rendering, and the translated-wrapper render recovers more than both by avoiding the fixed render-origin clip. The DOM help modal now records root `helpframe` provenance, reuses the recovered `nutchooser-frame-source.png` 600 x 460 frame art, and overlays `chooser-helpframe-talker.png` rendered from sprite `0169` with inverse placement for the wrapper shift. The `nutchooser` text dump does not show visible instructional copy bound to `helpframe`, so the previous visible "Choose a song door." text was moved to screen-reader-only copy rather than kept in the preserved source viewport. Exact frame-by-frame `helpframe` animation remains a display-list renderer gap rather than solved 1:1 playback.

The chooser `quiter` click now follows the recovered `warningFrame` path instead of jumping directly to the modern main menu. The root `warningFrame` places sprite id `0177` at depth `0001` with matrix scale `1.051`, x `-10.05`, y `18.50`, ratio `24`; places `noAction` id `0178` at depth `0003`; places YES button id `0183` at depth `0005`, x `-58.15`, y `-76.55`; places NO button id `0188` at depth `0008`, x `35.30`, y `-76.55`; and places close/transition sprite id `0189` at depth `0011`, x `96.30`, y `-143.70`. Shape id `0179` plus text id `0180` render the visible `YES` button, and shape id `0184` plus text id `0185` render the visible `NO` button. Button id `0183` calls `_level0.gotoAndPlay("comeAgain")`; button id `0188` runs the source cleanup path that calls `stopPreview`, `resumeInst`, `instFrameShow`, restores focus/speakers, and sends `_root.quiter.gotoAndStop("buttonON")`; sprite id `0189` runs the same cleanup and sends the parent clip to `bye`. Because local frame extraction for the full root `warningFrame` did not produce a renderable frame SWF, the DOM composes recovered frame art, `chooser-warningframe-talker.png`, and source YES/NO button layers with source metadata as a documented fallback.

The chooser completion key is not an invented badge. `nutchooser.swf` places a root instance named `magicKey` from sprite id `0213`; child sprite ids `0210` through `0212` animate the nested key artwork, and root action code gates visibility on `_level0.nutDoorsVisited == 8`. A direct isolated render of id `0213` produced a clipped 36 x 61 image because the useful pixels extend into negative source coordinates. Rendering the extracted sprite inside a translated 180 x 180 wrapper with shift x `80`, y `90` produced a full 72 x 113 trim; applying the root placement scale gives the runtime rectangle of approximately left `293`, top `142`, width `46`, height `73`. Exact key animation remains a display-list playback gap, but the visible completion reward art and source visibility condition are now recovered.

## Certificate projector and Key 1 reward evidence

The certificate helpers are Windows Flash projectors rather than ordinary launch stubs. Both `analysis/setup/app/fscommand/n_certificate.exe` and `analysis/setup/app/fscommand/nc_certificate.exe` are PE32 GUI executables with a compressed `CWS` payload appended at byte `860160`. `npm run assets:certificates` uses `app/scripts/lib/flash-projector.mjs` to locate the final structurally valid embedded SWF, bound inflation to its declared body length, reconstruct an `FWS` file, and write ignored actions/text/placement/display-list proof under `app/generated/certificate-projectors/`. The pass locks the recovered projector and SWF hashes plus the expected offset, declared length, certificate sprite placement, print/quit actions, and certificate headings before promoting stripped, reproducible PNG output.

The Nutcracker-specific `nc_certificate.exe` payload is Flash 6, `48991` declared bytes, 15 fps, five frames, and an `18 x 18` movie stage. The tiny stage is deliberate: root instance `nc_certificate`, sprite id `0018`, is rotated/scaled offstage as a print target. Its source background shape has a roughly `550 x 354` certificate surface, and its text includes `THE Nutcracker CLUB`, `MEMBERSHIP AWARD CERTIFICATE`, the achievement sentence naming `THE NUTCRACKER MUSIC GAME`, the name and teacher-signature lines, and `www.NutClub111.com (Members only)`. Frame 1 executes `GetUrl URL:"print:#bmax" Label:"nc_certificate"`; frame 5 executes `FSCommand:quit`.

`npm run assets:certificates` extracts sprite id `0018`, renders its intact inner certificate, and promotes the certificate rectangle as `app/src/assets/nutcracker-source/nutcracker-club-certificate.png`. The larger gray printer backing is deliberately excluded from the promoted crop; the source border, title, award copy, name line, teacher-signature line, and member URL remain source-rendered. The generic `n_certificate.exe` variant uses composition sprite id `0042` and unresolved dynamic text ids `0006` and `0016`; local `swfrender` reports `ID 6 unknown` and `ID 16 unknown` and scatters those red dynamic glyphs. That damaged render remains ignored proof and is not promoted as runtime art.

The modern reward path remains tied to the recovered game condition. Completing all eight songs grants `gameKey1`; only then does an external action outside the preserved `640 x 480` Flash viewport expose `Print / Save PDF` in both development and release shells. The printable DOM contains the promoted source certificate and records the projector, sprite, action, and fallback evidence in `data-source-*` attributes. The old `print:#bmax`/projector-quit sequence cannot execute in the modern webview, so the action calls `window.print()` and print CSS hides the desktop shell and external release action. The host print dialog is the modern printer/PDF-export fallback; this pass does not claim automated proof of a native print dialog or PDF artifact.
