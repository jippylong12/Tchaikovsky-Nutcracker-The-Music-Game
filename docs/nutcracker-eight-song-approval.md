# Nutcracker Eight-Song Source-Fidelity Approval Packet

This is the concrete review target for the chooser and eight song scenes. It separates recovered source evidence from retained fallbacks; automated checks do not constitute Marcus's visual/gameplay approval.

## Review evidence

Run from `app/`:

```sh
npm run assets:nutcracker-swf
npm run assets:nutcracker-ui
npm run assets:nutcracker-actors
npm run assets:nutcracker-jpeg3
```

The display-list pass writes full ignored proof to `app/generated/nutcracker-source-extract/full-swf-pass/display-list/targets.json` and `contact-sheet.html`, and refreshes the committed consumer catalog at `app/src/data/generated/nutcrackerDisplayListCatalog.ts`. The source map is `docs/nutcracker-song-source-map.md`.

Pre-review automated evidence on 2026-08-26:

- `npm run typecheck`: passed.
- `npm test`: 13 files, 100 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed, 772 modules transformed; reader-bundle provenance passed.
- `npm run assets:source-atlas`: passed, 28 routes across 22 entries and 123 promoted visual samples.
- `npm run assets:nutcracker-swf`: 73 SWFs, 261 direct lossless PNG assets, 0 failures, 6 required display-list targets recovered.
- `npm run assets:nutcracker-ui`: passed; the normal chooser capture and opened-door crop were hash-verified and all promoted UI assets were pixel-unchanged after promotion.
- `npm run assets:nutcracker-actors`: passed; 0 promoted, 64 pixel-unchanged.
- `npm run assets:nutcracker-jpeg3`: passed; 9 repaired JPEG3 outputs.

These checks establish deterministic source extraction and application health. They do not establish visual approval.

## Chooser review

| Surface | Source-backed implementation | Retained fallback / approval question |
| --- | --- | --- |
| Hallway, frame, instruments, and normal controls | Hash-locked official-Ruffle normal source frame, 640 x 480, plus retained child depth/matrix/CXForm extraction proof | The capture is a static normal state; ongoing mascot/background/control timeline motion is not replayed. |
| Eight doors | Correctly named/hash-locked id-`0080` source-local opened-door crop, exact `m#` art transforms, exact id-`0085` button-shape hit rectangles, recovered `door#` completion visibility, and `nutdoors.txt`-derived unlock behavior | Accessible DOM hit targets remain visually transparent over source bounds. Ready/locked doors must show no opened-door art and no HTML disabled background; completed doors reveal the separately transformed source opened-door sprite. |
| Help, quit warning, and final key | Source help/warning talkers, recovered ActionScript flow, and source `magicKey` id `0213` | Translated wrapper renders replace unavailable full nested-timeline flattening. Confirm overlays remain in-frame and do not cover usable doors. |

Manual chooser steps:

1. Open the chooser with a fresh local progress state. Door 1 must be clickable, doors 2-8 must not be clickable, no opened-door art should appear yet, and no beige disabled rectangles or visible `Ready`/`Locked`/`Cleared` text may cover the source hallway.
2. Open Help and the EXIT warning. Confirm both stay inside 640 x 480 and use recovered art rather than generic cards.
3. Complete songs sequentially. The completed door must reveal the source opened-door clip at its hallway matrix, the next door must become clickable, mirrored right-side door art must face the correct direction, and the source magic key must remain hidden until all eight doors are complete.

## Eight-song review matrix

Each row uses eight local source track streams, the recovered four-track solution, repaired source scenery where present, and 8 per-song actor assets. Selected actors are explicitly a documented source-derived fallback: exact arbitrary-frame playback is not available because local `swfrender` has no frame selector, representative frame-1 renders are transparent, and extracted later frames can crash.

| Door | Scene | Correct tracks | Representative preview timing check | Source scenery / actor evidence |
| --- | --- | --- | --- | --- |
| 1 | Dance of the Sugar Plum Fairy | 1, 2, 5, 8 | Track 5 starts at 10.9s; track 8 at 19.3s without an added UI delay | Source song-1 frame; `song1-track#-actor.png` |
| 2 | March | 1, 2, 3, 6 | Track 1 starts at 7.5s | Repaired song-2 JPEG3; `song2-track#-actor.png` |
| 3 | Overture | 3, 4, 6, 8 | Track 3 starts at 2.6s | Repaired primary song-3 JPEG3; `song3-track#-actor.png` |
| 4 | Trepak | 4, 6, 7, 8 | Standard 0.6s source-silence offset | Repaired song-4 JPEG3; `song4-track#-actor.png` |
| 5 | Arabian Dance | 2, 4, 5, 7 | Track 4 starts at 7.5s | Repaired song-5 JPEG3; per-song track 7 is the standing drummer, not song-1 cannon art |
| 6 | Chinese Dance | 2, 4, 6, 7 | Track 2 starts at 9.6s | Repaired song-6 JPEG3; `song6-track#-actor.png` |
| 7 | Dance of the Reed Flutes | 1, 4, 5, 6 | Track 5 starts at 1.7s | Repaired song-7 JPEG3; per-song track 7 remains distinct |
| 8 | Waltz of the Flowers | 1, 2, 4, 6 | Tracks 3/8 start at 3.0s/3.1s; violin source firstFrame is 559 | Repaired song-8 JPEG3; `song8-track#-actor.png` |

Manual song steps for each row:

1. Click LISTEN, then preview the timing-check track. Audio should begin from its source-silence offset without a second artificial wait.
2. Focus representative instruments and controls. The recovered `flyinghelp` text-layer fallback must stay in-frame and must not appear as a generic tooltip card.
3. Select four tracks. The fourth selection must check automatically. A wrong selection must show the source curtain/`_root.message` feedback in-frame; the correct set must show PLAY AGAIN using source body/label art.
4. Open HINT, CHANGE SONG, song Help, and EXIT warning. Confirm the curtain/help/warning compositions and exact source strings remain inside the preserved viewport.
5. Confirm selected actors use the current song's `song#-track#-actor.png`; no correctness glow, badge, or modern selection decoration may appear.

## Explicit remaining fallbacks requiring Marcus approval

- Exact `characters/anim*.swf` arbitrary-frame/timeline playback is replaced by a per-song source bitmap plus restrained source-derived motion.
- `flyinghelp` dynamic edit-text frames are recreated as layered DOM text at recovered bounds because the installed renderer produces transparent output with unresolved edit-text ids.
- Dynamic `_root.message` text remains DOM-backed while the curtain art, timeline labels, placement, and source strings are recovered.
- The chooser's exact normal appearance is preserved as a full official-Ruffle source-runtime capture; ongoing mascot/background/control motion and nested help/warning timelines remain reconstructed state transitions rather than embedded SWF playback. Songs 2-8 still use repaired JPEG3 assets and recoverable child display-list layers because the installed `swfrender` cannot flatten their full composites.
- HTML hit areas provide accessibility and pointer input over recovered source bounds; they must remain visually undecorated.

JIP-349, JIP-347, JIP-357, JIP-358, JIP-359, and the M06 rollups remain open/In Review until Marcus explicitly approves the visual and gameplay experience.
