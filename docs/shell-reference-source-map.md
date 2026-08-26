# Shell and Reference Source Map

This map records the source evidence used by the recovered projector introduction, `playRoom` menu, story/biography/ballet readers, Musictionary, and Listening Room. It complements the Nutcracker-song-specific map in `docs/nutcracker-song-source-map.md`.

## Deterministic extraction gate

Run from `app/`:

```sh
npm run assets:shell-reference
```

The gate validates the source hashes, extracts the final valid Flash payload appended to `analysis/setup/app/Nutcracker2.exe`, writes ignored dumps under `app/generated/shell-reference-source-extract/`, and promotes only named source-local assets under `app/src/assets/source-scenes/`.

Locked evidence:

- `Nutcracker2.exe` SHA-256 `79e464b0af7452697e0d63c71a6829848834f6fe3d7a311129c82e0b08935bab`
- final valid embedded `FWS` at byte `864256`, Flash 6, declared length `6085533`
- `flute_intro.swf` SHA-256 `aa92b6b3022c3cf3030cecd7c06888aebd929a63bcc7b3ce18119f3f7476b782`
- `gramophone.swf` SHA-256 `76310a834c1ba3773bd429b594a20a1083b61c657d78de4fc9c1ac20cc58bbdf`

## Projector introduction

The main projector loads `flute_intro.swf`. That movie is an 800 x 600, 15 fps, 1277-frame timeline with a source `skip` text control at the lower-right edge. The runtime preserves the skip behavior, scales one promoted source garden layer from `DEFINEBITSJPEG id 0371`, and does not claim to reproduce the full intro timeline.

Local probes are an explicit fallback boundary:

- `swfextract -f 1`, `-f 300`, `-f 900`, `-f 1200`, and `-f 1277` produced blank 573-byte PNG renders.
- frame probes `-f 100` and `-f 600` crashed the local renderer with exit 139.

The runtime records this evidence on `.source-intro-scene` through `data-source-*` attributes.

## Projector `playRoom`

Root frame 2378 is labeled `playRoom`. Its room art is `DEFINEBITSJPEG id 0518`, referenced by shape `0519` at depth `0003`, centered at x `320`, y `240`. The promoted `main-playroom-background.jpg` is the exact 640 x 480 JPEG payload.

The activity buttons are source hotspots; their source button ids, depths, coordinates, and actions are preserved in the DOM:

| Button | Depth | x | y | Source action |
| --- | ---: | ---: | ---: | --- |
| 0625 | 0005 | 604.60 | 131.80 | `games/nuthouse/room11.swf` |
| 0631 | 0007 | 214.55 | 293.15 | `games/childrensalbum/childrensalbum.swf` |
| 0632 | 0012 | 332.85 | 377.05 | `games/memorygame/memory.swf` |
| 0634 | 0019 | 357.90 | 429.25 | `games/flyinginstruments/flyinginstruments.swf` |
| 0635 | 0023 | 203.55 | 427.85 | `activities/musictionary/musictionary.swf` |
| 0636 | 0029 | 446.55 | 347.80 | `games/trivia/trivia.swf` |
| 0638 | 0035 | 562.50 | 361.55 | `games/melody/melody.swf` |
| 0639 | 0039 | 59.85 | 435.45 | `activities/originals/gramophone.swf` |
| 0640 | 0050 | 99.25 | 143.85 | `activities/story/story.swf` |
| 0642 | 0058 | 493.45 | 169.45 | `games/tree/tree.swf` |
| 0643 | 0065 | 441.30 | 246.65 | `games/orchestragame/orchestra.swf` |
| 0644 | 0087 | 187.50 | 130.25 | `activities/ballet/ballet.swf` |
| 0646 | 0093 | 474.95 | 105.70 | `activities/biography/biography.swf` |

The Nutcracker game is a separate `nutButton` sprite `0671` at depth `0187`, x `300.95`, y `192.40`. Its on-load ActionScript hides the instance until `collectedKeys == 9`; the remake uses the equivalent nine-completed-game gate.

`swfextract -f 2378` cannot flatten the full projector scene with the installed build because it reports `No JPEG library compiled in`. The promoted background plus source-coordinate hotspots is the documented runtime composition. Flying Instruments and Orchestra remain present as disabled source hotspots because this route manifest does not yet contain those activities.

## Story, biography, and ballet readers

All three source readers are 640 x 480, 15 fps click-through movies. The runtime removes the generic app tabs and number-grid pagination and retains the source controls `NEXT >`, `< PREV`, and `EXIT`.

- Story: frame labels `1`-`4`, text ids `0016/0018`, `0035/0036`, `0040/0041`, `0045`, source book JPEG3 id `0005`; four spreads and eight displayed page numbers.
- Biography: frame labels `1`-`4`, text ids `0015/0017`, `0036/0037`, `0044`, `0051/0052`; source image ids `0018`, `0038`, `0045/0046`, `0053`; four spreads and eight displayed page numbers.
- Ballet: frame labels `1`-`5`, text ids `0015/0017`, `0038/0039`, `0043/0044`, left/right `0050/0049`, `0054`; source image ids `0018` and `0055`; five spreads and ten displayed page numbers.

