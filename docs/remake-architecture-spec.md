# Remake Architecture Spec

Linear issue: JIP-320

## Decision

Use a Tauri desktop shell with a TypeScript web game core.

Primary stack:

| Layer | Choice | Reason |
| --- | --- | --- |
| Desktop shell | Tauri | Produces small local desktop apps, supports macOS app/DMG packaging, and keeps Windows/Linux builds possible without making a public website the product. |
| Frontend | Vite + TypeScript | Fast local iteration, simple asset bundling, good fit for a fixed-size game shell. |
| UI/game rendering | Hybrid DOM/CSS + Canvas/PixiJS where needed | Menus, reading activities, forms, and audio players can use DOM. Timeline-heavy games and sprite-heavy mini-games can use Canvas/PixiJS. |
| State | Typed local store plus Tauri app-data persistence | Replaces Flash `_level0` globals and Windows text-file mutations. |
| Assets | Local bundled extracted/normalized assets | Original media remains local; generated exports should be cataloged before copying into app assets. |
| Tests | Vitest for parsers/state; build/typecheck scripts; later Playwright only if Marcus asks or if non-browser UI validation is insufficient | Keeps validation repeatable without requiring browser automation by default. |

Fallback:

| Stack | When to use |
| --- | --- |
| Electron + Vite + TypeScript | Use only if Tauri packaging, media playback, or filesystem/app-data permissions become a blocking problem. Electron is heavier but predictable for web-tech games and cross-platform desktop packaging. |

Do not use a hosted public website as the release artifact. A web build can exist only as an internal implementation detail for local desktop packaging and tests.

## Stack Comparison

| Option | Strengths | Weaknesses | Fit |
| --- | --- | --- | --- |
| Tauri | Small bundle, macOS app/DMG path, local filesystem APIs, cross-platform builds, web UI core | Requires Rust toolchain and Tauri packaging setup; media/path permissions need early proof | Best primary fit |
| Electron | Mature desktop packaging, broad media support, simpler Node integration | Large app size, heavier runtime, more dependency/security surface | Best fallback |
| Minimal native shell | Native look/performance, small runtime | Recreating many Flash-style timelines, audio interactions, and content views natively would be slow and less testable | Poor fit for this remake |

## Rendering Approach

Use a fixed 640x480 game viewport for original gameplay/activity scenes, centered within a desktop window.

The renderer column below chooses technology, not visual design. Every visible route must first satisfy `docs/source-atlas.md`: source assets/text/placements before DOM/CSS approximations, exact fallback documentation, and Marcus manual approval.

| Content type | Renderer |
| --- | --- |
| Main menu, route shell, help/warning/name dialogs | DOM/CSS |
| Story, biography, ballet history, music dictionary reading/browse screens | DOM/CSS with imported images/audio |
| Gramophone/listening player | DOM/CSS plus audio service |
| Trivia and simple choice games | DOM/CSS or lightweight Canvas only if assets require it |
| Nutcracker song games and animation-heavy mini-games | PixiJS/Canvas once asset extraction proves the best visual form |
| Recreated Flash timeline animations | Prefer sprite sheets/Canvas for animation-heavy scenes; use DOM only for static panels and simple transitions |

This hybrid choice avoids forcing every educational screen into a game engine while still supporting sprite/timeline-heavy games later.

## Project Structure

Recommended scaffold:

```text
.
├── app/
│   ├── package.json
│   ├── src/
│   │   ├── main.ts
│   │   ├── routes/
│   │   ├── scenes/
│   │   ├── state/
│   │   ├── audio/
│   │   ├── data/
│   │   ├── assets/
│   │   └── tests/
│   ├── src-tauri/
│   └── vite.config.ts
├── analysis/
│   ├── iso/
│   └── setup/app/
├── docs/
│   ├── source-inventory.md
│   ├── behavior-map.md
│   ├── remake-architecture-spec.md
│   └── distribution-constraints.md
└── tmp/
```

