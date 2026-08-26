# M07 Mini-Game Source Map

Linear milestone: M07. Manual UI approval remains required for JIP-825, JIP-830, and JIP-835.

This map is the durable source contract for Trivia, Funky Monkey Melody, MusiCards Memory, Find Me On The Tree, and Flying Instruments. The extractor is `app/scripts/extract-m07-source-assets.mjs`; run it from `app/` with `npm run assets:m07`. Generated audit evidence is written to ignored `app/generated/m07-source-extract/`, and source-local runtime promotions are written to `app/src/assets/m07-source/`.

## Locked source inventory

| Runtime route | Authoritative SWF | SHA-256 | Stage / timeline | Source data and sound |
| --- | --- | --- | --- | --- |
| `trivia` | `analysis/setup/app/games/trivia/trivia.swf` | `4c4841aae981e5d96852c44d05f5c435cc069a461bd2f4ffec9a17d58c1cad77` | 640 x 480, 40 frames, 12 fps | 106 questions from `questions/trivia.txt`; embedded intro id 100, correct id 135, wrong id 150; game key 9 |
| `melody` | `analysis/setup/app/games/melody/melody.swf` | `cd6a2e1b10664de578a1505c4cf01e88c63f89bc9820e296b58d22984fc73ead` | 17 root frames, 15 fps; labels `init` 2, `new_seq` 8, `fin` 13 | 36 sequences from `snd/Melody.txt`; bundled `note-{Short,Med,Long}.mp3`; game key 5 |
| `memory` | `analysis/setup/app/games/memorygame/memory.swf` | `86b7e690388fa8a0d1f826642d63fb51a1550fc6c6ef516f6983ea07a9e70ce6` | 4 root frames, 15 fps | 18 bundled card sounds; game key 2 |
| `tree-game` | `analysis/setup/app/games/tree/tree.swf` | `c32f04ce0c862d740a8e1147440c2c397f09a8acd846d066a993b5c03bc035ea` | 46 root frames, 12 fps; labels `ini` 1, `beg` 2, `win` 18, `go_out` 39, `goOut` 46 | Three `Snd_1`/`Snd_2`/`Snd_3` variants, each with three prompts and four choices per round; game key 8 |
| `flying-instruments` | `analysis/setup/app/games/flyinginstruments/flyinginstruments.swf` | `36d3515a8edb048ca9f1c05552c4a243638c09fd9ead1ce03e9bba609ad7c9c5` | 7 root frames, 15 fps; `chooseLevel` 2, `playLevel1` 3, `playLevel2` 4, `playLevel3` 5, `bye` 6 | 16 recoverable instrument JPEG3 images, source star, and embedded instrument/family sounds; game key 3 |

`npm run assets:m07` must report five SWFs, 39 source images, and 112 companion files. It locks the five hashes above, parses actions/text/placements, repairs JPEG3 alpha, extracts recoverable child shapes, exports embedded sounds, and writes the promotion manifest. The committed promotion set currently contains 195 files. Source-local stage/frame promotions are intentionally retained for Melody, Memory, Tree, and Flying Instruments even when their decoded pixels are identical; shared pixels do not erase source provenance.

## Trivia

The full recovered book is DefineBitsJPEG3 id 5 and is promoted as `app/src/assets/m07-source/trivia-book.png`. Root frame 20 places the question edit text id 109 at x 132.40, y 66.05. Answer instances `b1` through `b4` begin at x 373.25 with y positions 89.95, 144.00, 199.80, and 265.20, scale 0.872. Correct and wrong counters are placed at approximately x 150/y 308 and x 146/y 345.

Runtime behavior parses the original query-string schema (`qN`, `op1N`…`op4N`, `correctN`, `goodN`, `badN`), plays embedded correct/wrong sounds, advances questions, tracks both counters, and grants game key 9 after ten correct answers. Source response text is used directly.

## Funky Monkey Melody

Root frame 1 places the source decoration and selector: `coutain` sprite id 49 at x 0.75/y 0, `theStarter` sprite id 50 at x 333/y 153, `usmus` id 124, exit id 132, help id 139, and `magicKey` id 145. Root frame 2 places `makaka` sprite id 170 with matrix scale -0.703/0.703 at x 250.20/y 220.15, keyboard sprite id 290 at scale 1.583 x 317.95/y 370.35, and `start_btn` id 297 at x 327.95/y 98.65.

