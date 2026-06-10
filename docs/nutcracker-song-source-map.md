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
* `song-hint-label.png`: trimmed render of text id 122 from `song1/song.swf`.
* `song-change-song-label.png`: trimmed render of text id 130 from `song1/song.swf`; used for the source `CHANGE SONG` chooser control.
* `song-listen-label.png`: trimmed render of text id 134 from `song1/song.swf`.
* `song-exit-label.png`: trimmed render of text id 145 from `song1/song.swf`.
* `song-stop-label-blue.png` and `song-stop-label-black.png`: trimmed renders of text ids 139 and 141 from `song1/song.swf`; retained as source evidence for playback-state controls.
* `song-play-again-label.png`: trimmed render of text id 111 from `song1/song.swf`; used for the source-backed reset/play-again control after feedback.
* `song-yes-label.png`: trimmed render of text id 345 from `song1/song.swf`; used by the source-backed change-song confirmation.
* `song-no-label.png`: trimmed render of text id 350 from `song1/song.swf`; used by the source-backed change-song confirmation.
* `song-speaker.png`: PNG asset 3 extracted from `song1/song.swf`.
* `song-sound-icon.png`: PNG asset 39 extracted from `song1/song.swf`.
* `song-help-art.png`: PNG asset 73 extracted from `song1/song.swf`.
* `track1-nutcracker.png` through `track8-round-doll.png`: source-identical lossless bitmaps extracted from `song1/characters/anim*.swf`; used as visible selected-stage actors in the modern scene.
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

## Current renderer limits

The installed `swfrender` can render `song1/song.swf`, but `nutchooser.swf` and `song2` through `song8` fail with `No JPEG library compiled in`. `ffmpeg` can decode an embedded 449 x 313 alpha image from the song SWFs, but it is not the full 640 x 480 stage composite and is not used as a scene background.

`swfextract` can list the JPEG IDs in `nutchooser.swf` and `song2` through `song8`, but this local build also fails to extract those JPEGs with `jpeg_load_from_mem: No JPEG support compiled in`. To avoid losing those source assets, the current extraction pass parses SWF tags directly:

* `DefineBitsJPEG3` tag 35 is read from the uncompressed SWF body.
* The SWF JPEG marker quirk is repaired by removing the stray `FFD9 FFD8` pair from the JPEG data.
* The compressed alpha stream is inflated and applied as image opacity.
* The repaired transparent PNGs are copied into `app/src/assets/nutcracker-source/`.

Because `swfrender` still cannot render full song 2-8 composites, the current implementation uses the source-rendered song 1 stage as the shared song-game scene reference, overlays recovered song-specific JPEG3 scenery where frame-1 display-list placement can be recovered, and places modern HTML hotspots at positions derived from the visible source render and `nutchooser.swf` placement data.

The full `characters/anim*.swf` timelines are not yet played in the DOM. Instead, selected instruments render the source-extracted character/instrument lossless bitmap for that track on the stage and apply a small CSS motion pass derived from the SWF placement dumps. This is closer to the original than invisible-only or static selection state, but it is still a documented fallback for the real Flash behavior, which loads each `anim#.swf` into the corresponding `anim#` movie slot and plays timeline animation.

## Character animation fallback evidence

Each selected actor element now records its corresponding source movie as `data-source-animation="games/nutcrackergame/song#/characters/anim#.swf"`. The browser does not execute those SWFs, so the DOM fallback uses the extracted lossless actor bitmap plus restrained `steps()` CSS transforms. The transform direction and relative size come from the song 1 placement dumps under `app/generated/nutcracker-source-extract/full-swf-pass/dumps/`.

The measured `PLACEOBJECT2 moves object` ranges in `song1__characters__anim*.placements.txt` show repeated timeline movement rather than static actors:

* `anim1`: multiple depths move across roughly `510-648px` x and `64-189px` y, so the DOM Nutcracker uses a broad but bounded side-to-side walk/bob.
* `anim2`: the main moving depths cover roughly `318-446px` x and `37-46px` y, so the mouse uses a flatter scurry.
* `anim3`: the train depths cover roughly `803-813px` x and `40-41px` y, so the train uses mostly horizontal translation.
* `anim4`: elephant depths cover roughly `480-514px` x and `42-48px` y, so the elephant uses a slow lateral sway.
* `anim5`: dancer depths cover roughly `331-603px` x and `19-76px` y, so the dancer uses lateral motion with a stronger vertical lift.
* `anim6`: horseman depths cover roughly `496-577px` x and `53-106px` y, so the horseman uses a gallop-like x/y bob.
* `anim7`: cannon depths move only about `12-23px` x and under `1px` y, so the cannon uses a short recoil.
* `anim8`: round-doll depths cover roughly `670px` x and `22-27px` y, so the doll uses mostly horizontal gliding.

Frame-specific SWF rendering was tested as a possible route to exact spritesheets, but this local `swfrender` build does not expose a frame option, and rendering frame-extracted character SWFs can crash on later frames. Until a more robust SWF timeline renderer is added, the CSS motion is the source-documented fallback rather than exact playback.

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

Instrument button handlers in the SWF also call `_root.testCombination()` after instrument add/remove interactions. The modern implementation mirrors that effective behavior by checking automatically when the fourth instrument is selected, instead of adding an invented visible submit button.

