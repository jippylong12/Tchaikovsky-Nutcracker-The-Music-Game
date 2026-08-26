# M08 Mini-Game Source Map

This map is the source-of-truth record for the M08 recreation pass. The runtime inputs are the recovered Flash files under `analysis/setup/app/games/`; `app/scripts/extract-m08-source-assets.mjs` verifies their SHA-256 hashes before writing ignored evidence under `app/generated/m08-source-extract/` and promoted runtime files under `app/src/assets/m08-source/`.

Run `npm run assets:m08` from `app/`. A valid pass reports 34 SWFs, 112 source images, 3 extracted root streams, 205 extracted `DefineSound` files, and 77 runtime companion files. The extractor excludes backup files and alternate Children's Album WAV copies while retaining the source MP3s and Waltz WAV. It preflights every required source/companion and all 34 locked SWF hashes before removing only its owned generated and promoted M08 roots for the rebuild.

## Source inventory

| Family | Authoritative source | Stage | Timeline | Runtime route |
| --- | --- | --- | --- | --- |
| Children's Album | `games/childrensalbum/childrensalbum.swf`, `games/data/childrensalbum.txt`, `games/data/childrensdoors.txt`, `preview/`, `song1/` … `song8/` | 640 x 480 | 7 frames at 15 fps | `childrens-album` |
| Loopy Tunes | `games/loopytunes/loopChooser.swf`, `loop1.swf` … `loop8.swf` | chooser 550 x 400; games 640 x 480 | chooser 1 frame at 12 fps; games 3 frames at 15 fps | `loopy-tunes` |
| Orchestra | `games/orchestragame/orchestra.swf` | 640 x 480 | 2,095 frames at 15 fps | `orchestra` |
| Toy Soldiers | `games/toysoldiersgame/toysoldiersgame.swf` | 640 x 480 | 1 frame at 12 fps | `toy-soldiers` |
| Waltz | `games/wedding/waltz.swf`, `games/wedding/MP3Wedding3.wav` | 550 x 400 | 785 frames at 12 fps, about 65.4 seconds | `waltz` |
| Alice | `games/aliceSWF/alice.swf`, `game_01.swf` … `game_12.swf` | 800 x 600 | chooser 641 frames at 15 fps; games 1 frame at 15 fps | `alice-puzzles` |
| Nut House | `games/nuthouse/room11.swf` … `room18.swf`, `games/data/nuthouserooms.txt` | 640 x 480 | 32-43 frames at 15 fps | `nut-house` |

The manifest locks every individual SWF hash. Alice puzzle files form four byte-identical source groups: 01-03, 04-06, 07-09, and 10-12. Runtime assets retain puzzle-local names even when their source hashes are identical so provenance is not obscured.

## Recovered behavior

### Children's Album

The data file contains eight exact bit patterns, in source order: `10100110`, `11001001`, `10010110`, `00101011`, `11000101`, `00111010`, `11000110`, and `01011100`. The runtime titles are the reverse of the source ActionScript title array: NEAPOLITAN SONG, MAZURKA, POLKA, GERMAN SONG, FRENCH SONG, ITALIAN SONG, RUSSIAN SONG, and WALTZ.

Each song exposes eight instruments and requires the four indices whose bit is `1`. The source interaction selects or drops instruments, previews the song, checks the set, calls `saveCADoorN.exe`, and grants `gameKey6` after all eight children's doors are saved. The modern runtime maps those effects to `progress.markChildrensDoor(N)` and `progress.markGameKey(6)`.

### Loopy Tunes

All eight loop games set `totalLoops=8` and `goodLoops=4`. Each source game assigns `myTrack1=1`, `myTrack2=0`, `myTrack3=1`, `myTrack4=0`, `myTrack5=1`, `myTrack6=0`, `myTrack7=1`, and `myTrack8=0`; the exact correct set is therefore tracks 1, 3, 5, and 7 for every tune. Completing loop 8 calls the source `gameKey3` path. This overlaps the Flying Instruments key in the recovered program and is preserved rather than renumbered.

