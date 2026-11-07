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

The main projector loads `flute_intro.swf`. That movie is an 800 x 600, 15 fps, 1277-frame timeline with streamed music (`SOUNDSTREAMHEAD` + per-frame `SOUNDSTREAMBLOCK`) and a source `skip` text, text id `0004` (font `0003`, 12 px, `#cccccc`), placed at depth `0265`, x `770.95`, y `572.50`. The skip text is plain text, not a button, and the movie has no `stop()` at its end.

Since Stage 1 (JIP-1532/JIP-1533) the runtime plays the complete original movie through the bundled official Ruffle `v0.5.0` web build instead of a static layer. It plays only from the launcher's Musical Friends preview; the app opens on the launcher (see "Projector start frame").

Projector root evidence (`nutcracker2-main.actions.txt` / `-p` placements of the embedded main SWF):

| Evidence | Source | Remake equivalent |
| --- | --- | --- |
| Movie load | root frame 2 (`MFIntro`) `DOACTION`, reached from `MFBtn`: `_quality = "MEDIUM"`, `FSCommand:fullscreen true`, `FSCommand:allowscale false`, `FSCommand:showmenu false`, then `loadMovie("flute_intro.swf", "bigloader")` | Ruffle `load({ url: flute-intro.swf, quality: "medium", contextMenu: "off", menu: false })` |
| Loader placement | sprite id `0018` named `bigloader`, depth `0002`, matrix scale `1.000`, translate `-77.00, -60.00`, placed before root frame 2 (`MFIntro`) | see scaling below |
| Skip | `_root.onMouseUp = function () { trace("skip done!"); _root.gotoAndStop("choose"); delete _root.onMouseUp; }` | any primary mouse release over the movie, or the transparent keyboard target over the skip pixels, sets `overturePhase = "launcher"` |
| End of intro | root frames 3-1267 are empty; frame 1268 removes depth `0002` (the loader) and is labeled `choose` | hand-off timer of 1266 frames / 15 fps = 84 400 ms after Ruffle's `loadedmetadata` |
| Replay | launcher `MFBtn.onRelease = _root.gotoAndPlay("MFintro")` (root frame 2) | `preview-musical-friends` re-enters the intro phase and starts the movie from frame 1 |
| `skipBTN` | button id `0066` named `skipBTN` exists only from root frame 1268 (ratio `1268`, x `583.25`, y `21.45`) | not part of the intro; its frame-1 `onRelease` binding has no effect during the intro |

Scaling: the projector does not shrink the movie. It runs fullscreen with `allowscale false`, so the 640 x 480 stage sits 1:1 in the middle of the display and the 800 x 600 intro, offset by (-77, -60), overflows past the stage edges. On the era's 800 x 600 display the intro therefore filled the entire screen (within 3 px of centred) and its `skip` text sat at the screen's lower-right corner, which is 54 px outside the 640 x 480 stage rectangle. A strict 640 x 480 crop would hide the source skip control, so the remake shows what players saw: the full 800 x 600 movie fitted uniformly (0.8) into the 640 x 480 stage (same 4:3 aspect, no bars), then scaled with the stage to the window.

Integration shape (code: `app/src/flash/sourceSwfLayer.ts`, `syncSourceSwf` in `app/src/app.ts`):

- Runtime: `app/vendor/ruffle/ruffle-0.5.0-web-selfhosted.zip` (committed, SHA-256 `4e0d44ba990f9fe3434d7848f740348299bd6c473db59fb5f8606b750fcc5760`). `npm run assets:ruffle` (also run by `predev` and `build`) verifies the hash and unpacks it without source maps into ignored `app/public/ruffle/`; Vite copies it to `dist/ruffle/`, so Tauri bundles it. No network at runtime.
- Movie: `app/src/assets/source-scenes/flute-intro.swf`, a byte-identical promotion of `analysis/setup/app/flute_intro.swf` written and hash-checked by `assets:shell-reference`; imported with `?url` so Vite fingerprints it.
- Loading: the shell injects `/ruffle/ruffle.js` once with `RufflePlayer.config = { polyfills: false, publicPath: "/ruffle/" }`, then `RufflePlayer.newest().createPlayer()` and `player.ruffle().load(...)` with `autoplay: "on"`, `unmuteOverlay: "hidden"`, `splashScreen: false`, `contextMenu: "off"`, `allowNetworking: "none"`, `openUrlMode: "deny"`.
- Hosting: Ruffle's `<ruffle-player>` destroys itself on DOM disconnect and the shell re-renders `#app` with `innerHTML`, so the player lives in a persistent `.source-swf-layer` on `document.body`, pinned with `position: fixed` over `.source-intro-scene`'s bounding rect after every render, after the initial stage fit, and on resize. The layer is sized in real screen pixels, so Ruffle renders at full resolution rather than being upscaled by the stage transform.
- Fallback: if Ruffle fails to load, the layer is removed and the previous static source scene (`DEFINEBITSJPEG id 0371` garden plus a tabbable `skip`) stays.

