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

* `song-game-render.png`: rendered first frame from `song1/song.swf` with `swfrender`; used as the song-game stage reference.
* `nutchooser-frame-source.png`: PNG asset 31 extracted from `nutchooser.swf`; same ornamental frame family as the earlier `nutchooser-frame.png`.
* `chooser-door.png`: trimmed render of movie clip id 80 (`m#` door sprite) extracted from `nutchooser.swf`; used for chooser door buttons.
* `chooser-hallway.png`: repaired and alpha-composited JPEG3 id 19 from `nutchooser.swf`; used as source-backed chooser hallway art.
* `chooser-instruments.png`: trimmed render of sprite id 68 extracted from `nutchooser.swf`; used as source-backed chooser lower instrument art.
* `chooser-help-button-art.png`: trimmed render of chooser shape id 198 from `nutchooser.swf`; used for the chooser `helpButton` source control because rendering the full button sprite id 202 failed with unresolved nested button id 200 in the local `swfrender`/`swfextract` path.
* `chooser-helpframe-talker.png`: rendered nested chooser helpframe talker sprite id 169 from `nutchooser.swf`; sprite id 170 animates this nested sprite and the root `helpframe` places id 170. Direct `swfrender` clipped the negative-coordinate sprite at the 512 x 512 render origin, so `npm run assets:nutcracker-ui` now extracts id `0169`, wraps it with `swfcombine --stack1 -X 360 -Y 260 -x 150 -y 120`, renders that translated SWF, and promotes the resulting `helpframe-169-wrapped.png`. The wrapped render preserves substantially more visible source art than direct `0169` or parent `0170` rendering, but exact animated `helpframe` playback remains a display-list renderer target.
* `chooser-warningframe-talker.png`: rendered chooser `warningFrame` sprite id 177 from `nutchooser.swf`. Direct `swfrender` clips the negative-coordinate source art at the render origin, so `npm run assets:nutcracker-ui` extracts id `0177`, wraps it with `swfcombine --stack1 -X 360 -Y 220 -x 130 -y 90`, renders the translated wrapper, and promotes `warningframe-177-wrapped.png`.
* `chooser-warning-yes-label.png` and `chooser-warning-no-label.png`: trimmed renders of `nutchooser.swf` warning text ids `0180` (`YES`) and `0185` (`NO`). The root `warningFrame` places button ids `0183` and `0188`; rendering the full button symbols as isolated SWFs fails with unresolved child IDs, so the DOM composes the source text labels with documented fallback button hit areas.
* `song-hint-label.png`: trimmed render of text id 122 from `song1/song.swf`.
* `song-change-song-label.png`: trimmed render of text id 130 from `song1/song.swf`; used for the source `CHANGE SONG` chooser control.
* `song-listen-label.png`: trimmed render of text id 134 from `song1/song.swf`.
* `song-exit-label.png`: trimmed render of text id 145 from `song1/song.swf`.
* `song-stop-label-blue.png` and `song-stop-label-black.png`: trimmed renders of text ids 139 and 141 from `song1/song.swf`; retained as source evidence for playback-state controls.
* `song-play-again-label.png`: trimmed render of text id 111 from `song1/song.swf`; used for the source-backed reset/play-again control after feedback.
* `song-yes-label.png`: trimmed render of text id 345 from `song1/song.swf`; used by the source-backed change-song confirmation.
* `song-no-label.png`: trimmed render of text id 350 from `song1/song.swf`; used by the source-backed change-song confirmation.
* `song-warningframe-talker.png`: rendered song-scene `warningFrame` sprite id 340 from `song1/song.swf`. Direct `swfrender` clips the negative-coordinate source art at the render origin, so `npm run assets:nutcracker-ui` extracts id `0340`, wraps it with `swfcombine --stack1 -X 360 -Y 240 -x 140 -y 80`, renders the translated wrapper, and promotes `song-warningframe-340-wrapped.png`.
* `song-warning-yes-label.png` and `song-warning-no-label.png`: trimmed renders of `song1/song.swf` warning text ids `0345` (`YES`) and `0350` (`NO`). The root `warningFrame` places button ids `0346` and `0351`; the DOM composes these source text labels with documented fallback hit areas.
* `song-speaker.png`: PNG asset 3 extracted from `song1/song.swf`; retained as direct bitmap evidence, but not used as a standalone speaker control because visual inspection shows it is not the clean `spk1`/`spk2` sprite.
* `song-sound-icon.png`: PNG asset 39 extracted from `song1/song.swf`; retained as direct bitmap evidence, but visual inspection shows this is decorative curtain/scallop art rather than a sound-control icon.
* `song-curtain-scallop.png`: correctly named promotion of `song1/song.swf` lossless bitmap id 39. This is the dark blue scallop bitmap used by the `courtain` base sprite id `0042`; the DOM uses it inside hint/check/change-song overlays while the vector panel and dynamic message remain documented fallbacks.
* `song-help-art.png`: PNG asset 73 extracted from `song1/song.swf`.
* `track1-nutcracker.png` through `track8-round-doll.png`: source-identical lossless bitmaps extracted from `song1/characters/anim*.swf`; retained as fallback actor art.
* `song1-track1-actor.png` through `song8-track8-actor.png`: promoted representative lossless bitmaps from each song's own `characters/anim#.swf`; used as visible selected-stage actors in the modern scene.
* `song2-scenery.png`: repaired and alpha-composited JPEG3 id 7 from `song2/song.swf`.
* `song3-scenery-primary.png`: repaired and alpha-composited JPEG3 id 14 from `song3/song.swf`.
* `song3-scenery-secondary.png`: repaired and alpha-composited JPEG3 id 39 from `song3/song.swf`; retained as recovered source evidence, but not rendered in the current frame-1 scene because the display-list placement parser did not find it active on frame 1.
* `song4-scenery.png`: repaired and alpha-composited JPEG3 id 11 from `song4/song.swf`.
* `song5-scenery.png`: repaired and alpha-composited JPEG3 id 12 from `song5/song.swf`.
* `song6-scenery.png`: repaired and alpha-composited JPEG3 id 11 from `song6/song.swf`.
* `song7-scenery.png`: repaired and alpha-composited JPEG3 id 9 from `song7/song.swf`.
* `song8-scenery.png`: repaired and alpha-composited JPEG3 id 4 from `song8/song.swf`.

