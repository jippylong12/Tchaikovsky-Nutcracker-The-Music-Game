Please follow the `linear-project-workflow` skill.

We are working in `/Users/marcus.salinas/Documents/Tchaikovsky Nutcracker The Music Game`. If this is a Revo project workspace, keep using this same workspace for the next milestone; do not create a new Revo workspace unless Marcus explicitly asks.
Database: N/A
Rails command prefix: N/A
Linear project: `Tchaikovsky Nutcracker Music Game Desktop Remake` - `https://linear.app/jippylong12/project/tchaikovsky-nutcracker-music-game-desktop-remake-1a8f40b61a9b`
Linear milestone context: `M04 Core Shell Navigation and Save System`
Use this project as the source of truth. Do not select work from the global Linear issue list unless Marcus explicitly asks for global triage.

Completed and updated in Linear:
- `JIP-325`: Build SWF asset extraction and catalog pipeline
- `JIP-326`: Normalize external audio and text data for bundled local use
- `JIP-327`: Create visual asset import strategy for Flash timelines

Relevant code references:
- `app/scripts/generate-asset-pipeline.mjs`: repeatable M03 generator for SWF catalogs, media manifests, local bundle copies, and visual sample fixtures.
- `app/src/data/generated/swfAssetCatalog.ts`: safe generated SWF catalog for 200 SWFs, including representative flags, extracted object IDs, named assets when available, planned private export paths, and manual reconstruction notes.
- `app/src/data/generated/mediaManifest.ts`: safe generated metadata for 190 audio files and 19 text files, with normalized `/local-media/...` bundle paths.
- `app/src/data/generated/visualImportSamples.ts`: proof fixture metadata for one navigation screen and one game screen.
- `app/src/data/flashVariables.ts`: typed helpers for Flash `loadVariables` text, progress flags, trivia questions, and melody sequences.
- `app/src/data/mediaCatalog.ts`: media manifest lookup/path helpers and case-conflict detection.
- `docs/asset-catalog-pipeline.md`: command and output boundaries for M03.
- `docs/generated-asset-catalog-summary.md`: generated catalog totals and representative SWF summary.
- `docs/visual-asset-import-strategy.md`: M03 import strategy for bitmaps, vectors, timelines, ActionScript, fonts, and text.
- `.gitignore`: keeps `app/generated/`, `app/public/local-media/audio/`, and `app/public/local-media/text/` private/ignored.

Current context:
- M03 is complete in Linear; milestone progress is 100%.
- The repeatable command is `cd app && npm run assets:pipeline`.
- The generator currently catalogs 200 SWFs, 190 external audio files, and 19 text files.
- Ignored private/generated output currently exists locally:
  - `app/generated/` (~3.3 MB)
  - `app/public/local-media/` (~113 MB)
- Safe generated TypeScript manifests are tracked under `app/src/data/generated/`.
- Private original/recovered source material remains under ignored `analysis/` and `base/`.
- Do not use Browser, in-app browser, browser-use tooling, or browser automation unless Marcus explicitly asks for Browser in the current request.
- Do not add public hosting/deploy workflow. The web frontend exists only as the packaged desktop app core.

Recommended next milestone pass:
- `JIP-328`: Recreate the 640x480 desktop game shell and navigation model - `https://linear.app/jippylong12/issue/JIP-328/recreate-the-640x480-desktop-game-shell-and-navigation-model`
- `JIP-329`: Implement local save/progress store replacing fscommand helper EXEs - `https://linear.app/jippylong12/issue/JIP-329/implement-local-saveprogress-store-replacing-fscommand-helper-exes`
- `JIP-330`: Implement shared audio playback, preload, and mute/volume controls - `https://linear.app/jippylong12/issue/JIP-330/implement-shared-audio-playback-preload-and-mutevolume-controls`

Do not work on these adjacent-milestone issues in this pass:
- `JIP-331`: Recreate story, biography, and ballet history activities; M05, after core shell/save/audio.
- `JIP-332`: Recreate the music dictionary encyclopedia activity; M05, after core shell/save/audio.
- `JIP-333`: Recreate the Nutcracker Suite listening player; M05, after core shell/save/audio.
- `JIP-334`: Recreate Nutcracker song chooser and door progression; M06, blocked on M04 shell/save/audio.

Validation already run:
- `npm run assets:pipeline` in `app`: passed; cataloged 200 SWFs, 190 audio files, and 19 text files.
- `npm run lint` in `app`: passed.
- `npm run typecheck` in `app`: passed.
- `npm test` in `app`: 4 test files / 12 tests passed.
- `npm run build` in `app`: passed.

UI/manual verification:
- No UI behavior changed in M03.
- M04 includes UI work (`JIP-328`, and likely `JIP-330` controls). Run automated validation, provide a concrete manual test script, and wait for Marcus's manual approval before moving UI issues to Done.

Closeout state:
- M03 issues `JIP-325`, `JIP-326`, and `JIP-327` have Linear evidence comments and are Done.
- No commit or staging was performed.
- Current branch is `main`.
- Current workspace is dirty with untracked app scaffold/source deliverables, docs, and tmp handoff files from M02/M03/M04; this is expected from prior milestone passes.

Please inspect the current Linear project, milestone, issue bodies, and existing code first, then implement the next milestone pass in order. Apply the work-state completion rules: investigation-only and non-UI code may update/complete Linear after evidence; UI code must provide a concrete manual test script and wait for Marcus's manual approval before moving issues to Done.