The runtime models the two source pages separately rather than collapsing each spread into one text pane. Representative source placements are story frame 2 text `0035` at x `76.15` and `0036` at x `349.10`; ballet frame 2 text `0038` at x `77.15` and `0039` at x `348.10`; and biography frame 4 left text `0052` at x `82.15` / right text `0051` at x `351.10`. Biography frame 3 renders both distinct 202 x 128 JPEGs `0045` and `0046` on the source right page. Each reader's JPEG3 `0005` color and alpha payload is composited deterministically and promoted under a source-local name (`story-reader-book.png`, `biography-reader-book.png`, or `ballet-reader-book.png`). The three source tags are byte-identical, so the extractor adds a deterministic source-path PNG comment after stripping volatile metadata. Pixel output remains identical while byte hashes and production bundle URLs remain source-local. `npm run build` fails if any of the three named reader assets is absent from the Vite bundle.

The text in `app/src/data/referenceContent.ts` is transcribed from those exact `DEFINETEXT` records, including source-era wording, punctuation, and text that continues across frames. Full-root renders for all three movies crash locally with exit 139 after missing-JPEG/invalid-gradient diagnostics, so the runtime composes the recovered text and available image children in a two-column DOM book surface. The source SWF, frame label, per-column text ids, image ids, controls, and exact renderer limitation remain inspectable on every rendered spread. NEXT/PREV restore keyboard focus to the corresponding replacement control, falling back to the newly rendered spread heading at a terminal page.

## Musictionary

`activities/musictionary/musictionary.swf` uses a dark `#003366` root background, source `EXIT` text ids `0073`-`0075`, source `NEXT` text id `0086`, and one `instPlayer` sprite per instrument. The remake advances through the exact root-frame sequence `flute`, `oboe`, `clarnet`, `bassoon`, `sax`, `harp`, `piano`, `vibraphone`, `timpani`, `cymbals`, `kontrabas`, `cello`, `violin`, `viola`, `trumpet`, `trombon`, `horn`, `tuba`; exits with `EXIT`; and plays the recovered audio mapped to each `instPlayer` id. The runtime keeps normalized display names such as Clarinet and Double Bass while preserving the source frame order. NEXT restores focus after the DOM frame replacement.

The visible instrument prose is exact `DEFINETEXT` content. Representative mappings are flute player `0149` / text `0152`, clarinet player `0305` / text `0307`, timpani player `0527` / text `0528`, and tuba player `0854` / text `0855`. The full movie cannot be flattened by the local SWF renderer, so unrecovered character/vector animation remains a documented display-list gap rather than invented art.

## Listening Room

`activities/originals/gramophone.swf` loads `activities/originals/theme{iam}.mp3`, uses root player labels `pauseLP` and `playLP`, and populates dynamic `discTitle` / `discName` fields. The runtime keeps those eight exact theme paths and state transitions. Before the user chooses a record, `discTitle` reads `CHOOSE A RECORD`, `discName` is empty, and every record exposes `aria-pressed="false"`; theme 1 is not preselected.

Recovered visual children:

- gramophone JPEG3 id `0045`, placed through sprite `0048` at scale `0.570`, x `13.70`, y `95.25`; promoted as `listening-room-gramophone.png`
- lossless ornamental frame id `0108`, placed through sprite `0111` at depth `0180`, centered x `319.60`, y `238.90`; promoted as `listening-room-frame.png`
- source record sprites `0063` (`lp1`), `0070` (`lp2/lp6/lp8`), `0072` (`lp3/lp7`), `0066` (`lp4`), and `0059` (`lp5`); each unique sprite is promoted under its source-local `listening-room-record-lp#.png` name and the runtime retains the root depth/matrix/coordinate for all eight instances

The earlier public path `activities/originals/gramophone/108.png` was misleading: id `0108` is the ornamental frame, not the gramophone. Runtime imports now use correctly named source-local promotions.

Direct `swfextract -j 45`, `-j 78`, `-j 84`, `-j 88`, `-j 92`, and `-j 104` all fail locally with `No JPEG support compiled in` and `Zlib error -3`. The deterministic extractor reads JPEG3 and alpha payloads directly, repairs the legacy JPEG marker pair, inflates the alpha channel, and writes a stable PNG with time/date chunks removed. Isolated record sprites warn about unknown button-state child ids, but their visible pause-state source shapes render intact in a translated wrapper and are promoted with hash gates. Full interactive record/tonearm timeline playback remains the documented gap.

## Manual approval gate

These routes are implemented for review, not UI-approved. Automated checks prove source identity, exact text/action mappings, runtime behavior, and asset drift gates. Marcus's visual approval remains required before the related fidelity issues may be closed.