Generated proof assets remain ignored under `app/generated/nutcracker-source-extract/`.

The broader song-scene PNG extraction pass generated a clean proof inventory under `app/generated/nutcracker-source-extract/all-song-images-clean/`, plus `contact-strip.png`. For `song1` through `song8`, the extractable PNGs are the repeated 449 x 313, 412 x 138, and 600 x 460 assets, although their SWF asset IDs vary by song. Pixel-hash checks show those PNGs are mostly repeated source assets rather than unique per-song scene backgrounds. Song-specific variation appears to live in vector/JPEG/timeline composition.

The JPEG3 recovery is now reproducible with `npm run assets:nutcracker-jpeg3` from `app/`. The script lives at `app/scripts/extract-nutcracker-jpeg3.mjs` and writes proof artifacts to `app/generated/nutcracker-source-extract/direct-image-tags/`.

The broader SWF evidence pass is reproducible with `npm run assets:nutcracker-swf` from `app/`. The script lives at `app/scripts/extract-nutcracker-swf-assets.mjs` and writes:

* direct `DEFINEBITSLOSSLESS2` PNGs from `nutchooser.swf`, `song*/song.swf`, and `song*/characters/anim*.swf`
* placement dumps from `swfdump -b -p`
* ActionScript dumps from `swfdump -a`
* text dumps from `swfdump -t`
* `manifest.json` linking source SWFs, extracted asset IDs, dimensions, and output files

