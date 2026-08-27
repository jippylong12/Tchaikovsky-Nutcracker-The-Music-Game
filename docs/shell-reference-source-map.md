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
- `musictionary.swf` SHA-256 `c8ce65d2ee006afb6254e59e49b2867ad22cd4a5a6d5da004be53c28c632f7cd`
- `gramophone.swf` SHA-256 `76310a834c1ba3773bd429b594a20a1083b61c657d78de4fc9c1ac20cc58bbdf`
- official Ruffle `v0.5.0` self-hosted archive SHA-256 `4e0d44ba990f9fe3434d7848f740348299bd6c473db59fb5f8606b750fcc5760`
- root-frame-1268 source-runtime capture SHA-256 `d0bf34493f250904056468eae4525f039da4e55797282ae2d97d7246c54ecaf0`
- root-frame-2378 foreground source-runtime capture SHA-256 `93a4f305c588c65665ec506545554f7c751740d18c1cd715743ea78a02412b0e`
- deterministic frame-2378 room composite SHA-256 `f1f42c978c8735db266e6aa89bf67d34b2e4b84e7f9b43acfdc47a720b298f75`

## Projector introduction

The main projector loads `flute_intro.swf`. That movie is an 800 x 600, 15 fps, 1277-frame timeline with a source `skip` text control at the lower-right edge. The projector root binds both the intro mouse-up path and `skipBTN.onRelease` to `gotoAndStop("choose")`. The runtime preserves that phase change, scales one promoted source garden layer from `DEFINEBITSJPEG id 0371`, and does not claim to reproduce the full intro timeline.

Local probes are an explicit fallback boundary:

- `swfextract -f 1`, `-f 300`, `-f 900`, `-f 1200`, and `-f 1277` produced blank 573-byte PNG renders.
- frame probes `-f 100` and `-f 600` crashed the local renderer with exit 139.

The runtime records this evidence on `.source-intro-scene` through `data-source-*` attributes.

## Projector source chooser

The missing opening menu is projector root frame `1268`, label `choose`; the earlier static-intro implementation incorrectly skipped directly to `playRoom`. Official Ruffle `v0.5.0` self-hosted playback rendered the complete frame, which is committed as `app/source-evidence/shell/projector-choose-source.png`, hash-locked by `assets:shell-reference`, and promoted as `projector-choose-source.png`.

The first committed capture was a DPR-2 clipping error: a requested 640 x 480 browser clip contained only the top-left 320 x 240 source area padded to a 640 x 480 file. The runtime then stretched that incomplete frame while its hit targets were incorrectly halved. The corrected evidence captures the lossless 1280 x 960 DPR-2 page surface, downsamples it to the native 640 x 480 SWF stage, strips volatile PNG metadata, and restores the five hit regions to full-stage coordinates. This is why the corrected image reaches the bottom-row preview buttons and why the target rectangles below are twice the previous CSS values.

The normal source frame is exact. Isolated extraction probes for button ids `0028`, `0038`, `0043`, `0047`, and `0051` succeed, but direct `swfrender` reports each button id unknown (and the JPEG-backed preview buttons also report missing JPEG support). Exact rollover/down timeline playback therefore remains a named button-renderer gap rather than being replaced by invented hover art.

The runtime overlays transparent accessible hit targets only where source buttons already exist:

| Control | Source placement | Source action | Remake equivalent |
| --- | --- | --- | --- |
| Featured game | button `0028`, instance `nut`, depth `0002`, x `364.15`, y `90.95`, ratio `1267` | root `gotoAndPlay("nutIni")` | continue to the recovered `playRoom` |
| Musical Friends preview | button `0043`, instance `MFBtn`, depth `0012`, x `146.25`, y `355.55`, ratio `1267` | root `gotoAndPlay("MFintro")` | replay the recovered local Musical Friends/flute introduction |
| Alice preview | button `0047`, instance `aliceBTN`, depth `0020`, x `291.80`, y `355.55`, ratio `1267` | root `gotoAndPlay("aliceIntro")` | open the reconstructed Alice activity |
| Website | button `0051`, instance `webBTN`, depth `0029`, x `527.70`, y `355.65`, ratio `1267` | `warningMSG_mc.gotoAndStop("show")`, then `http://www.kidsmusicstage.com` | open the exact legacy URL through the desktop/browser external-link boundary |
| Exit | button `0038`, depth `0009`, x `563.50`, y `25.45`, ratio `1267` | root frame `2388`, then `FSCommand:quit` | close the Tauri window; browser preview uses `window.close()` |