The `EXPORTASSETS` table does not number audio by the visible track. Every loop SWF exports DefineSound id 1 as `all`, ids 2 through 9 as `loop8` through `loop1`, and id 10 as `loop0`. Therefore visible tracks 1 through 8 map to raw sound ids `[9,8,7,6,5,4,3,2]`; `loopyTrackSoundId()` owns that translation.

### Orchestra

The source sets `maxInst=18` and presents one sound at a time. The exact semantic `inst1` through `inst18` label/sound order is OBOE, BASSOON, SAXOPHONE, HARP, PIANO, VIBRAPHONE, CYMBALS, TIMPANI, BASS, CELLO, VIOLIN, VIOLA, TRUMPET, TROMBONE, TUBA, FRENCH HORN, CLARINET, and FLUTE. Pressing the source melody chooser runs `RandomNumber(maxInst) + 1`; its `trigger` clip scans forward, wrapping from 18 to 1, until it reaches a still-visible/uncompleted instrument. The remake preserves that random-start/forward-scan rule and allows replaying the selected prompt until it is answered.

The raw DefineSound ids are not semantic instrument numbers. The source attaches exports `s1` through `s18` to `inst1` through `inst18`; their raw id map is `[17,11,14,19,8,13,9,3,15,7,16,18,1,2,5,6,12,4]`. Export `badInst` is id 10. DefineSound id 838 is started by the source win timeline. Each instrument counts once; `goodInst == 18` grants `gameKey4`.

### Toy Soldiers

The source creates draggable instances `soldier_0` through `soldier_7`, constrains them between `top_y=85` and `bottom_y=300`, and builds `y_coords[i] = 300 - (21.5 * i)` for 11 pitch positions. Snapping the eight authored root y placements yields the exact initial slots `[7,4,1,8,5,2,8,10]`; the authored x positions are `[126.80,178.95,239.85,287.85,341.80,398.80,443.80,491.30]`. The constructor bytecode gives the exact `correct_note` order `[1,2,3,4,5,6,7,8]`.

The root board is also recoverable below the failed button layer. Shape id `0020` is the green 509 x 272 field placed around x `17.50`, y `55.50`; sprite id `0023` moves cyan shape id `0021` across that field for 20 frames at 12 fps; shape id `0024` supplies the five staff lines; shapes `0025` and `0027` are the purple correct and red wrong flashes. Button id `0030` does not flatten locally, but `swfdump -u` proves it uses only source shape id `0029`, the blue 42 x 42 soldier circle. The deterministic extractor renders and promotes those child shapes, plus the `Play Music` button body/text ids `0032`/`0034` and `CORRECT!!!!` text id `0037`. The final label is nested at x `-197.00`, y `-23.50` inside sprite id `0038`, which is placed at x `-1.95`, y `-146.50` inside the root `march` placement at x `276.45`, y `183.50`; the runtime therefore places the trimmed label around root x `79`, y `14` rather than at the `march` origin. The runtime composes those assets at the source coordinates instead of retaining the prior beige board, knight glyphs, title, instructions, or `CHECK MARCH` label.

Source pitch numbers 0 through 10 map to DefineSound ids `[13,1,3,5,7,9,11,13,15,3,5]`. On source soldier release, button id `0030` snaps the dragged soldier, stops current sounds, and starts the `march` sprite. That sprite checks the current soldiers from index 0 through 7 at one-second intervals, shows the source correct/wrong flash at each soldier, and shows source text id `0037` only when every position equals the recovered correct order. The separate source `Play Music` control starts `play_correct`, which plays `correct_note[0..7]` at the same one-second cadence without running the current-position check. The keyboard fallback advances each soldier through all 11 slots and launches the recovered march; starting either playback cancels any prior Toy Soldiers timers/audio, while navigation, reset, and scene-audio stop cancel the active pass. No game-key or save action was recovered, so the remake does not invent one. Exact pointer-drag replay and the root `usmus` help/exit timeline remain documented display-list fallbacks.

### Waltz

The Waltz is a 785-frame source timeline with an embedded stream and bundled `MP3Wedding3.wav`. The recovered actions contain Flash component internals but no gameplay loop, win condition, saved progress, or named root game controls. The source timeline and sound stream begin immediately, so route entry now plays the bundled WAV once; there is no invented title, status copy, or play/stop control in the preserved viewport. The only successful root rendering is an incomplete 550 x 400 gray gradient, promoted as `waltz-source-gradient.png` and centered at its natural source size on black. It remains classified as a limited source-derived surface rather than full visual parity.

