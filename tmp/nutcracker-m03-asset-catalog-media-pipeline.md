Please follow the `linear-project-workflow` skill.

We are working in `/Users/marcus.salinas/Documents/Tchaikovsky Nutcracker The Music Game`. If this is a Revo project workspace, keep using this same workspace for the next milestone; do not create a new Revo workspace unless Marcus explicitly asks.
Database: N/A
Rails command prefix: N/A
Linear project: `Tchaikovsky Nutcracker Music Game Desktop Remake` - `https://linear.app/jippylong12/project/tchaikovsky-nutcracker-music-game-desktop-remake-1a8f40b61a9b`
Linear milestone context: `M03 Asset Extraction Catalog and Media Pipeline`
Use this project as the source of truth. Do not select work from the global Linear issue list unless Marcus explicitly asks for global triage.

Completed and updated in Linear:
- `JIP-318`: Inventory extracted ISO, installer, SWFs, media, and helper executables
- `JIP-319`: Recover navigation, progress, and fscommand behavior from representative SWFs
- `JIP-320`: Choose remake architecture and write implementation spec
- `JIP-321`: Define asset rights and local distribution constraints
- `JIP-322`: Scaffold the desktop-first TypeScript application
- `JIP-323`: Configure validation and CI-like local checks
- `JIP-324`: Prove macOS app and DMG packaging path

Relevant code references:
- `docs/source-inventory.md`: recovered source map, extraction/tooling notes, counts, entrypoints, activities/games, text data, and fscommand helper groups.
- `docs/behavior-map.md`: representative SWF behavior map for `flute_intro.swf`, `nutchooser.swf`, `tree.swf`, and `trivia.swf`; includes modern progress/state mappings.
- `docs/remake-architecture-spec.md`: Tauri + Vite + TypeScript architecture; hybrid DOM/CSS plus Canvas/PixiJS where needed; generated-data flow from `analysis/setup/app` into app manifests/assets.
- `docs/distribution-constraints.md`: original assets remain private/local; do not publicly redistribute SWFs, MP3/WAV, original text, SWF-derived exports, or helper EXEs.
- `app/`: new Tauri desktop app scaffold.
- `app/src/app.ts`: project-specific 640x480 desktop shell and foundation route preview.
- `app/src/state/progressStore.ts`: initial typed progress-store shape for game keys, Nutcracker doors, Children's Album doors, and Nut House open-door state.
- `app/src/assets/local/README.md` and `app/src/data/README.md`: placeholders for selected normalized private/local assets and generated typed data.
- `app/package.json`: validation and package scripts, including `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run package:mac`.
- `app/src-tauri/tauri.conf.json`: macOS-oriented app metadata and app/DMG bundle targets.

Current context:
- The ISO has been extracted into `analysis/iso`.
- The Inno Setup installer has been extracted into `analysis/setup/app`.
- Confirmed extracted app shape from M01: 200 SWFs, 187 MP3s, 3 WAVs, 19 text files, 48 Windows helper EXEs, and 8 `.bak` files.
- `Nutcracker2.exe` is a Windows Flash projector and must not be a remake runtime dependency.
- M02 scaffold is in `app/`; generated dependency/build outputs (`app/node_modules`, `app/dist`, `app/src-tauri/gen`, and `app/src-tauri/target`) are ignored.
- M02 produced private unsigned package artifacts:
  - `/Users/marcus.salinas/Documents/Tchaikovsky Nutcracker The Music Game/app/src-tauri/target/release/bundle/macos/Nutcracker Music Game.app`
  - `/Users/marcus.salinas/Documents/Tchaikovsky Nutcracker The Music Game/app/src-tauri/target/release/bundle/dmg/Nutcracker Music Game_0.1.0_aarch64.dmg`
- Do not use Browser, in-app browser, browser-use tooling, or browser automation unless Marcus explicitly asks for Browser in the current request.
- Do not add public hosting/deploy workflow. The web frontend exists only as the packaged desktop app core.
- Preserve `analysis/` and `base/` as local recovered source/reference material. Do not blindly copy the full extracted app into `app/src/assets`.

Recommended next milestone pass:
- `JIP-325`: Build SWF asset extraction and catalog pipeline - `https://linear.app/jippylong12/issue/JIP-325/build-swf-asset-extraction-and-catalog-pipeline`
- `JIP-326`: Normalize external audio and text data for bundled local use - `https://linear.app/jippylong12/issue/JIP-326/normalize-external-audio-and-text-data-for-bundled-local-use`
- `JIP-327`: Create visual asset import strategy for Flash timelines - `https://linear.app/jippylong12/issue/JIP-327/create-visual-asset-import-strategy-for-flash-timelines`

Do not work on these adjacent-milestone issues in this pass:
- `JIP-328`: Recreate the 640x480 desktop game shell and navigation model; M04, after asset catalog/media pipeline.
- `JIP-329`: Implement local save/progress store replacing fscommand helper EXEs; M04, after asset catalog/media pipeline.
- `JIP-330`: Implement shared audio playback, preload, and mute/volume controls; M04, after asset catalog/media pipeline.

Validation already run:
- `npm run dev -- --host 127.0.0.1` in `app`: Vite reported ready at `http://127.0.0.1:1420/`; server was stopped after the check.
- `npm run lint` in `app`: passed.
- `npm run typecheck` in `app`: passed.
- `npm test` in `app`: 2 test files / 4 tests passed.
- `npm run build` in `app`: passed.
- `cargo check` in `app/src-tauri`: passed.
- `npm run package:mac` in `app`: passed and produced unsigned `.app` and `.dmg` artifacts.

UI/manual verification:
- M02 UI shell was approved by Marcus in the Codex thread after the manual test script was provided.

Closeout state:
- M02 issues `JIP-322`, `JIP-323`, and `JIP-324` have Linear evidence comments and are Done.
- Current workspace has untracked scaffold/source deliverables under `app/`, plus previously untracked recovered source directories (`analysis/`, `base/`), docs, and `tmp/`.
- No commit or staging was performed.

Please inspect the current Linear project, milestone, issue bodies, and existing code first, then implement the next milestone pass in order. Apply the work-state completion rules: investigation-only and non-UI code may update/complete Linear after evidence; UI code must provide a concrete manual test script and wait for Marcus's manual approval before moving issues to Done.
