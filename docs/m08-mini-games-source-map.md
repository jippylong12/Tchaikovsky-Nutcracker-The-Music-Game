# M08 Mini-Game Source Map

> **Removed 2026-11-06.** The hand-made Children's Album, Loopy Tunes, Orchestra, Toy Soldiers, Waltz, Alice puzzles, and NutHouse screens and their assets, data module, and extractor script are gone, because the music room now plays the original games from the restored CD through Ruffle. This map stays as source evidence only; its commands and paths no longer exist.

This map is the source-of-truth record for the M08 recreation pass. The runtime inputs are the recovered Flash files under `analysis/setup/app/games/`; `app/scripts/extract-m08-source-assets.mjs` verifies their SHA-256 hashes before writing ignored evidence under `app/generated/m08-source-extract/` and promoted runtime files under `app/src/assets/m08-source/`.

Run `npm run assets:m08` from `app/`. A valid pass reports 34 SWFs, 112 source images, 3 extracted root streams, 205 extracted `DefineSound` files, 77 runtime companion files, 13 verified Alice Ruffle renders, and 33 verified Nut House Ruffle renders. The extractor excludes backup files and alternate Children's Album WAV copies while retaining the source MP3s and Waltz WAV. It preflights every required source/companion, all 34 locked SWF hashes, and all 46 source-runtime capture hashes before removing only its owned generated and promoted M08 roots for the rebuild.

## Source inventory

| Family | Authoritative source | Stage | Timeline | Runtime route |
| --- | --- | --- | --- | --- |
| Children's Album | `games/childrensalbum/childrensalbum.swf`, `games/data/childrensalbum.txt`, `games/data/childrensdoors.txt`, `preview/`, `song1/` … `song8/` | 640 x 480 | 7 frames at 15 fps | `childrens-album` |
| Loopy Tunes | `games/loopytunes/loopChooser.swf`, `loop1.swf` … `loop8.swf` | chooser 550 x 400; games 640 x 480 | chooser 1 frame at 12 fps; games 3 frames at 15 fps | `loopy-tunes` |
| Orchestra | `games/orchestragame/orchestra.swf` | 640 x 480 | 2,095 frames at 15 fps | `orchestra` |
| Toy Soldiers | `games/toysoldiersgame/toysoldiersgame.swf` | 640 x 480 | 1 frame at 12 fps | `toy-soldiers` |
| Waltz | `games/wedding/waltz.swf`, `games/wedding/MP3Wedding3.wav` | 550 x 400 | 785 frames at 12 fps, about 65.4 seconds | `waltz` |
| Alice | `games/aliceswf/alice.swf`, `game_01.swf` … `game_12.swf` | 800 x 600 | chooser 641 frames at 15 fps; games 1 frame at 15 fps with nested animated sprites | `alice-puzzles` |
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

The chooser loads `games/aliceSWF/game_XX.swf` at runtime (the recovered filesystem directory is lowercase `games/aliceswf/`), exposes `BTNgame_1` through `BTNgame_12` around the post-intro `mainDialer`, stores three toy values, and calls `checkSolution` after each clock release. The root placement is centered at x `400.00`, y `300.05`; the twelve selector buttons form the source clock ring. The route now opens on an 800 x 600 Ruffle capture of that stable clock state and overlays transparent, keyboard-accessible hit regions on the source numbers instead of showing a generic numbered strip.

Each loaded puzzle root contains named `toy1`, `toy2`, `toy3`, `character1`, and `character2` instances. Direct playback in Ruffle 0.5.0 resolves the display lists that crash SWFTools: puzzles 01-03 are the White Rabbit and Alice in a winter landscape; 04-06 are the Caterpillar and Alice in a vivid garden; 07-09 are the tea-party scene; and 10-12 are the storm/castle scene. The committed source-runtime captures remain puzzle-local even where source SWFs or captured pixels are identical. They are promoted as `alice-stage-01.png` through `alice-stage-12.png` and scaled uniformly from 800 x 600 to the preserved 640 x 480 viewport.

Chooser sprites `clock_1`, `clock_2`, and `clock_3` are ids `0152`, `0153`, and `0154`, initially placed at `(693.35,131.65)`, `(683.35,505.40)`, and `(86.10,513.40)`. Their recovered `bodyAndHand` child is sprite id `0151`; a centered 2048 wrapper leaves false distant fragments, so the deterministic promotion trims and then crops the actual `132x131+960+960` clock component. Gear sprite id `0098` renders intact at 182 x 182. Sprite `0151` builds a fresh random `angleToFrame` permutation of toy frames 1 through 4, picks a random `firstPos`, and exposes four snap angles `[−90, 0, −270, −180]`. The runtime uses those source children for the three interactive clocks and keeps all four valid toy-frame states; its accessible whole-control activation cycles frames `4 → 1 → 2 → 3 → 4` rather than replaying the four internal hit regions, per-clock random permutation, or pointer gesture. It does not retain the invented `ALICE PUZZLE`, `SET THE THREE DIALS`, `CHECK SOLUTION`, or visible correctness banners.

Every recovered `gameCombination1` through `gameCombination12` array equals `[1,1,1]`. No game-key action was recovered; Alice stays a supplementary puzzle family.

### Nut House

Rooms 11-18 each set `maxMir=8`. Their exact correct mirror sequence is `[8,3,1,7,6,4,5,2]`. A correct choice loads the next room, and room 18 grants `gameKey7`. The original `openDoor` value in `nuthouserooms.txt` is mapped to `progress.setNutHouseOpenDoor(room - 10)`.