The modern hit rectangles over that native capture are Play `x 216-424, y 44-246`, Musical Friends `x 54-188, y 326-460`, Alice `x 196-332, y 326-460`, website `x 432-576, y 320-464`, and EXIT `x 572-640, y 8-58`. Their DOM `data-source-hit-rect` evidence and actual CSS geometry are both locked by shell tests so metadata cannot stay correct while the clickable regions drift.

The source text objects remain baked into the recovered frame: text `0030` is `Play / Featured / Game`, text `0031` is `Preview Other Games`, text `0048` is `Go to / KidsMusicStage.com`, and button texts `0033`-`0037` provide the EXIT states. No new visible launcher labels or controls are drawn over the source art.

## Projector `playRoom`

Root frame 2378 is labeled `playRoom`. Its room art is `DEFINEBITSJPEG id 0518`, referenced by shape `0519` at depth `0003`, centered at x `320`, y `240`. The promoted `main-playroom-background.jpg` is the exact 640 x 480 JPEG payload.

`swfextract -f 2378` successfully isolates the root frame, and official Ruffle renders its recoverable foreground/display-list children, including the source giraffe, elephant, vibraphone, papers, books, and framed art. SWFTools omits JPEG `0518` from that extracted frame because the installed build has no JPEG library. `assets:shell-reference` therefore hash-checks the captured foreground, removes only its flat `#000066` stage color with a fixed 7% fuzz, and composites it over the exact JPEG `0518`. The result is promoted as `main-playroom-source-composite.png`; this is the runtime menu surface.

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

The source-coordinate hotspots stay over that recovered composite. Every listed activity now maps to a reconstructed local route; no visible playRoom activity is intentionally left as a dead or disabled source button. Full moving projector-timeline playback remains the documented gap.

## Story, biography, and ballet readers

All three source readers are 640 x 480, 15 fps click-through movies. The runtime removes the generic app tabs, scroll panes, number-grid pagination, visible `Pages X-Y` summary, bordered blue buttons, and invented music-note replay control. It retains only the source controls `NEXT >`, `< PREV`, and `EXIT` inside the preserved viewport.

- Story: frame labels `1`-`4`, text ids `0016/0018`, `0035/0036`, `0040/0041`, `0045`, source book JPEG3 id `0005`; four spreads and eight displayed page numbers.
- Biography: frame labels `1`-`4`, text ids `0015/0017`, `0036/0037`, `0044`, `0051/0052`; source image ids `0018`, `0038`, `0045/0046`, `0053`; four spreads and eight displayed page numbers.
- Ballet: frame labels `1`-`5`, text ids `0015/0017`, `0038/0039`, `0043/0044`, left/right `0050/0049`, `0054`; source image ids `0018` and `0055`; five spreads and ten displayed page numbers.

Official self-hosted Ruffle `v0.5.0` resolves every stable labeled reader frame that crashes SWFTools. Thirteen neutral 640 x 480 source-runtime captures are committed under `app/source-evidence/readers/`, hash-locked by `assets:shell-reference`, and promoted as source-local `story-reader-frame-1.png` through `ballet-reader-frame-5.png`. The runtime displays those complete frames directly, so source fonts, line wrapping, text placement, page numbers, photos, flower art, book art, antialiasing, and stage rays no longer depend on inferred DOM layout. `app/src/data/referenceContent.ts` retains the exact text/image ids and transcriptions as accessible metadata, not as a second visible composition.

The Flash hit targets are intentionally much larger than their hover labels. `NEXT >` button id `0014` uses shape id `0013` at x `368.10`, y `418.10`, yielding global hit bounds x `327.00-624.95`, y `35.00-436.95`; Ballet frame 4 replaces it with button id `0048`. `< PREV` uses the frame-local button ids `0034/0039/0044` (Story), `0035/0043/0050` (Biography), and `0036/0042/0047/0053` (Ballet), with global hit bounds x `20.00-309.00`, y `35.00-434.95`. The labels are absent at rest and appear only on rollover/focus. Exact Ruffle hover pixels are cropped from the committed source probes at x `415`, y `399` (`NEXT >`) and x `160`, y `399` (`< PREV`) and overlaid only in those states. Story/Biography share the same EXIT raster state; Ballet's EXIT font raster differs and is promoted separately. Pointer navigation leaves no synthetic focus state; keyboard navigation restores focus to the corresponding source control.