The root timeline places empty/shared movie slots named `inst1` through `inst8`, `anim1` through `anim8`, and `prevTrack1` through `prevTrack8`. Its ActionScript and child button actions reference `doubleClick`, `dragInstrument`, `hitArea.hitTest`, `instOnScene`, `_root.activeInst#`, `addINST`, `removeAnim`, and `testCombination`.

The modern implementation now follows that interaction model more closely: a single click previews the source track stream, while double-clicking an instrument or dragging it onto the stage selects it and renders the source-extracted actor art. Full `anim*.swf` timeline playback remains a fidelity gap to close with a deeper SWF display-list renderer.

The SWF `helpme(a, b)` function sets `_root.helpmessage`, starts dragging `_root.flyinghelp`, and makes that help clip visible. Instrument rollovers call `helpme` with source labels including `BASS`, `VIOLIN`, `TRUMPET`, `FLUTE`, `VIBRAPHONE`, `PIANO`, `DRUM`, `SAXOPHONE`, `MARIMBA`, `OBOE`, and `TIMPANI`; rollouts call `nohelp()`. The DOM now mirrors that visible hover/focus behavior with a source-styled transient help tag on each instrument hotspot. Song 7 track 2 uses the source-specific `VIOLIN (PIZZICATO)` label found in `song7__song.actions.txt`. `English Horn` is retained as an uppercase trackinfo-derived fallback because no matching source help string was found in the current song 3 dumps.

## Source song control placement evidence

The DOM song controls now use the source instance names and placement records from `song1__song.placements.txt` instead of a generic bottom-right action strip:

* `helpButton`: id 120 at depth 122, matrix x `556.50`, y `165.30`; contains the original `HINT` text and calls `showHint()` in ActionScript. The DOM HINT button maps to `data-song-action="hint-song"` so incomplete selections show the original four-instrument hint, while complete selections run the check path.
* `hintButton`: id 127 at depth 127, matrix x `556.35`, y `267.95`; contains the original two-line `CHANGE SONG` text, backed by rendered text id `130`, and prompts the song-change flow. Its ActionScript sets `_root.message` to `press "Yes" to change this song or "No" to cancel` and sends `_root.courtain` to frame label `alert`. The DOM now mirrors that with an in-viewport confirmation instead of jumping directly to the chooser.
* `YES` / `NO`: warning-frame text ids `345` and `350` are rendered as `song-yes-label.png` and `song-no-label.png`; warning-frame placement records put YES button id `0346` and NO button id `0351` into the alert flow.
* `songChooser`: id 133 at depth 133, matrix x `84.10`, y `163.70`; contains the original `LISTEN` text and calls the source preview-song path. The DOM maps it to the theme listen/stop behavior.
* `listenSong`: id 144 at depth 138, matrix x `81.75`, y `266.30`; contains the original `EXIT` text. The DOM maps it back to the chooser.
* `quiter`: id 150 at depth 145, matrix x `585.90`, y `472.45`; retained as source evidence for the Flash quit transition, but not rendered as a separate DOM control because the fixed viewport already uses the visible source `EXIT`/`CHANGE SONG` controls.

The same source controls also call `helpme`/`nohelp` on hover. The DOM now exposes those source help strings as transient source-styled help tags: `Hint`, `Select a different song`, and `Quit the Game`. `listenSong` release also routes the SWF through `warningFrame`, but its handler does not set `_root.message`; the DOM therefore keeps the existing chooser return until the static warning-frame wording can be recovered without guessing.

The old generic song-page HINT/EXIT wrapper is no longer rendered over song scenes. The generic beige help modal is also replaced for song scenes by the recovered `song-help-art.png` frame when scene help is opened.

## Track preview timing evidence

The extracted `track*.mp3` streams are full-length synchronized song tracks. They often contain leading silence before the selected instrument enters. `trackinfo.txt` has `firstFrame#` values, but those frame values are not reliable as audio-preview seek points across all songs: for example, song 8 track 2 has `firstFrame2=559` while the extracted audio is already audible near the start.

The modern preview interaction therefore keeps `firstFrame` as recovered metadata, but uses `ffmpeg silencedetect` against the extracted MP3s for the audible preview seek point. This directly addresses the slow-feeling song 1 track 5 and track 8 previews:

* `song1/track5.mp3`: first audible sample detected around `10.9s`.
* `song1/track8.mp3`: first audible sample detected around `19.3s`.
* `song8/track2.mp3`: first audible sample detected around `0.6s`, despite `firstFrame2=559`.

Main instrument hotspots now start the extracted track preview directly; the earlier separate HTML play icons were removed because they were invented viewport UI and the SWF source uses the instrument interaction itself.

## Chooser button placement evidence

`nutchooser.swf` places the shared door movie clip id 80 as instances `m1` through `m8`. The modern implementation uses these placement records as the basis for door hotspot positions:

* `m1`: matrix scale 1.077, x -20.25, y -5.55.
* `m2`: matrix scale -1.077, x 658.65, y -6.40.
* `m3`: matrix scale 0.674, x 104.20, y 70.95.
* `m4`: matrix scale -0.673, x 532.85, y 70.95.
* `m5`: matrix scale 0.437, x 184.90, y 114.05.
* `m6`: matrix scale -0.436, x 446.55, y 112.95.
* `m7`: matrix scale 0.293, x 237.55, y 135.60.
* `m8`: matrix scale -0.293, x 397.90, y 136.70.