SWFTools still cannot render this movie (`swfextract -f 1`, `-f 300`, `-f 900`, `-f 1200`, `-f 1277` blank 573-byte PNGs; `-f 100`, `-f 600` exit 139); that is why every earlier scene was a static capture.

## Projector source chooser

The missing opening menu is projector root frame `1268`, label `choose`; the earlier static-intro implementation incorrectly skipped directly to `playRoom`. Official Ruffle `v0.5.0` self-hosted playback rendered the complete frame, which is committed as `app/source-evidence/shell/projector-choose-source.png`, hash-locked by `assets:shell-reference`, and promoted as `projector-choose-source.png`.

The first committed capture was a DPR-2 clipping error: a requested 640 x 480 browser clip contained only the top-left 320 x 240 source area padded to a 640 x 480 file. The runtime then stretched that incomplete frame while its hit targets were incorrectly halved. The corrected evidence captures the lossless 1280 x 960 DPR-2 page surface, downsamples it to the native 640 x 480 SWF stage, strips volatile PNG metadata, and restores the five hit regions to full-stage coordinates. This is why the corrected image reaches the bottom-row preview buttons and why the target rectangles below are twice the previous CSS values.

The normal source frame is exact. Isolated extraction probes for button ids `0028`, `0038`, `0043`, `0047`, and `0051` succeed, but direct `swfrender` reports each button id unknown (and the JPEG-backed preview buttons also report missing JPEG support). Exact rollover/down timeline playback therefore remains a named button-renderer gap rather than being replaced by invented hover art.

The runtime overlays transparent accessible hit targets only where source buttons already exist:

| Control | Source placement | Source action | Remake equivalent |
| --- | --- | --- | --- |
| Featured game | button `0028`, instance `nut`, depth `0002`, x `364.15`, y `90.95`, ratio `1267` | root `gotoAndPlay("nutIni")` | continue to the recovered `playRoom` |
| Musical Friends preview | button `0043`, instance `MFBtn`, depth `0012`, x `146.25`, y `355.55`, ratio `1267` | root `gotoAndPlay("MFintro")` | replay the recovered local Musical Friends/flute introduction |
| Alice preview | button `0047`, instance `aliceBTN`, depth `0020`, x `291.80`, y `355.55`, ratio `1267` | root `gotoAndPlay("aliceIntro")` | play the projector's own aliceIntro trailer through Ruffle, then return to this launcher (see "Projector Alice preview") |
| Website | button `0051`, instance `webBTN`, depth `0029`, x `527.70`, y `355.65`, ratio `1267` | `warningMSG_mc.gotoAndStop("show")`, then `http://www.kidsmusicstage.com` | open the exact legacy URL through the desktop/browser external-link boundary |
| Exit | button `0038`, depth `0009`, x `563.50`, y `25.45`, ratio `1267` | root frame `2388`, then `FSCommand:quit` | close the Tauri window; browser preview uses `window.close()` |

The modern hit rectangles over that native capture are Play `x 216-424, y 44-246`, Musical Friends `x 54-188, y 326-460`, Alice `x 196-332, y 326-460`, website `x 432-576, y 320-464`, and EXIT `x 572-640, y 8-58`. Their DOM `data-source-hit-rect` evidence and actual CSS geometry are both locked by shell tests so metadata cannot stay correct while the clickable regions drift.

The source text objects remain baked into the recovered frame: text `0030` is `Play / Featured / Game`, text `0031` is `Preview Other Games`, text `0048` is `Go to / KidsMusicStage.com`, and button texts `0033`-`0037` provide the EXIT states. No new visible launcher labels or controls are drawn over the source art.