Representative selected-actor assets are promoted from that generated SWF output with `npm run assets:nutcracker-actors`. The script lives at `app/scripts/promote-nutcracker-actor-assets.mjs` and copies one source PNG per `song#/characters/anim#.swf` into `app/src/assets/nutcracker-source/song#-track#-actor.png`.

Reusable source UI assets that are not actor/scenery assets are promoted with `npm run assets:nutcracker-ui`. The script currently promotes the `courtain` scallop bitmap from `song1__song/lossless-39.png` to `app/src/assets/nutcracker-source/song-curtain-scallop.png` so the runtime does not keep relying on the misleading old `song-sound-icon.png` name. It also extracts/renders `nutchooser.swf` sprites `0169`, `0170`, and `0177`, promotes translated-wrapper renders for chooser `helpframe` and `warningFrame` talkers, promotes chooser warning `YES`/`NO` text ids `0180` and `0185`, and promotes the song-scene `warningFrame` sprite id `0340` plus song warning `YES`/`NO` text ids `0345` and `0350`.

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

Each selected actor element now records its corresponding source movie as `data-source-animation="games/nutcrackergame/song#/characters/anim#.swf"`. The browser does not execute those SWFs, so the DOM fallback uses the promoted per-song lossless actor bitmap plus restrained `steps()` CSS transforms. The transform direction and relative size come from the placement dumps under `app/generated/nutcracker-source-extract/full-swf-pass/dumps/`, with targeted overrides where promoted actors have different source shapes.

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

A direct SWF parser was used to combine `DefineShape` bounds, bitmap fills, sprite timelines, and nested `PlaceObject2` matrices for the recovered JPEG3 scenery. The modern CSS uses these global frame-1 rectangles rounded to whole pixels:

* `song2-scenery.png`: bitmap id 7, shape id 8, path `root>18>9>8`, rect `left 159.8314 top 20.7466 right 469.3663 bottom 204.1571`; implemented as `left: 160px; top: 21px; width: 310px; height: 183px`.
* `song3-scenery-primary.png`: bitmap id 14, shape id 15, path `root>43>17>16>15`, rect `left 234.1066 top 41.2409 right 410.7124 bottom 183.0319`; implemented as `left: 234px; top: 41px; width: 177px; height: 142px`.
* `song4-scenery.png`: bitmap id 11, shape id 12, path `root>33>14>13>12`, rect `left 244.9247 top 41.3908 right 389.3497 bottom 176.0600`; implemented as `left: 245px; top: 41px; width: 144px; height: 135px`.
* `song5-scenery.png`: bitmap id 12, shape id 13, path `root>31>15>14>13`, rect `left 137.3983 top 34.8997 right 515.5420 bottom 206.5749`; implemented as `left: 137px; top: 35px; width: 378px; height: 172px`.
* `song6-scenery.png`: bitmap id 11, shape id 12, path `root>41>15>13>12`, rect `left 228.6588 top 35.5335 right 393.9672 bottom 190.1374`; implemented as `left: 229px; top: 36px; width: 165px; height: 155px`.
* `song7-scenery.png`: bitmap id 9, shape id 10, path `root>32>12>11>10`, rect `left 115.0077 top 36.4098 right 585.5344 bottom 230.5284`; implemented as `left: 115px; top: 36px; width: 471px; height: 194px`.
* `song8-scenery.png`: bitmap id 4, shape id 5, path `root>35>7>6>5`, rect `left 84.9492 top 50.2054 right 518.1815 bottom 213.3434`; implemented as `left: 85px; top: 50px; width: 433px; height: 163px`.

The parser recovered `song3-scenery-secondary.png` from JPEG3 id 39, but did not find an active frame-1 placement for that bitmap in the current timeline pass. It remains in the source asset folder as evidence, but the app does not render it as visible song 3 scenery until its timeline usage is proven.

## Song-game behavior evidence

`song1/song.swf` defines `testCombination()` and `showHint()` in its root ActionScript. `testCombination()` computes `_root.instCorrect`, `_root.instNoCorrect`, and `_root.gameSolution`, setting `gameSolution` to `ok` when every selected scene instrument is correct and to `try again` otherwise. `showHint()` calls `testCombination()` and then writes the visible message:

