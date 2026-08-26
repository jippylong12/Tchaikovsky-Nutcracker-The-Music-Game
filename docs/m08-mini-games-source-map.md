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

The source creates draggable instances `soldier_0` through `soldier_7`, constrains them between `top_y=85` and `bottom_y=300`, and snaps to 11 pitch positions. The constructor bytecode gives the exact `correct_note` order `[1,2,3,4,5,6,7,8]`. Checking plays correct/wrong feedback and then the march. No game-key or save action was recovered, so the remake does not invent one. Button id 30 cannot be flattened because one child id is unresolved; the runtime's staff and keyboard-operable soldier positions are a documented interaction fallback driven by the eight recovered note sounds.

### Waltz

The Waltz is a 785-frame source timeline with an embedded stream and bundled `MP3Wedding3.wav`. The recovered actions contain Flash component internals but no gameplay loop, win condition, saved progress, or named root game controls. The runtime therefore provides the exact bundled music and timeline facts without inventing a game. The only successful root rendering is an incomplete gray gradient, so it is classified as a limited source-derived surface rather than full visual parity.

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
- Toy Soldiers exits successfully but only exposes staff primitives because button id 30 has an unknown child.
- Waltz exits successfully but only exposes a gray gradient.

These results do not authorize generic invented scenes. Runtime routes compose recoverable child assets, exact text/action data, and source audio, with `data-source-fallback` metadata on each remaining DOM interaction. Several frame/stage children are black alpha/color-transform inputs in the source display list; retaining them is provenance evidence, but exact nested CXForms and full timeline motion remain an open visual-approval gap.

The stream inventory has another repeatable tool limitation: `swfextract` can advertise `MP3 Soundstream` for a non-MP3/ADPCM stream, after which `swfextract -m` reports `Soundstream is not mp3 (2)` or `Didn't find a soundstream`. The extractor records that source as `blocked` and continues to extract standalone `DefineSound` records. Never claim an extracted root MP3 unless the target file exists and its hash is in the manifest.

## Validation and approval

Automated acceptance requires two byte-identical `npm run assets:m08` passes plus typecheck, full tests, lint, build, source-atlas validation, and the four mandatory Nutcracker extraction gates. Automated evidence does not approve the reconstructed UI or gameplay. JIP-840, JIP-845, and JIP-850 remain open for Marcus's manual review.