Keep `analysis/` as recovered source/reference material. Do not blindly copy the full extracted app into app assets. Later asset pipeline work should produce a manifest that links original source paths to normalized app asset paths.

## Data And Asset Bundling

| Source | Modern treatment |
| --- | --- |
| `games/data/*.txt` | Parse into typed fixtures and seed default progress values |
| `games/trivia/questions/*.txt` | Parse into JSON/typed question banks; preserve malformed keys in tests |
| `games/melody/snd/Melody.txt` | Parse into typed melody sequence fixtures |
| `games/nutcrackergame/song*/trackinfo.txt` | Parse into song metadata |
| External MP3/WAV | Bundle locally under app assets after catalog/normalization |
| SWF vector/timeline art | Extract/catalog first; import as sprites, sprite sheets, or hand-recreated scene definitions |
| `fscommand/*.exe` | Do not bundle as runtime dependencies; map responsibilities to app methods |

Recommended generated-data flow:

```text
analysis/setup/app -> extraction/catalog scripts -> generated manifests -> app/src/data + app/src/assets
```

Generated bulky exports should remain out of source control unless explicitly selected as normalized app assets.

## Save State

Replace mutable text files and helper EXEs with one local progress store:

```ts
type ProgressStore = {
  version: 1;
  gameKeys: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, boolean>;
  nutDoors: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, boolean>;
  childrensDoors: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, boolean>;
  nutHouse: { openDoor: number };
};
```

Persistence target: Tauri app data directory. During early M02/M04 development, an in-memory/localStorage adapter is acceptable if wrapped behind the same interface and covered by tests.

## Audio

Use one shared audio service:

| Capability | Requirement |
| --- | --- |
| One-shot effects | For game feedback and button sounds |
| Loop/preview playback | For music previews and repeated patterns |
| Track playback | For the gramophone and Nutcracker Suite |
| Scene cleanup | Stop active scene audio on route transition, matching `StopSounds` behavior |
| Error handling | Surface missing/case-mismatched assets in development |

## Validation Commands

M02 should define these scripts:

```sh
npm run typecheck
npm test
npm run build
npm run tauri:build
```

Expected local aliases after scaffold:

```json
{
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "vite build",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

## Packaging Targets

| Platform | Priority | Target |
| --- | --- | --- |
| macOS | Primary | Local app bundle and DMG or equivalent Tauri macOS bundle |
| Windows | Secondary | Tauri Windows bundle if asset paths/audio behave cleanly |
| Linux | Secondary | Tauri AppImage/deb/rpm only after Mac path is proven |

Private/local unsigned builds are acceptable for preservation use. Signing/notarization should be documented separately from core functionality.

## Milestone Implementation Order

1. M02 Desktop App Foundation and Build Pipeline
2. M03 Asset Extraction Catalog and Media Pipeline
3. M04 Core Shell Navigation and Save System
4. M05 Reference Content Activities
5. M06 Nutcracker Suite Music Games
6. M07 Mini-game Recreation Batch 1
7. M08 Mini-game Recreation Batch 2
8. M09 Packaging QA and Release Candidate

M02 should begin with Tauri/Vite/TypeScript scaffold and validation scripts. M03 should follow before deep game implementation so asset imports and data normalization are repeatable.

## Major Risks

| Risk | Mitigation |
| --- | --- |
| SWF timeline/vector export quality is poor | Use a catalog-first pipeline; choose sprite export, hand recreation, or Canvas/PixiJS per scene |
| Original data contains malformed query-string keys | Preserve raw fixtures and add parser tests before normalization |
| Audio path casing differs across platforms | Normalize manifest paths and test path resolution on macOS before optional Windows/Linux builds |
| Tauri media or filesystem permissions block expected behavior | Prove audio and app-data writes early in M02/M04; fall back to Electron only if blocking |
| Public redistribution rights are unclear | Keep original assets private/local and document release constraints before packaging |
| Flash projector-only helper behavior is incomplete | Map known helpers to app methods; defer exact launcher parity unless required by visible gameplay |
