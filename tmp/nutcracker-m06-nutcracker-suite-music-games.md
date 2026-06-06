Please follow the `linear-project-workflow` skill.

We are working in `/Users/marcus.salinas/Documents/Tchaikovsky Nutcracker The Music Game`. If this is a Revo project workspace, keep using this same workspace for the next milestone; do not create a new Revo workspace unless Marcus explicitly asks.
Database: N/A
Rails command prefix: N/A
Linear project: `Tchaikovsky Nutcracker Music Game Desktop Remake` - `https://linear.app/jippylong12/project/tchaikovsky-nutcracker-music-game-desktop-remake-1a8f40b61a9b`
Linear milestone context: `M06 Nutcracker Suite Music Games`
Use this project as the source of truth. Do not select work from the global Linear issue list unless Marcus explicitly asks for global triage.

Completed locally, pending Linear closeout after auth refresh:
- `JIP-331`: Recreate story, biography, and ballet history activities
- `JIP-332`: Recreate the music dictionary encyclopedia activity
- `JIP-333`: Recreate the Nutcracker Suite listening player

Relevant code references:
- `66f0593`: committed M05 implementation as `Implement Nutcracker reference activities`.
- `app/src/data/referenceContent.ts`: recovered reading activity text/pages, Music Dictionary instrument audio mappings, and Nutcracker Suite track metadata.
- `app/src/app.ts`: reference reader, Music Dictionary browser, Nutcracker Suite listening player, icon play controls, and stop/resume behavior.
- `app/src/styles.css`: reference activity, dictionary, Suite player, and wider desktop route-map layout styling.
- `app/src/tests/app.test.ts`: regression coverage for reading images, dictionary clip mappings, Suite play/stop behavior, and route layout content.

Current context:
- M05 was UI work. Marcus manually approved the latest UI fixes in the Codex thread on 2026-06-06.
- Automated validation passed before commit: `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` from `app/`.
- The committed app references local/private recovered media under `app/public/local-media`; those generated media files remain intentionally ignored by git.
- Linear closeout could not be completed in Codex because the Linear connector returned `401 token_expired`.
- No Browser, in-app browser, browser-use tooling, or browser automation should be used unless Marcus explicitly asks for Browser in the current request.
- The web frontend exists only as the packaged desktop app core; do not add a public hosting/deploy workflow.
- Current branch is `main`.

Recommended next milestone pass:
- `JIP-334`: Recreate Nutcracker song chooser and door progression - `https://linear.app/jippylong12/issue/JIP-334/recreate-nutcracker-song-chooser-and-door-progression`
- `JIP-335`: Recreate eight Nutcracker track-selection song games - `https://linear.app/jippylong12/issue/JIP-335/recreate-eight-nutcracker-track-selection-song-games`

Do not work on these adjacent-milestone issues in this pass:
- `JIP-337` through `JIP-342`: mini-game batches; M07/M08, after M06 song chooser and Nutcracker song-game flows.
- `JIP-343` through `JIP-345`: packaging QA/release candidate; M09, after gameplay/content milestones.

Validation already run for M05:
- `npm run typecheck` in `app`: passed.
- `npm test` in `app`: passed; 5 test files / 26 tests.
- `npm run lint` in `app`: passed.
- `npm run build` in `app`: passed.

UI/manual verification:
- Marcus manually approved the M05 UI after the Suite play button visibility, route-map layout, and Suite stop/resume fixes.
- M06 is UI/gameplay work. Run automated validation, provide a concrete manual test script, and wait for Marcus's manual approval before moving M06 issues to Done.

Closeout state:
- Code commit exists: `66f0593`.
- This handoff file was created after the M05 implementation commit to capture the next milestone path and the pending Linear closeout blocker.
- M05 Linear issue closeout is still pending: once Linear auth is refreshed, comment on `JIP-331`, `JIP-332`, and `JIP-333` with the M05 validation evidence and Marcus approval, then move them to Done.
- After M05 Linear closeout, inspect the Linear project and milestone order before beginning M06.

Please inspect the current Linear project, milestone, issue bodies, and existing code first, then implement the next milestone pass in order. Apply the work-state completion rules: investigation-only and non-UI code may update/complete Linear after evidence; UI code must provide a concrete manual test script and wait for Marcus's manual approval before moving issues to Done.