### Live launcher (since 2026-11-06, JIP-1536)

The launcher is now the projector's own frame 1268, playing live in Ruffle: `projector-nutcracker2.swf` is the unmodified embedded FWS (SHA-256 `b6a3677764a9440b9942ec278240b212c4e2c950ad281c4e6c5fdfeb41b04c2b`). Its buttons, rollover/down states, and button sounds run as authored, which closes the button-renderer gap above. The static capture and the hit targets stay underneath only as the fallback for when Ruffle fails.

| Source behaviour | Where in the projector | Shell boundary |
| --- | --- | --- |
| `webBTN` shows `warningMSG_mc` (sprite `0064`, depth `0054`, x `343.35`, y `256.50`) | `onRelease` → `warningMSG_mc.gotoAndStop("show")`; sprite frame 2 places `cover_btn` (button `0053`, full-stage blocker), `no_btn` (`0058`), `yes_btn` (`0061`), and text `0063` | none: the projector plays its own prompt |
| NO | `no_btn.onRelease` → `gotoAndStop("first")` (hidden) | none |
| YES | `yes_btn.onRelease` → `gotoAndPlay("bye")`; frame 3 `getURL("http://www.kidsmusicstage.com")`; frame 10 `stop()` and `FSCommand:quit` | Ruffle's `window.open` is sent to `openExternal`, then `quit` calls `exitApp`. The original opened the site **and closed the CD**; the remake does the same. |
| EXIT (button `0038`) | `GotoFrame 2388` (root frame 2389, `exitNow` outro), then `FSCommand:quit` | `quit` calls `exitApp` after the source outro |
| `MFBtn` | root frame 2 `MFIntro` loads `flute_intro.swf` into `bigloader` at (-77, -60), clipping the 800 x 600 movie | the request for `flute_intro.swf` switches to the fitted Stage 1 intro, so the source `skip` text stays visible |
| `aliceBTN` | `aliceIntro` trailer, then `aliceJump` back to `choose` | none: plays natively. `projector-alice-preview.swf` is now only used from the static fallback launcher |

Fallback gap: if Ruffle cannot start, the static website target still opens the site directly, without the prompt.

## Projector start frame

Projector root frame 1 (`DOACTION` at byte `79408`, 113 bytes) sets `_quality = "MEDIUM"`, sends `FSCommand:fullscreen true`, `allowscale false`, and `showmenu false`, then runs `GotoFrame 1267` (zero-based, so root frame 1268, label `choose`) and `Play`. The loader action for `flute_intro.swf` belongs to root frame 2, label `MFIntro`, which the projector reaches only through `MFBtn.onRelease = _root.gotoAndPlay("MFintro")`. So the original projector opened on the launcher. The flute intro is the Musical Friends preview, not a startup intro. Since 2026-11-06 the remake matches this, on Marcus's rule that the remake does what the original did wherever the source shows it: the app opens with `overturePhase = "launcher"`, and re-entering the overture route also lands on the launcher. The flute intro plays only from the Musical Friends preview.

## Projector Alice preview

`aliceBTN` on the launcher runs `_root.gotoAndPlay("aliceIntro")`. That label is root frame `1535` of the projector itself, not the Alice game: a trailer on the projector's own timeline (with its own stream sound) running through frame `2141`. Frame `2142`, label `aliceJump`, runs `unloadMovieNum(1)` and `_root.gotoAndStop("choose")`.

| Object | Source | Behaviour |
| --- | --- | --- |
| `aliceSkip` | button `0307`, depth `0119`, x `-311.00`, y `621.00`, hit-only shape `0306` (local bounds x `-426.10..1178.25`, y `-858.10..566.25`) | covers the whole stage; `onRelease` runs `gotoAndPlay("aliceJump")`, which returns to `choose` |
| `skipBTN` | button `0308`, depth `0121`, x `563.50`, y `25.45`, state texts `0033`-`0037` (`EXIT`) | `onRelease` runs `unloadMovieNum(1)` and `gotoAndStop("choose")` |

