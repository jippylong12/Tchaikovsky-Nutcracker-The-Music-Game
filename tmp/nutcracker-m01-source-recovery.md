Please follow the `linear-project-workflow` skill.

Work in the current repository/workspace at `/Users/marcus.salinas/Documents/Tchaikovsky Nutcracker The Music Game`.
Database: N/A
Rails command prefix: N/A
Linear project: `Tchaikovsky Nutcracker Music Game Desktop Remake` - https://linear.app/jippylong12/project/tchaikovsky-nutcracker-music-game-desktop-remake-1a8f40b61a9b
Linear milestone: `M01 Source Recovery and Remake Spec`
Use this project as the source of truth. Do not select work from the global Linear issue list unless Marcus explicitly asks for global triage.

Implement this Linear milestone pass in order:
- `JIP-318`: Inventory extracted ISO, installer, SWFs, media, and helper executables - https://linear.app/jippylong12/issue/JIP-318/inventory-extracted-iso-installer-swfs-media-and-helper-executables
- `JIP-319`: Recover navigation, progress, and fscommand behavior from representative SWFs - https://linear.app/jippylong12/issue/JIP-319/recover-navigation-progress-and-fscommand-behavior-from-representative
- `JIP-320`: Choose remake architecture and write implementation spec - https://linear.app/jippylong12/issue/JIP-320/choose-remake-architecture-and-write-implementation-spec
- `JIP-321`: Define asset rights and local distribution constraints - https://linear.app/jippylong12/issue/JIP-321/define-asset-rights-and-local-distribution-constraints

Do not work on these adjacent-milestone or blocked issues in this pass:
- `JIP-322`: Scaffold the desktop-first TypeScript application; blocked on `JIP-320`.
- `JIP-325`: Build SWF asset extraction and catalog pipeline; blocked on `JIP-318`.

Context:
- The ISO has already been extracted into `analysis/iso`.
- The Inno Setup installer has already been extracted into `analysis/setup/app`.
- Confirmed extracted app shape: Flash 5/6 content with 200 SWFs, 187 MP3s, 3 WAVs, 19 text files, and 48 Windows helper EXEs.
- `Nutcracker2.exe` is a Windows Flash projector; the remake should not depend on it.
- Representative SWF behavior has already been proven inspectable with `swfdump`.
- Delivery goal is a local desktop app, primary target macOS app/DMG; Windows/Linux are secondary if the chosen stack supports them cleanly.
- No hosted public website should be introduced as the release artifact.
- Browser automation is out of scope unless Marcus explicitly asks for Browser in the current request.

Classify the work state as `investigation-only`, `non-ui-code`, `ui-code`, or `blocked`.

Completion rules:
- For investigation-only work, report findings, comment on Linear with evidence, and move the issue to Done if acceptance criteria are met.
- For non-UI code work, run relevant automated validation, comment on Linear with results, and move completed issues to Done.
- For UI code work, run automated validation, provide a concrete manual test script, and wait for Marcus's manual approval before moving issues to Done.
- For blocked work, comment on Linear with the blocker and keep the issue open.

Work milestone-first: complete/update each included issue as its acceptance criteria are met, then continue to the next ready included issue. Perform code handoff actions or workspace cleanup only if Marcus explicitly requests those actions.