### Alice puzzles

The chooser loads `games/aliceSWF/game_XX.swf`, exposes a clock/gear selector for 12 games, stores three toy values, and calls `checkSolution`. Every recovered `gameCombination1` through `gameCombination12` array equals `[1,1,1]`. Puzzles 01-06 contain meadow source backgrounds, 07-09 contain object art, and 10-12 contain storm imagery. No game-key action was recovered; Alice stays a supplementary puzzle family.

### Nut House

Rooms 11-18 each set `maxMir=8`. Their exact correct mirror sequence is `[8,3,1,7,6,4,5,2]`. A correct choice loads the next room, and room 18 grants `gameKey7`. The original `openDoor` value in `nuthouserooms.txt` is mapped to `progress.setNutHouseOpenDoor(room - 10)`.

Each mirror's source rollover/focus action calls `checkMirror(N)` and previews semantic export `sN`; the correct mirror instead previews `goodGuess`. Release stops the preview and plays `badGuess` for a wrong mirror or `youWin` for the correct mirror. The exported raw ids are:

| Room | Mirror 1..8 preview ids | `badGuess` | `youWin` |
| --- | --- | --- | --- |
| 11 | `9,8,7,6,5,4,3,2` | 10 | 1 |
| 12-18 | `10,9,8,7,5,2,1,4` | 6 | 3 |

The semantic export attached to the correct mirror changes by room even where the raw id sequence is repeated. Runtime pointer entry and keyboard focus use the preview map; activation uses the room-local feedback ids rather than assuming mirror number equals sound id.

## Asset promotion and renderer boundaries

The deterministic pass extracts every top-level JPEG3 and lossless bitmap, all recoverable root streams, and every `DefineSound`. It also copies the Children's Album previews/instrument clips, the Waltz WAV, and the three original progress/data files. Correctly named source-local aliases are promoted for each family; raw per-source assets remain under `app/src/assets/m08-source/images/` as provenance. The application import glob intentionally includes only the semantic top-level image aliases and audio paths used by these routes, so the raw provenance images and unused source streams do not inflate the packaged runtime.

Full root probes are not reliable with the installed SWFTools build:

- Children's Album and Orchestra terminate with `SIGSEGV` after unresolved JPEG/display-list children.
- Each Loopy board terminates with `SIGSEGV`.
- Alice puzzle boards terminate with `SIGSEGV`; the chooser's successful output contains only an incomplete pale ring.
- Nut House rooms terminate with `SIGSEGV`.
- Toy Soldiers exits successfully and exposes the green field, the first frame of the cyan moving shape, staff lines, and feedback flashes, but it omits the button-backed soldiers and controls; isolated sprite id `0031` renders transparent because button id `0030` is unresolved even though child shape id `0029` is recoverable.
- Waltz exits successfully but only exposes a gray gradient.

These results do not authorize generic invented scenes. Runtime routes compose recoverable child assets, exact text/action data, and source audio, with `data-source-fallback` metadata on each remaining DOM interaction. Several frame/stage children are black alpha/color-transform inputs in the source display list; retaining them is provenance evidence, but exact nested CXForms and full timeline motion remain an open visual-approval gap.

The stream inventory has another repeatable tool limitation: `swfextract` can advertise `MP3 Soundstream` for a non-MP3/ADPCM stream, after which `swfextract -m` reports `Soundstream is not mp3 (2)` or `Didn't find a soundstream`. The extractor records that source as `blocked` and continues to extract standalone `DefineSound` records. Never claim an extracted root MP3 unless the target file exists and its hash is in the manifest.

## Validation and approval

Automated acceptance requires two byte-identical `npm run assets:m08` passes plus typecheck, full tests, lint, build, source-atlas validation, and the four mandatory Nutcracker extraction gates. Automated evidence does not approve the reconstructed UI or gameplay. JIP-840, JIP-845, and JIP-850 remain open for Marcus's manual review.