Exact recovered visible labels include `Select level`, `Beginner`, `Easy`, `Intermediate`, `Advanced`, `CONGRATULATIONS!`, `CONTINUE`, and `NEW GAME`. The runtime parses all 8 beginner, 8 easy, 10 intermediate, and 10 advanced sequences. Each token selects the exact bundled note, length suffix, and delay; pointer/keyboard note input is checked against the recovered sequence and game key 5 is granted when the selected difficulty set is completed.

The full `makaka`/keyboard sprite flattening is not available: local `swfrender` emits `INVALID GRADIENT`, reports unknown child IDs, and writes no root PNG. The runtime therefore composes source-local stage/frame/JPEG3 layers with a DOM keyboard and a clearly classified character silhouette fallback. That retained gap is exact nested timeline/vector playback, not missing sequence or audio behavior.

## MusiCards Memory

The source initializes level 1 with five pairs, four columns, three rows, and `errors = pairs * 2`. Each completed level adds one pair until 18 pairs; completing the 18-pair level grants game key 2. Exact visible source labels include `errors left :`, `level :`, `NEXT LEVEL`, `NEW GAME`, and `PLAY AGAIN`.

Card face sprite id 57 has 18 frames. Recoverable child shapes 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 53, and 55 are promoted as correctly numbered card faces. Sprite id 61 renders the exact 37 x 52 source card back. The runtime creates deterministic paired decks, uses the original level/error rules, plays the bundled sound for each face, and exposes the source assets rather than generic card art.

The full root render writes no PNG with the local missing-JPEG build. The retained gap is exact Flash display-list animation and the two face frames whose parent composition could not be flattened; recoverable child art remains source-backed and the runtime classification records the composed fallback.

## Find Me On The Tree

The game has three targets/rounds and four choices in each row. Source choices `pl_1` through `pl_12` use these root coordinates:

| Choice | x | y | Choice | x | y |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 97.75 | 188.45 | 7 | 304.55 | 255.50 |
| 2 | 160.90 | 190.65 | 8 | 91.30 | 441.95 |
| 3 | 245.85 | 170.65 | 9 | 159.80 | 438.35 |
| 4 | 68.90 | 303.50 | 10 | 208.20 | 419.30 |
| 5 | 137.50 | 316.80 | 11 | 260.20 | 388.05 |
| 6 | 226.95 | 268.65 | 12 | 309.20 | 397.35 |

The source constructs correct/prompt paths `Snd_<variant>/c_<round>.mp3` and three incorrect paths `Snd_<variant>/i_<round>_<incorrect>.mp3`. Its placement loop combines one correct sound and three incorrect sounds into four randomized choices for each of three rounds; three correct rounds (`otgad == 3`) grant game key 8. Source shapes id 1 (sky gradient), 2 (blue door), 3 (hallway color), and 7 (tree branch) render cleanly. JPEG3 id 4 supplies the corridor line art and alpha. The runtime composes these promoted layers and positions all 12 interactive hotspots at the exact coordinates above.

The full root render writes no PNG because the installed renderer lacks JPEG support. The retained gap is full timeline/display-list playback and source random ordering. Until the exact random permutation is recovered, the runtime uses the documented deterministic correct-option sequence 2, 4, 1 so the three real prompt/choice sets remain testable.

## Flying Instruments

This route did not exist before M07; the disabled main-room source hotspot is now routed. The source contains a four-by-seven play grid, three levels, `START`, `RESUME`, `HELP`, and `CHOOSE A GAME TO PLAY`. Source values set `maxInst` to 17 for level 1 and 8 for levels 2 and 3. The repaired source images promoted for runtime use are flute, oboe, clarinet, bassoon, harp, two pianos, drum, cymbals, double bass, cello, violin, trumpet, trombone, French horn, tuba, and the source star.

Embedded export sounds were recovered directly rather than substituted. The runtime uses the 16 visual instruments and sounds, classifies them into the four recovered game families, requires the complete promoted instrument set at level 1 or eight correct answers at levels 2/3, and grants game key 3. The visible `?` family targets are a documented pointer/keyboard substitute for the source's Tetris-like drop zones; accessible labels expose the four family targets without adding unproven visible copy to the preserved viewport.

The exact full-render probe produced a 640 x 480, 406-byte transparent PNG while reporting missing JPEG support and unknown child IDs. The retained gap is full sprite-grid/timeline/Tetris motion. Source instrument images, embedded audio, level states, source control text, and key behavior are retained.

## Validation and approval

Automated validation proves deterministic extraction, parsing, state transitions, DOM source provenance, tests, lint, type safety, and production build health. It cannot approve visual fidelity. JIP-825, JIP-830, and JIP-835 remain In Review until Marcus explicitly approves these source-backed screens. No browser/manual approval was performed during this pass.