Direct playback through the official self-hosted Ruffle 0.5.0 runtime resolves every complete room display list that the local SWFTools root render crashes on. Room 11 uniquely opens on the source fish tutorial, advances to the framed `Dance of the Sugar Plum Fairy` prompt, and then enters the room. Rooms 12-18 open on their framed song prompts: `Dance of the Reed-Flutes`, `Arab Dance`, `Waltz of the Flowers`, `Russian Dance (Trepak)`, `March`, `Overture`, and `Chinese Dance`. Each gameplay frame includes the real eight source mirrors, the top-left `?`, top-right `EXIT`, and bottom `PLAY` controls. The runtime now uses hash-locked, room-local Ruffle captures for the tutorial, eight prompts, eight gameplay rooms, eight fish-help states, and eight fish-backed YES/NO exit warnings. It no longer draws a numbered mirror grid, a made-up room heading, or visible fallback feedback inside the 640 x 480 viewport.

The root `checkMusic()` action stops current audio, resets all mirror frames, and the bottom PLAY button starts semantic export `mainMusic`; every room exports that track as DefineSound id `0011`. The remake therefore starts `sound-11.mp3` when the source prompt PLAY control enters a room and when the gameplay PLAY control is activated. The source help/exit controls delegate to the shared `usmus` timeline. Help brings the fish over the current room; EXIT opens the source YES/NO warning, where NO returns to the room and YES leaves the Nut House.

The mirror instances and correct sprite evidence are:

| Room | Mirror sprite ids 1..8 | Correct source sprite |
| --- | --- | --- |
| 11 | `0138,0144,0151,0161,0167,0182,0189,0197` | mirror 8 / `0197` |
| 12 | `0084,0092,0101,0112,0123,0132,0143,0151` | mirror 3 / `0101` |
| 13 | `0083,0090,0099,0107,0117,0125,0133,0143` | mirror 1 / `0083` |
| 14 | `0084,0092,0101,0156,0117,0124,0134,0144` | mirror 7 / `0134` |
| 15 | `0090,0098,0106,0117,0124,0132,0140,0148` | mirror 6 / `0132` |
| 16 | `0086,0094,0103,0112,0127,0135,0145,0153` | mirror 4 / `0112` |
| 17 | `0083,0091,0099,0108,0116,0126,0136,0147` | mirror 5 / `0116` |
| 18 | `0082,0093,0101,0110,0117,0127,0135,0143` | mirror 2 / `0093` |

Transparent keyboard-accessible hit regions follow the recovered mirror silhouettes rather than the source's abstract two-row instance origins. Room 18 is the clearest reason: mirror 2 is sprite `0093`, placed at `(244.05,106.00)`, but its child sprite is translated to `(-2.95,-49.00)`, producing the upper ceiling mirror rather than a generic second grid cell. Pointer entry and keyboard focus still preview the corresponding semantic mirror sound; activation preserves the room-local success/failure audio and persistence actions.

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
- Alice puzzle boards terminate with `SIGSEGV`; the chooser's SWFTools output contains only an incomplete pale ring. Direct playback through the official Ruffle 0.5.0 self-hosted runtime resolves the complete 800 x 600 puzzle display lists and the post-intro chooser. Those source-runtime captures are now hash-locked inputs under `analysis/setup/app/games/aliceswf/recovered-renders/`; SWFTools remains the deterministic child-asset path for gear id `0098` and cropped dial id `0151`. The stable puzzle captures do not change with the runtime clock state, replay the randomized `angleToFrame` mapping, or animate the correct-state character/gear sequence; those remain manual-review gaps.
- Nut House rooms terminate with `SIGSEGV` under the local SWFTools root-render path. Official Ruffle 0.5.0 playback resolves the complete display lists. The 33 stable source-runtime captures are hash-locked under `analysis/setup/app/games/nuthouse/recovered-renders/` and promoted by `npm run assets:m08`. The static captures do not reproduce live mirror morph/color animation, fish motion/voice timing, or the correct-answer transition/key timeline; those remain explicit manual-review gaps rather than permission to invent replacement UI.
- Toy Soldiers exits successfully and exposes the green field, the first frame of the cyan moving shape, staff lines, and feedback flashes, but it omits the button-backed soldiers and controls; isolated sprite id `0031` renders transparent because button id `0030` is unresolved even though child shape id `0029` is recoverable.
- Waltz exits successfully but only exposes a gray gradient.

These results do not authorize generic invented scenes. Runtime routes compose recoverable child assets, exact text/action data, and source audio, with `data-source-fallback` metadata on each remaining DOM interaction. Several frame/stage children are black alpha/color-transform inputs in the source display list; retaining them is provenance evidence, but exact nested CXForms and full timeline motion remain an open visual-approval gap.

The stream inventory has another repeatable tool limitation: `swfextract` can advertise `MP3 Soundstream` for a non-MP3/ADPCM stream, after which `swfextract -m` reports `Soundstream is not mp3 (2)` or `Didn't find a soundstream`. The extractor records that source as `blocked` and continues to extract standalone `DefineSound` records. Never claim an extracted root MP3 unless the target file exists and its hash is in the manifest.

## Validation and approval

Automated acceptance requires two byte-identical `npm run assets:m08` passes plus typecheck, full tests, lint, build, source-atlas validation, and the four mandatory Nutcracker extraction gates. Automated evidence does not approve the reconstructed UI or gameplay. JIP-840, JIP-845, and JIP-850 remain open for Marcus's manual review.