* `you have ` + `instCorrect` + ` correct instruments and ` + `instNoCorrect` + ` incorrect instruments `
* `All songs are played by 4 instruments!`
* `Listen to the original song and find  4 correct instruments. Double click on the instruments or drag them onto the stage.`

`gameSolution` is only ActionScript state in the recovered dumps; no `DEFINEEDITTEXT` field is bound to `_root.gameSolution`. The visible hint/check copy uses `_root.message` inside the `courtain` sprite. `courtain` is placed on the root timeline as sprite id `0063` at depth `0082`, x `319.85`, y `4.90`. In the `giveHint` frame, edit text id `0058` is placed at depth `0007` with matrix scale `0.953/0.843`, x `132.90`, y `96.80`, ratio `14`. The DOM therefore treats HINT and incorrect-check feedback as a source-curtain fallback rather than a normal always-visible page banner. The change-song prompt uses the related `alert` frame, where edit text id `0054` is placed at depth `0012`, x `155.90`, y `97.10`, ratio `4`.

The `courtain` base art is partly recoverable today. `swfextract -i 63 -P` preserves the root placement and confirms the placed sprite, but `swfrender` only renders the first internal/home frame and produces a nearly empty 640 x 480 PNG because this local build cannot seek to the `alert` or `giveHint` internal frames. `swfextract -f 15`/`-f 20` against `song1/song.swf` produced empty/invalid frame SWFs for this target. The app therefore uses the exact extracted `song-curtain-scallop.png` bitmap plus DOM text/buttons as a documented fallback for the source vector panel and dynamic `_root.message` field, not as a final exact curtain renderer.

Instrument button handlers in the SWF also call `_root.testCombination()` after instrument add/remove interactions. The modern implementation mirrors that effective behavior by checking automatically when the fourth instrument is selected, instead of adding an invented visible submit button.

The root timeline places empty/shared movie slots named `inst1` through `inst8`, `anim1` through `anim8`, and `prevTrack1` through `prevTrack8`. Its ActionScript and child button actions reference `doubleClick`, `dragInstrument`, `hitArea.hitTest`, `instOnScene`, `_root.activeInst#`, `addINST`, `removeAnim`, and `testCombination`.

The modern implementation now follows that interaction model more closely: a single click previews the source track stream, while double-clicking an instrument or dragging it onto the stage selects it and renders the source-extracted actor art. Full `anim*.swf` timeline playback remains a fidelity gap to close with a deeper SWF display-list renderer.

Modern selected/correct/incorrect badges, yellow hotspot fills, and red/green actor glows are not source-backed. The SWF communicates selected instruments by loading the corresponding `characters/anim#.swf` into `anim#` slots and communicates hint/check results through `_root.message` in the `courtain` sprite. The DOM therefore keeps selected/correctness state in classes/data/ARIA for behavior and tests, but avoids visible invented badges/glows over the preserved viewport.

The SWF `helpme(a, b)` function sets `_root.helpmessage`, sends `_root.flyinghelp` to frame `a`, starts dragging `_root.flyinghelp`, and makes that help clip visible. `nohelp()` clears `_root.helpmessage`, hides `_root.flyinghelp`, and moves it to x `10000`. The root timeline places `flyinghelp` as sprite id `0257`, depth `0306`, initial matrix x `1143.85`, y `195.55`. Instrument rollovers call `helpme` with source labels including `BASS`, `VIOLIN`, `TRUMPET`, `FLUTE`, `VIBRAPHONE`, `PIANO`, `DRUM`, `SAXOPHONE`, `MARIMBA`, `OBOE`, and `TIMPANI`; rollouts call `nohelp()`. Song 1 instrument calls mostly use `helpme(2, label)`, while `SAXOPHONE` uses `helpme(3, "SAXOPHONE")`. Song controls use `helpme(4, ...)` for `Hint`, `Select a\ndifferent\nsong`, `Listen to the Original Music`, and `Stop the Music`, while `Quit the Game` uses frame 3. The DOM mirrors that with one source-provenance `.source-flying-help` element driven by pointer/focus state, carrying `data-source-frame` and `data-source-bounds` from the recovered frame calls instead of rendering separate static tooltip boxes. Song 7 track 2 uses the source-specific `VIOLIN (PIZZICATO)` label found in `song7__song.actions.txt`. `English Horn` is retained as an uppercase trackinfo-derived fallback because no matching source help string was found in the current song 3 dumps.

