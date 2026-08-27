# Project-Wide Source Atlas and Route Fidelity Audit

This is the first stop before changing any visible route. The machine-readable coverage contract is `docs/source-atlas.json`; run `npm run assets:source-atlas` from `app/` to validate every registered route/source/evidence path and generate the ignored contact sheet at `app/generated/source-atlas/contact-sheet.html`.

## Gate

No route may start from generic UI when atlas evidence or recoverable source assets exist. Every visible element must be classified as `original asset`, `SWF-derived recreation`, `original source text`, `inferred behavior`, `documented fallback`, or `defect`. A `documented fallback` entry must include structured `fallbackEvidence` with the source path, controlled locator kind plus numbered identifier/state, controlled tool capability plus capability-specific observed failure, controlled runtime mechanism plus retained gap, and evidence document. The validator parses the TypeScript route manifest, fixes the vocabulary/lifecycle semantics in code, and canonicalizes evidence and promoted-asset paths so traversal or symlink escapes cannot self-attest approval. Automated checks do not approve UI/gameplay; Marcus approval remains required.

## Current route coverage

| App route | Current audit state | Primary source | Required follow-up |
| --- | --- | --- | --- |
| `overture` | Source-backed intro/skip now reaches the recovered frame-1268 launcher; all launcher controls work; manual review open | `Nutcracker2.exe`, `flute_intro.swf` | JIP-818 |
| `main-menu` | Ruffle-recovered `playRoom` foreground composited over exact JPEG 0518, with exact hotspots/key gate; manual review open | projector embedded SWF frame 2378 | JIP-818 |
| `story` | Four complete Ruffle-recovered spreads, source page hit regions/hover states, narration, and EXIT fade; manual review open | `activities/story/story.swf` | JIP-819 |
| `composer-biography` | Four complete Ruffle-recovered spreads with exact photos/text, source controls, narration, and EXIT fade; manual review open | `activities/biography/biography.swf` | JIP-819 |
| `ballet-history` | Five complete Ruffle-recovered spreads with exact photos/text, source controls, narration, and EXIT fade; manual review open | `activities/ballet/ballet.swf` | JIP-819 |
| `music-dictionary` | Eighteen complete Ruffle-recovered fact states plus exact help/fish states, source hit regions, automatic narration, and NEXT/EXIT sequence; entry-preview/character timeline fallback and manual review open | `activities/musictionary/musictionary.swf` | JIP-820 |
| `suite` | Complete Ruffle-recovered Listening Room, all 16 source records/titles/placements, drag/drop and play/pause state; source-missing theme9-16 and record/tonearm motion gap documented; manual review open | `activities/originals/gramophone.swf` | JIP-820 |
| `nutcracker-chooser` | Source-backed, documented playback fallbacks, manual review open | `games/nutcrackergame/nutchooser.swf` | JIP-334, JIP-347, JIP-349, JIP-357, JIP-359 |
| `song-1` … `song-8` | Source-backed, actor/timeline fallback and manual review open | `games/nutcrackergame/song*/` | JIP-335, JIP-347, JIP-349, JIP-357, JIP-358, JIP-359 |
| `childrens-album` | Eight exact source patterns/titles, bundled song audio, saved doors and key 6; display-list fallback and manual review open | `games/childrensalbum/`, door/data files | JIP-836 → JIP-840 |
| `loopy-tunes` | Eight source-local boards/sound sets with exact tracks 1-3-5-7 and legacy key 3; timeline fallback and manual review open | `games/loopytunes/` | JIP-836 → JIP-840 |
| `orchestra` | Exact 18-instrument source order, prompts/feedback and key 4; display-list fallback and manual review open | `games/orchestragame/orchestra.swf` | JIP-841 → JIP-845 |
| `toy-soldiers` | Promoted field/staff/moving-note/soldier/control/feedback art, exact source positions, 11-slot note map, post-move march check, and separate correct-note demo; drag/help timeline fallback and manual review open | `games/toysoldiersgame/toysoldiersgame.swf` | JIP-841 → JIP-845 |
| `waltz` | Promoted 550 x 400 root probe and automatic one-pass bundled source music, with no invented viewport UI or gameplay; unresolved timeline imagery and manual review open | `games/wedding/waltz.swf`, `MP3Wedding3.wav` | JIP-841 → JIP-845 |
| `tree-game` | Promoted source scene/character/key art, exact 12 placements, prompt-locked rounds, three sequential sound levels, and final key 8 gate; nested animation fallback and manual review open | `games/tree/tree.swf`, `Snd_1`…`Snd_3` | JIP-831 → JIP-835 |
| `flying-instruments` | Dedicated source-backed route with 16 instrument images, embedded sounds and 3 level states; grid-motion fallback and manual review open | `games/flyinginstruments/flyinginstruments.swf` | JIP-831 → JIP-835 |
| `trivia` | Source book, 106 questions, exact controls/counters and embedded feedback/key flow; timeline fallback and manual review open | `games/trivia/trivia.swf`, `questions/trivia.txt` | JIP-821 → JIP-825 |
| `melody` | Source stage, recovered monkey/xylophone and piano art, 36 sequences, exact selector/play split, note audio and keyboard state; nested animation fallback and manual review open | `games/melody/melody.swf`, `snd/Melody.txt` | JIP-826 → JIP-830 |
| `memory` | Source card art/audio and 5-to-18-pair progression; card-timeline fallback and manual review open | `games/memorygame/memory.swf` | JIP-826 → JIP-830 |
| `alice-puzzles` | Original post-intro clock chooser, twelve complete source-runtime puzzle stages, recovered gear/dial controls, and exact automatic three-clock solution check; random angle mapping, live toy/character motion, timeline-motion fallback, and manual review open | `games/aliceswf/` | JIP-846 → JIP-850 |
| `nut-house` | Eight source rooms, exact mirror sequence, persisted room state and key 7; display-list fallback and manual review open | `games/nuthouse/`, `games/data/nuthouserooms.txt` | JIP-846 → JIP-850 |

## Auxiliary source families

| Activity | Source | Source-first slices |
| --- | --- | --- |
| Key 1 certificate reward | certificate projector EXEs in `fscommand/` | JIP-336, manual print/PDF review |

## Audit conclusions

- The opening shell now preserves the intro → source chooser → `playRoom` lifecycle, and the menu restores recoverable projector foreground art instead of showing the empty room JPEG. The three readers, all 18 Musictionary fact/help states, and the 16-record Listening Room now use complete source-runtime captures instead of invented page/player chrome. JIP-818, JIP-819, and JIP-820 retain their own manual approval gates.
- M06 chooser/song work has durable source classifications and approval evidence, but exact timeline/manual gates remain open.
- M07 and M08 routes are source-backed review surfaces with exact automated evidence and retained Marcus approval gates. Alice and Nut House now use hash-locked official-Ruffle captures where SWFTools cannot resolve their full display lists; remaining static-capture motion/timeline gaps stay documented rather than being replaced with generic UI.
- JIP-345 release QA remains blocked by JIP-360 and must use this matrix/contact sheet rather than rediscover route coverage at packaging time.