Each source movie starts its narration once at the first labeled spread (`DefineSound` ids `0031`, `0032`, and `0033`). The remake now starts the recovered narration on route entry, resets re-entry to spread one, keeps narration running across instant page changes, and stops it on EXIT. EXIT follows the source `bye` path: visible text/controls disappear, the recovered blank book layer fades over 400 ms, and the route returns to `playRoom`. The pre-page book fade and transient center loading sprite remain the documented static-capture timeline gap; they are not replaced with invented UI.

## Musictionary

`activities/musictionary/musictionary.swf` uses source `EXIT` text ids `0073`-`0075`, source `NEXT` text id `0086`, and one `instPlayer` sprite per instrument. Its exact root-frame sequence is `flute`, `oboe`, `clarnet`, `bassoon`, `sax`, `harp`, `piano`, `vibraphone`, `timpani`, `cymbals`, `kontrabas`, `cello`, `violin`, `viola`, `trumpet`, `trombon`, `horn`, `tuba`. The runtime keeps normalized accessible display names such as Clarinet and Double Bass while preserving that source order.

SWFTools crashes while flattening the full movie, but official Ruffle `v0.5.0` running through the recovered `Nutcracker2.exe` projector resolves all 18 complete stable fact states. The 640 x 480 captures under `app/source-evidence/jip-820/` are hash-locked by `assets:shell-reference` and promoted as `musictionary-frame-1.png` through `musictionary-frame-18.png`. The runtime displays those exact frames directly, so the source border, animal musicians, instrument silhouettes, fonts, rhyme, prose, wrapping, `?`, `EXIT`, and `NEXT` pixels no longer depend on a DOM approximation.

Representative audio/text mappings are flute player `0149` / text `0152`, clarinet player `0305` / text `0307`, timpani player `0527` / text `0528`, and tuba player `0854` / text `0855`. The recovered embedded narration starts on route entry and after every `NEXT`; it stops on help or exit. Transparent hit targets cover only the three visible source controls: help x `0-72`, y `0-73`; exit x `568-640`, y `0-75`; and next x `267-375`, y `315-390`. Pointer activation does not manufacture a focus state; keyboard activation restores focus to `NEXT` after the frame replacement.

The source question control opens the shared blue/pink hallway help state. Its question control at x `537-583`, y `140-184` reveals the recovered fish mascot, and its `EXIT` at x `566-640`, y `450-480` returns to the current instrument. Both complete help states are hash-locked and promoted as `musictionary-help.png` and `musictionary-help-fish.png`. The entry-preview, staged rhyme reveal, and character/instrument motion remain the documented timeline gap; the prior generic cream text card and invented play button have been removed.

## Listening Room

`activities/originals/gramophone.swf` loads `activities/originals/theme{iam}.mp3`, uses root player labels `pauseLP` and `playLP`, and populates dynamic `discTitle` / `discName` fields after a record is dragged to the `hole` target. The root has 16 draggable records, not eight. Its exact `discName` order is Waltz, Russian, Italian Song, Old French Song, German Song, Polka, Mazurka, Neapolitan Song, Dance of the Sugar Plum Fairy, Waltz of the Flowers, Russian Dance, Arab Dance, Chinese Dance, March, Dance of the Reed-Flutes, Overture. `discTitle` is `The Children’s Album` for records 1-8 and `The Nutcracker Suite` for records 9-16.

The initial source fields are blank; there is no source `CHOOSE A RECORD` initialization. The runtime therefore starts with every record unpressed and no invented label. The recovered source tree contains `theme1.mp3` through `theme8.mp3` only, so those paths correctly belong to the eight Children’s Album records. `theme9.mp3` through `theme16.mp3` are absent everywhere in the authoritative tree. The final eight records remain selectable and expose an accessible source-missing status, but the remake does not relabel or substitute unrelated audio.