Runtime: Ruffle cannot start a movie at a label. `assets:shell-reference` therefore promotes `projector-alice-preview.swf` (SHA-256 `c4f8ff3cdb1585a4756107469c05673d803a109a4ed357205be8c8ae3d86a84e`). It is the extracted projector with one change: the frame-1 `ActionGotoFrame` operand changes from 1267 to 1534 (opcode at byte `79520`, operand bytes `79523`-`79524`). The `overturePhase = "alice-preview"` scene plays it through the shared Ruffle layer with a hand cursor, because `aliceSkip` covers the stage. A primary mouse release anywhere, or the transparent keyboard target over the trailer's `EXIT`, returns to the launcher, matching `aliceSkip` and `skipBTN`. With no input, the shell returns 607 frames / 15 fps = 40 467 ms after Ruffle's `loadedmetadata`, i.e. at `aliceJump`. A real `tauri dev` probe measured 40.7 s, with the trailer art and the source `EXIT` visible. If Ruffle fails, the launcher returns immediately. Previously the launcher routed this button into the full Alice puzzle game (the large clock), which has no exit; that was the dead end Marcus hit on 2026-11-06. The trailer's `EXIT` rollover colours are not shown, because pointer events go to the shell layer instead of Ruffle.

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

The source-coordinate hotspots stay over that recovered composite. Every listed activity now maps to a reconstructed local route; no visible playRoom activity is intentionally left as a dead or disabled source button.

### Live room and loadGame boundary (since 2026-11-06, JIP-1537, JIP-1538)

The room is now the live projector, so the composite and the DOM hotspots above are only the Ruffle-failure fallback (`tabindex="-1"` while live). The source flow, from `actions.txt`:

1. `nut.onRelease` → `gotoAndPlay("nutIni")` (root frame 2144). That frame defines `updateKeys()` and runs `loadVariables("games/data/gamekeys.txt", "_level0")`. Frame 2152 then branches: `collectedKeys == 9` goes to `holdToReset` (the reset prompt with `FSCommand:exec reset*.exe`), `0` goes to `ini`, anything else to `nutKeys`. The props then animate in on the root timeline up to frame 2377.
2. Root frame 2378 `playRoom` defines `loadGame(game, kind)` and `updateKeys()`, then loads `games/keycontroller.swf` into `_level2`, sets `maxKeys = 9`, and stops.
3. A hotspot calls `_root.loadGame(path, "g"|"a")`, which sets `comingFrom`, `nextGame`, and plays `bye` (frame 2380). Frame 2383 runs `loadMovie(nextGame, "_level1")`, `stop()`, `_level0._visible = 0`, or with `doExit == 1` jumps to the `exitNow` outro.
4. A game returned by setting `_level0.gameKeyN = 1`, calling `FSCommand:exec saveKeyN.exe`, then `_level0.gotoAndPlay("comeAgain")` (for example `memory.swf` and `story.swf`). Frame 2384 `comeAgain` unloads `_level1`, calls `updateKeys()`, and shows `_level0`. Frame 2386 clears `nextGame` and returns to `playRoom`.

Shell boundary (`app/src/flash/projectorBridge.ts`):

- Ruffle resolves the projector's relative URLs against `/__projector/`, and a `window.fetch` wrapper answers them.
- `gamekeys.txt` comes from the progress store in the install format (`&gameKey1=0…&EOF=1`). The nine-key `nutButton` (sprite `0671`) therefore uses its own `collectedKeys == 9` gate.
- Each `loadGame` movie, plus `games/nutcrackergame/nutchooser.swf`, gets a generated three-frame stand-in SWF while the shell opens the matching route. The projector stays paused and hidden behind that route.
- When the route returns to the room, the stand-in receives `ret=1` plus the current keys, copies them into `_level0`, and calls `_level0.gotoAndPlay("comeAgain")`, as the original games did. The props settle and the room is live again.
- `FSCommand:exec resetgameKeys.exe`, `resetCADoors.exe`, `resetopenDoors.exe`, and `resetdoorsKeys.exe` map to the progress-store resets for game keys, Children's Album doors, NutHouse rooms, and Nutcracker doors.
- `games/keycontroller.swf` is not in the recovered install and gets a 404.
- Opening the room from the route map while the projector is on the launcher restarts the projector with its frame-1 `GotoFrame` patched in memory to 2143 (`nutIni`).

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
