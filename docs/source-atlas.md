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
| `nutcracker-chooser` | Full official-Ruffle normal frame, exact id-0085 door hit bounds, hash-locked id-0080 opened-door crop/matrices, source-conditional key, documented nested-timeline fallback, manual review open | `games/nutcrackergame/nutchooser.swf` | JIP-334, JIP-347, JIP-349, JIP-357, JIP-359 |
| `song-1` … `song-8` | Source-backed, actor/timeline fallback and manual review open | `games/nutcrackergame/song*/` | JIP-335, JIP-347, JIP-349, JIP-357, JIP-358, JIP-359 |

The twelve hand-made room-game routes (`childrens-album` through `nut-house`) were removed on 2026-11-06; the music room plays those games from the restored CD.

## Auxiliary source families

| Activity | Source | Source-first slices |
| --- | --- | --- |
| Key 1 certificate reward | certificate projector EXEs in `fscommand/` | JIP-336, manual print/PDF review |

## Audit conclusions

- The opening shell now preserves the intro → source chooser → `playRoom` lifecycle, and the menu restores recoverable projector foreground art instead of showing the empty room JPEG. The three readers, all 18 Musictionary fact/help states, and the 16-record Listening Room now use complete source-runtime captures instead of invented page/player chrome. JIP-818, JIP-819, and JIP-820 retain their own manual approval gates.
- M06 chooser/song work has durable source classifications and approval evidence, but exact timeline/manual gates remain open.
- The M07 and M08 routes and their atlas entries were removed on 2026-11-06. The music room plays those games as the original movies from the restored CD, so they no longer need atlas coverage.
- JIP-345 release QA remains blocked by JIP-360 and must use this matrix/contact sheet rather than rediscover route coverage at packaging time.