`flyinghelp` frames 2 and 3 are layered `_root.helpmessage` edit-text stacks: ids `0231`-`0233` for frame 2 and ids `0234`-`0236` for frame 3, each with source bbox roughly `228 x 18` at scale `1.2`, or about `276 x 22` in DOM pixels. Frame 4 places sprite id `0240` at x `80.00`, y `37.20`; frames 5 through 8 introduce shape ids `0241`, `0244`, `0246`, `0251`, and `0252`. Extracting those individual shapes with `swfextract -i` and rendering with the local `swfrender` produced blank/near-blank 640 x 480 PNGs because their source geometry sits at or above the sprite origin and this renderer does not compose the internal frame state usefully. The DOM therefore uses source dimensions, frame numbers, colors, and text-shadow layering as a documented fallback for `flyinghelp`, not a generic blue tooltip box.

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

The DOM song controls now use the source instance names and placement records from `song1__song.placements.txt` instead of a generic bottom-right action strip:

* `helpButton`: id 120 at depth 122, matrix x `556.50`, y `165.30`; contains the original `HINT` text and calls `showHint()` in ActionScript. The DOM HINT button maps to `data-song-action="hint-song"` so incomplete selections show the original four-instrument hint, while complete selections run the check path.
* `hintButton`: id 127 at depth 127, matrix x `556.35`, y `267.95`; contains the original two-line `CHANGE SONG` text, backed by rendered text id `130`, and prompts the song-change flow. Its ActionScript sets `_root.message` to `press "Yes" to change this song or "No" to cancel` and sends `_root.courtain` to frame label `alert`. The DOM now mirrors that with an in-viewport confirmation instead of jumping directly to the chooser.
* `YES` / `NO`: warning-frame text ids `345` and `350` are rendered as `song-yes-label.png` and `song-no-label.png` for the change-song alert, and separately promoted as `song-warning-yes-label.png` / `song-warning-no-label.png` for the song-exit warning. Warning-frame placement records put YES button id `0346` and NO button id `0351` into the warning flow.
* `songChooser`: id 133 at depth 133, matrix x `84.10`, y `163.70`; contains the original `LISTEN` text and calls the source preview-song path. The DOM maps it to the theme listen/stop behavior.
* `listenSong`: id 144 at depth 138, matrix x `81.75`, y `266.30`; contains the original `EXIT` text. Its ActionScript stops previews/instruments, sends `_root.quiter` to `buttonOFF`, sets `_root.theNextFrame = "warningFrame"`, and drives `_root.usmus` to `warningFrame` / `showUp`. The DOM now maps it to the source-backed song warning instead of jumping directly to the chooser.
* `gameController`: sprite id `0115`, depth `0116`, matrix scale `1.140`, x `322.20`, y `317.70`; its `buttonAgain` frame places button id `0114` at x `-0.90`, y `1.75`, ratio `3`. The winner timeline sends `_root.gameController` to `buttonAgain` after a correct solve, so the DOM reset/play-again control is positioned from this source placement rather than the earlier guessed top-stage position.
* `quiter`: id 150 at depth 145, matrix x `585.90`, y `472.45`; retained as source evidence for the Flash quit transition, but not rendered as a separate DOM control because the fixed viewport already uses the visible source `EXIT`/`CHANGE SONG` controls.

