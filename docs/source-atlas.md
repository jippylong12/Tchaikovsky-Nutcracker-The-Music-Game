# Project-Wide Source Atlas and Route Fidelity Audit

This is the first stop before changing any visible route. The machine-readable coverage contract is `docs/source-atlas.json`; run `npm run assets:source-atlas` from `app/` to validate every registered route/source/evidence path and generate the ignored contact sheet at `app/generated/source-atlas/contact-sheet.html`.

## Gate

No route may start from generic UI when atlas evidence or recoverable source assets exist. Every visible element must be classified as `original asset`, `SWF-derived recreation`, `original source text`, `inferred behavior`, `documented fallback`, or `defect`. A `documented fallback` entry must include structured `fallbackEvidence` with the source path, controlled locator kind plus numbered identifier/state, controlled tool capability plus capability-specific observed failure, controlled runtime mechanism plus retained gap, and evidence document. The validator parses the TypeScript route manifest, fixes the vocabulary/lifecycle semantics in code, and canonicalizes evidence and promoted-asset paths so traversal or symlink escapes cannot self-attest approval. Automated checks do not approve UI/gameplay; Marcus approval remains required.

## Current route coverage

| App route | Current audit state | Primary source | Required follow-up |
| --- | --- | --- | --- |
| `overture` | Source-backed intro still/skip behavior, documented timeline fallback, manual review open | `Nutcracker2.exe`, `flute_intro.swf` | JIP-818 |
| `main-menu` | Exact `playRoom` art/hotspots/key gate, documented flattening fallback, manual review open | projector embedded SWF frame 2378 | JIP-818 |
| `story` | Exact four-spread text/control map and recovered book art, manual review open | `activities/story/story.swf` | JIP-819 |
| `composer-biography` | Exact four-spread text/image/control map, manual review open | `activities/biography/biography.swf` | JIP-819 |
| `ballet-history` | Exact five-spread text/image/control map, manual review open | `activities/ballet/ballet.swf` | JIP-819 |
| `music-dictionary` | Exact source prose/audio ids and NEXT/EXIT sequence, character-timeline fallback, manual review open | `activities/musictionary/musictionary.swf` | JIP-820 |
| `suite` | Promoted gramophone/frame children, exact theme/state actions, timeline fallback, manual review open | `activities/originals/gramophone.swf` | JIP-820 |
| `nutcracker-chooser` | Source-backed, documented playback fallbacks, manual review open | `games/nutcrackergame/nutchooser.swf` | JIP-334, JIP-347, JIP-349, JIP-357, JIP-359 |
| `song-1` … `song-8` | Source-backed, actor/timeline fallback and manual review open | `games/nutcrackergame/song*/` | JIP-335, JIP-347, JIP-349, JIP-357, JIP-358, JIP-359 |
| `childrens-album` | Defect: generic placeholder | `games/childrensalbum/`, door/data files | JIP-836 → JIP-840 |
| `tree-game` | Defect: generic placeholder | `games/tree/` | JIP-831 → JIP-835 |
| `trivia` | Defect: generic placeholder | `games/trivia/` | JIP-821 → JIP-825 |
| `melody` | Defect: generic placeholder | `games/melody/` | JIP-826 → JIP-830 |
| `memory` | Defect: generic placeholder | `games/memorygame/` | JIP-826 → JIP-830 |
| `puzzles` | Defect: generic shared placeholder | `games/aliceSWF/`, `games/nuthouse/` | JIP-846 → JIP-850 |

## Planned source families not yet represented by dedicated routes

| Activity | Source | Source-first slices |
| --- | --- | --- |
| Flying Instruments | `games/flyinginstruments/flyinginstruments.swf` | JIP-831 → JIP-835 |
| Loopy Tunes | `games/loopytunes/` | JIP-836 → JIP-840 |
| Orchestra / Toy Soldiers / Waltz | `games/orchestragame/`, `games/toysoldiersgame/`, `games/wedding/` | JIP-841 → JIP-845 |
| Alice puzzles / Nut House rooms | `games/aliceSWF/`, `games/nuthouse/`, `games/data/nuthouserooms.txt` | JIP-846 → JIP-850 |
| Key 1 certificate reward | certificate projector EXEs in `fscommand/` | JIP-336, manual print/PDF review |

## Audit conclusions

- The shell/reference retrofits now carry durable source classifications and explicit playback/display-list fallbacks. JIP-818 through JIP-820 remain open for Marcus's visual approval, not as generic-UI defects.
- M06 chooser/song work has durable source classifications and approval evidence, but exact timeline/manual gates remain open.
- M07/M08 placeholders are defects, not implementation baselines. Their broad parents now point to five ordered source-reconstruction slices: audit, promotion, behavior, renderer, and approval.
- JIP-345 release QA remains blocked by JIP-360 and must use this matrix/contact sheet rather than rediscover route coverage at packaging time.
