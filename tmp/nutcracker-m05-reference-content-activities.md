Please follow the `linear-project-workflow` skill.

We are working in `/Users/marcus.salinas/Documents/Tchaikovsky Nutcracker The Music Game`. If this is a Revo project workspace, keep using this same workspace for the next milestone; do not create a new Revo workspace unless Marcus explicitly asks.
Database: N/A
Rails command prefix: N/A
Linear project: `Tchaikovsky Nutcracker Music Game Desktop Remake` - `https://linear.app/jippylong12/project/tchaikovsky-nutcracker-music-game-desktop-remake-1a8f40b61a9b`
Linear milestone context: `M05 Reference Content Activities`
Use this project as the source of truth. Do not select work from the global Linear issue list unless Marcus explicitly asks for global triage.

Completed and updated in Linear:
- `JIP-328`: Recreate the 640x480 desktop game shell and navigation model
- `JIP-329`: Implement local save/progress store replacing fscommand helper EXEs
- `JIP-330`: Implement shared audio playback, preload, and mute/volume controls

Relevant code references:
- `app/src/routes.ts`: typed route catalog now includes placeholder entries for story, composer biography, ballet history, music dictionary, Nutcracker Suite, song-door routes, Children's Album, and mini-games.
- `app/src/app.ts`: fixed 640x480 desktop shell, route transitions, main menu launch cards, back/menu/help actions, progress side panel, audio side panel, and route cleanup via `audio.stopSceneAudio()`.
- `app/src/state/progressStore.ts`: persisted local progress controller for game keys, Nutcracker doors, Children's Album doors, Nut House open-door state, reset helpers, and malformed-save normalization.
- `app/src/audio/audioService.ts`: shared HTMLAudio-backed service for preload, one-shot, loop/track playback, stop, route cleanup, mute, volume, and diagnostics.
- `app/src/styles.css`: M04 shell styling; Marcus found a main-menu clipping issue and it was fixed by tightening group/card sizing so all menu groups fit above the footer.
- `app/src/tests/app.test.ts`, `app/src/tests/progressStore.test.ts`, `app/src/tests/audioService.test.ts`: automated coverage for shell navigation, progress persistence/resets, and audio state transitions.

Current context:
- M04 is complete in Linear; `JIP-328`, `JIP-329`, and `JIP-330` were moved to Done after Marcus manually approved the UI.
- The M04 visible menu cards are placeholders, not final activity UI. M05 should replace reference-content placeholders with recovered activity-specific content and interaction.
- No Browser, in-app browser, browser-use tooling, or browser automation should be used unless Marcus explicitly asks for Browser in the current request.
- The web frontend exists only as the packaged desktop app core; do not add a public hosting/deploy workflow.
- Current branch is `main`.
- No commit or staging was performed.
- Current workspace is dirty with untracked app scaffold/source deliverables, docs, and tmp handoff files from prior milestone passes; this is expected.

Recommended next milestone pass:
- `JIP-331`: Recreate story, biography, and ballet history activities - `https://linear.app/jippylong12/issue/JIP-331/recreate-story-biography-and-ballet-history-activities`
- `JIP-332`: Recreate the music dictionary encyclopedia activity - `https://linear.app/jippylong12/issue/JIP-332/recreate-the-music-dictionary-encyclopedia-activity`
- `JIP-333`: Recreate the Nutcracker Suite listening player - `https://linear.app/jippylong12/issue/JIP-333/recreate-the-nutcracker-suite-listening-player`

Do not work on these adjacent-milestone issues in this pass:
- `JIP-334`: Recreate Nutcracker song chooser and door progression; M06, after M05 reference/listening activities.
- `JIP-335`: Recreate eight Nutcracker track-selection song games; M06, after chooser/listening foundations.
- `JIP-337` through `JIP-342`: mini-game batches; M07/M08, after M05/M06 content and song flows.
- `JIP-343` through `JIP-345`: packaging QA/release candidate; M09, after gameplay/content milestones.

Validation already run after the final M04 UI fix:
- `npm run typecheck` in `app`: passed.
- `npm test` in `app`: passed; 5 test files / 20 tests.
- `npm run lint` in `app`: passed.
- `npm run build` in `app`: passed.

UI/manual verification:
- Marcus manually approved the M04 UI after the main-menu clipping fix.
- M05 is UI work. Run automated validation, provide a concrete manual test script, and wait for Marcus's manual approval before moving M05 issues to Done.

Closeout state:
- M04 issues `JIP-328`, `JIP-329`, and `JIP-330` have Linear evidence comments and are Done.
- The Vite dev server may still be running from the M04 review at `http://127.0.0.1:1420/`; verify before assuming it is active.
- No code handoff actions, staging, commits, workspace cleanup, or project closeout were performed.

Please inspect the current Linear project, milestone, issue bodies, and existing code first, then implement the next milestone pass in order. Apply the work-state completion rules: investigation-only and non-UI code may update/complete Linear after evidence; UI code must provide a concrete manual test script and wait for Marcus's manual approval before moving issues to Done.