The same source controls also call `helpme`/`nohelp` on hover. The recovered control hover strings are `Hint`, `Select a\ndifferent\nsong`, `Listen to the Original Music`, `Stop the Music`, and `Quit the Game`; the DOM routes them through the shared `.source-flying-help` element instead of per-button tooltip spans.

The song-scene `listenSong` release follows the recovered `warningFrame` path. The root `warningFrame` places sprite id `0340` at depth `0001` with matrix scale `1.051`, x `-15.45`, y `52.40`, ratio `29`; places `noAction` id `0341` at depth `0003`; places YES button id `0346` at depth `0005`, x `-66.15`, y `-43.55`; places NO button id `0351` at depth `0008`, x `27.30`, y `-43.55`; and places close/transition sprite id `0352` at depth `0011`, x `96.30`, y `-143.70`. Text ids `0345` and `0350` render visible `YES` and `NO` labels. Button id `0346` calls `_level0.gotoAndPlay("comeAgain")`; button id `0351` runs the source cleanup path that calls `stopPreview`, `resumeInst`, `instFrameShow`, restores speakers/focus/quiter state, and leaves the song scene active. Because local frame extraction for the full root `warningFrame` is still not a full display-list renderer, the DOM composes `song-warningframe-talker.png` and source YES/NO labels with source metadata as a documented fallback rather than adding invented warning text.

The old generic song-page HINT/EXIT wrapper is no longer rendered over song scenes. The generic beige help modal is also replaced for song scenes by the recovered `song-help-art.png` frame when scene help is opened.

## Track preview timing evidence

The extracted `track*.mp3` streams are full-length synchronized song tracks. They often contain leading silence before the selected instrument enters. `trackinfo.txt` has `firstFrame#` values, but those frame values are not reliable as audio-preview seek points across all songs: for example, song 8 track 2 has `firstFrame2=559` while the extracted audio is already audible near the start.

The modern preview interaction therefore keeps `firstFrame` as recovered metadata, but uses `ffmpeg silencedetect` against the extracted MP3s for the audible preview seek point. This directly addresses the slow-feeling song 1 track 5 and track 8 previews:

* `song1/track5.mp3`: first audible sample detected around `10.9s`.
* `song1/track8.mp3`: first audible sample detected around `19.3s`.
* `song8/track2.mp3`: first audible sample detected around `0.6s`, despite `firstFrame2=559`.

Main instrument hotspots now start the extracted track preview directly; the earlier separate HTML play icons were removed because they were invented viewport UI and the SWF source uses the instrument interaction itself.

## Chooser button placement evidence

`nutchooser.swf` sets the movie background to white and places source scene assets with these records:

* Background/composition sprite `id 0021`: depth `0001`, matrix scale `0.743`, x `87.85`, y `46.15`; this sprite contains the JPEG3 id `0019` background art and vector/color-shape composition. Extracting/rendering this sprite directly still fails locally with `No JPEG library compiled in`, so the DOM uses recovered `chooser-hallway.png` at the source matrix as a documented fallback.
* Frame sprite `id 0034`: final depth `0055`, matrix scale `1.055`, x `5.55`, y `-3.85`, ratio `5`; the DOM places `nutchooser-frame-source.png` with that matrix instead of the earlier centered/faded approximation.
* Instrument sprite `id 0068`: final depth `0069`, matrix scale `1.000`, x `46.55`, y `285.85`, ratio `5`, color transform add `-209 -153 134 -223`; the DOM places `chooser-instruments.png` at that matrix. The color transform is documented as an approximation gap until the extraction pipeline applies SWF CXForms to promoted sprite renders.

`nutchooser.swf` places the shared door movie clip id 80 as instances `m1` through `m8`. The modern implementation uses these placement records as the basis for door hotspot positions:

* `m1`: matrix scale 1.077, x -20.25, y -5.55.
* `m2`: matrix scale -1.077, x 658.65, y -6.40.
* `m3`: matrix scale 0.674, x 104.20, y 70.95.
* `m4`: matrix scale -0.673, x 532.85, y 70.95.
* `m5`: matrix scale 0.437, x 184.90, y 114.05.
* `m6`: matrix scale -0.436, x 446.55, y 112.95.
* `m7`: matrix scale 0.293, x 237.55, y 135.60.
* `m8`: matrix scale -0.293, x 397.90, y 136.70.