The Nutcracker chooser and song-game previews are independent of this gramophone catalog and must not fall back to the unrelated Children’s Album audio in `theme1.mp3` through `theme8.mp3`. The song SWF's `previewSong()` composes the four recovered valid `track#.mp3` stems; the remake preserves that exact available path for the in-song `LISTEN` control and uses it as the documented fallback for the chooser's separate embedded preview mixes.

Official Ruffle resolves the complete neutral 640 x 480 Listening Room scene. The hash-locked capture is promoted as `listening-room-source.png` and is the runtime visual, preserving the exact border, title, gramophone, mascot, record artwork, and source overlap. Transparent source-positioned controls preserve pointer, keyboard, and drag/drop selection; the platter drop target is anchored to `hole` sprite id `0050` at x `151.20`, y `334.30`, scale `1.525`. Selecting an available record starts its recovered file once; the platter control pauses or resumes it; `EXIT` returns to `playRoom`.

Exact root placements:

| Record | Instance / sprite | Depth | x | y | Matrix a/d |
| --- | --- | ---: | ---: | ---: | --- |
| 1 | `lp1` / `0063` | 43 | 450.55 | 384.20 | 1.243 / 0.562 |
| 2 | `lp2` / `0070` | 61 | 559.65 | 439.85 | 1.243 / 0.562 |
| 3 | `lp3` / `0072` | 79 | 548.90 | 393.10 | 1.347 / 0.272 |
| 4 | `lp4` / `0066` | 52 | 327.75 | 445.45 | 1.134 / 0.500 |
| 5 | `lp5` / `0059` | 32 | 548.90 | 333.25 | 1.254 / 0.575 |
| 6 | `lp6` / `0070` | 88 | 349.30 | 389.25 | 1.005 / 0.478 |
| 7 | `lp7` / `0072` | 70 | 444.95 | 449.90 | 1.410 / 0.262 |
| 8 | `lp8` / `0070` | 97 | 453.65 | 335.85 | 1.005 / 0.478 |
| 9 | `lp9` / `0076` | 106 | 453.65 | 132.85 | 1.005 / 0.478 |
| 10 | `lp10` / `0076` | 115 | 557.60 | 133.25 | 1.005 / 0.478 |
| 11 | `lp11` / `0076` | 124 | 453.65 | 175.65 | 1.005 / 0.478 |
| 12 | `lp12` / `0076` | 133 | 557.60 | 226.05 | 1.005 / 0.478 |
| 13 | `lp13` / `0076` | 142 | 557.60 | 179.45 | 1.005 / 0.478 |
| 14 | `lp14` / `0076` | 151 | 453.65 | 225.85 | 1.005 / 0.478 |
| 15 | `lp15` / `0038` | 1 | 547.15 | 173.25 | 1.005 / 0.478 |
| 16 | `lp16` / `0076` | 160 | 557.60 | 277.65 | 1.005 / 0.478 |

`lp13` and `lp15` overlap in the source. The runtime keeps the exact neutral pixels, splits their invisible pointer hit regions, and leaves both controls keyboard reachable.

Recovered visual children:

- gramophone JPEG3 id `0045`, placed through sprite `0048` at scale `0.570`, x `13.70`, y `95.25`; promoted as `listening-room-gramophone.png`
- lossless ornamental frame id `0108`, placed through sprite `0111` at depth `0180`, centered x `319.60`, y `238.90`; promoted as `listening-room-frame.png`
- source record sprites `0063`, `0070`, `0072`, `0066`, and `0059`; the earlier isolated promotions remain forensic child evidence, but the runtime now uses the complete source scene rather than recomposing those children

The earlier public path `activities/originals/gramophone/108.png` was misleading: id `0108` is the ornamental frame, not the gramophone. Runtime imports now use correctly named source-local promotions.

Direct `swfextract -j 45`, `-j 78`, `-j 84`, `-j 88`, `-j 92`, and `-j 104` all fail locally with `No JPEG support compiled in` and `Zlib error -3`. The deterministic extractor still preserves those recoverable children for provenance. Full record movement, mascot motion, dynamic visible disc labels, and tonearm animation remain the documented timeline gap over the exact neutral source capture.

## Manual approval gate

These routes are implemented for review, not UI-approved. Automated checks prove source identity, exact text/action mappings, runtime behavior, and asset drift gates. Marcus's visual approval remains required before the related fidelity issues may be closed.
