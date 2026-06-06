Please follow the `linear-project-workflow` skill.

We are working in `/Users/marcus.salinas/Documents/Tchaikovsky Nutcracker The Music Game`. If this is a Revo project workspace, keep using this same workspace for the next milestone; do not create a new Revo workspace unless Marcus explicitly asks.
Database: N/A
Rails command prefix: N/A
Linear project: `Tchaikovsky Nutcracker Music Game Desktop Remake` - `https://linear.app/jippylong12/project/tchaikovsky-nutcracker-music-game-desktop-remake-1a8f40b61a9b`
Linear milestone context: `M02 Desktop App Foundation and Build Pipeline`
Use this project as the source of truth. Do not select work from the global Linear issue list unless Marcus explicitly asks for global triage.

Completed and updated in Linear:
- `JIP-318`: Inventory extracted ISO, installer, SWFs, media, and helper executables
- `JIP-319`: Recover navigation, progress, and fscommand behavior from representative SWFs
- `JIP-320`: Choose remake architecture and write implementation spec
- `JIP-321`: Define asset rights and local distribution constraints

Relevant code references:
- `docs/source-inventory.md`: recovered source map, extraction/tooling notes, counts, entrypoints, activities/games, text data, and fscommand helper groups.
- `docs/behavior-map.md`: representative SWF behavior map for `flute_intro.swf`, `nutchooser.swf`, `tree.swf`, and `trivia.swf`; includes modern progress/state mappings.
- `docs/remake-architecture-spec.md`: M01 architecture decision. Primary stack is Tauri + Vite + TypeScript; fallback is Electron + Vite + TypeScript. Rendering is hybrid DOM/CSS plus Canvas/PixiJS where needed.
- `docs/distribution-constraints.md`: private/local preservation distribution note and packaging constraints.

Current context:
- The ISO has been extracted into `analysis/iso`.
- The Inno Setup installer has been extracted into `analysis/setup/app`.
- Confirmed extracted app shape: 200 SWFs, 187 MP3s, 3 WAVs, 19 text files, 48 Windows helper EXEs, and 8 `.bak` files.
- `Nutcracker2.exe` is a Windows Flash projector and must not be a remake runtime dependency.
- The chosen M02 scaffold direction is a local desktop app, primary target macOS app/DMG, with Windows/Linux optional if Tauri supports them cleanly.
- Do not add public hosting/deploy workflow. The web frontend exists only as the packaged desktop app core.
- Do not use Browser, in-app browser, browser-use tooling, or browser automation unless Marcus explicitly asks for Browser in the current request.

Recommended next milestone pass:
- `JIP-322`: Scaffold the desktop-first TypeScript application - `https://linear.app/jippylong12/issue/JIP-322/scaffold-the-desktop-first-typescript-application`
- `JIP-323`: Configure validation and CI-like local checks - `https://linear.app/jippylong12/issue/JIP-323/configure-validation-and-ci-like-local-checks`
- `JIP-324`: Prove macOS app and DMG packaging path - `https://linear.app/jippylong12/issue/JIP-324/prove-macos-app-and-dmg-packaging-path`

Do not work on these adjacent-milestone issues in this pass:
- `JIP-325`: Build SWF asset extraction and catalog pipeline; M03, after app foundation.
- `JIP-326`: Normalize external audio and text data for bundled local use; M03, after app foundation.
- `JIP-327`: Create visual asset import strategy for Flash timelines; M03, after app foundation.

Validation already run:
- `find analysis/setup/app -type f | awk ...`: confirmed extracted asset counts.
- `file analysis/setup/app/Nutcracker2.exe analysis/iso/Setup.exe analysis/setup/app/flute_intro.swf analysis/setup/app/games/nutcrackergame/nutchooser.swf analysis/setup/app/games/tree/tree.swf analysis/setup/app/games/trivia/trivia.swf`: confirmed projector/installer/SWF file types.
- `swfdump -a ... | rg -n 'GetUrl2|FSCommand|gotoAnd|games/|gameKey|door|_level'`: confirmed representative SWF behavior for M01.
- `strings -a analysis/setup/app/fscommand/*.exe`: confirmed fscommand helper data-file responsibilities.
- `rg -n 'Nutcracker2\.exe|flute_intro\.swf|nutchooser\.swf|tree\.swf|trivia\.swf|saveKey8\.exe|saveKey9\.exe|games/data/nutdoors\.txt|Tauri|DMG|private/local|JIP-324|JIP-343|JIP-344|JIP-345' docs`: confirmed M01 docs cover acceptance-critical paths/topics.
- `git diff --check`: passed.

UI/manual verification:
- No UI was changed in M01.
- M02 includes `ui-work` issue `JIP-322`; if user-facing app shell/UI changes are made, run automated validation and provide a concrete manual test script, then wait for Marcus's manual approval before moving UI issues to Done.

Closeout state:
- M01 issues `JIP-318`, `JIP-319`, `JIP-320`, and `JIP-321` have Linear evidence comments and are Done.
- Current workspace has untracked recovered source directories (`analysis/`, `base/`), `tmp/`, and the new `docs/` deliverables. Preserve unrelated/source assets; do not clean up or delete them unless Marcus explicitly asks.
- No commit or staging was performed.

Please inspect the current Linear project, milestone, issue bodies, and existing code first, then implement the next milestone pass in order. Apply the work-state completion rules: investigation-only and non-UI code may update/complete Linear after evidence; UI code must provide a concrete manual test script and wait for Marcus's manual approval before moving issues to Done.