The chooser DOM now records those original placements in `data-source-placement` on each door card. Modern `Ready`, `Locked`, and `Cleared` state text is intentionally not visible in the 640 x 480 source viewport because the recovered Flash scene shows the door movie clips, not a modern status label overlay. The state remains available as `data-door-state` and `aria-label` for accessibility and automated checks.

The chooser also has its own source controls, not just the song-scene labels:

* `helpButton`: sprite id `0202`, depth `0168`, matrix scale `1.350`, x `556.50`, y `165.30`, ratio `5`; its ActionScript hover string is `Help` and its release path sets `_root.theNextFrame` to `helpFrame`.
* `quiter`: sprite id `0207`, depth `0173`, matrix scale `0.900`, x `585.90`, y `472.45`, ratio `5`; its ActionScript hover string is `Quit the Game` and its release path sets `_root.theNextFrame` to `warningFrame`.

Rendering full chooser control sprites id `0202` and `0207` as isolated SWFs failed locally because nested button ids `0200` and `0206` were unresolved. Text id `0203` renders pixel-identically to the already committed `song-exit-label.png`, so the chooser reuses that source-identical label for `quiter` while recording the chooser-specific placement/control provenance in the DOM.

The chooser help click no longer opens the generic app help modal or the song `courtain` alert fallback inside the source viewport. `nutchooser.swf` has a real `helpframe` at frame 23: the root timeline removes depths `0001` and `0003`, labels the frame `helpframe`, places sprite id `0170` at depth `0001` with matrix scale `1.051`, x `-0.90`, y `39.65`, ratio `22`, and places `noAction` sprite id `0171` at depth `0003` with matrix scale `12.497/9.449`, x `-319.25`, y `-234.35`, ratio `22`. Sprite `0170` animates nested sprite `0169` at scale `0.799`; direct `0169` rendering recovers more talker pixels than direct `0170` rendering, and the translated-wrapper render recovers more than both by avoiding the fixed render-origin clip. The DOM help modal now records root `helpframe` provenance, reuses the recovered `nutchooser-frame-source.png` 600 x 460 frame art, and overlays `chooser-helpframe-talker.png` rendered from sprite `0169` with inverse placement for the wrapper shift. The `nutchooser` text dump does not show visible instructional copy bound to `helpframe`, so the previous visible "Choose a song door." text was moved to screen-reader-only copy rather than kept in the preserved source viewport. Exact frame-by-frame `helpframe` animation remains a display-list renderer gap rather than solved 1:1 playback.

The chooser `quiter` click now follows the recovered `warningFrame` path instead of jumping directly to the modern main menu. The root `warningFrame` places sprite id `0177` at depth `0001` with matrix scale `1.051`, x `-10.05`, y `18.50`, ratio `24`; places `noAction` id `0178` at depth `0003`; places YES button id `0183` at depth `0005`, x `-58.15`, y `-76.55`; places NO button id `0188` at depth `0008`, x `35.30`, y `-76.55`; and places close/transition sprite id `0189` at depth `0011`, x `96.30`, y `-143.70`. Text ids `0180` and `0185` render visible `YES` and `NO` labels. Button id `0183` calls `_level0.gotoAndPlay("comeAgain")`; button id `0188` runs the source cleanup path that calls `stopPreview`, `resumeInst`, `instFrameShow`, restores focus/speakers, and sends `_root.quiter.gotoAndStop("buttonON")`; sprite id `0189` runs the same cleanup and sends the parent clip to `bye`. Because local frame extraction for the full root `warningFrame` did not produce a renderable frame SWF, the DOM composes recovered frame art, `chooser-warningframe-talker.png`, and source YES/NO labels with source metadata as a documented fallback.
