# M09 Release Candidate QA and Manual Approval Pack

Linear issue: JIP-345

## Current disposition

Automated/package QA may move M09 work to **In Review**, but the release candidate is not approved or complete until Marcus explicitly approves the remaining UI/gameplay fidelity gates. Browser automation is prohibited by the repository instructions unless Marcus asks for it, so this document separates current automated evidence from the final human walkthrough.

## Fresh automated package evidence — 2026-08-26

- `npm run package:mac` passed after the production frontend built 678 modules and the source-local reader bundle validator confirmed distinct story/biography/ballet assets.
- App bundle: 155,723,620 bytes; content-tree SHA-256 `7711047be2f8f57f23d0a002aaca8d9083b47d71a6d4d224a16b0347dfc35a39`.
- DMG: 151,689,590 bytes; SHA-256 `62dbef1062d0bc092ac1bb7957d3e83ebe088a87f96f67dc4be738583afa13f1`.
- Package verifier confirmed ARM64 Mach-O, bundle identifier `com.jippylong12.nutcracker-music-game`, version `0.1.0`, ad-hoc signature with no signing team, DMG integrity, read-only DMG mount, and expected app metadata inside the mounted image.
- Bundled frontend inventory: 767 files, including 645 MP3/WAV files and 99 PNG/JPEG files. The lower count than the earlier preflight is intentional: a destructive asset-pipeline audit removed 27 stale/unreferenced ignored audio outputs while restoring the three source-mapped Story/Biography/Ballet narrations.
- The final automated baseline passed 13 test files / 84 tests, typecheck, lint, production build, the 28-route/22-entry source-atlas gate, and all mandated Nutcracker source extractors. Two consecutive pipeline runs produced 275 runtime audio files with tree SHA-256 `5cb6a0c9fa7aba519e09e45b9504f26a8884f779602b5f5efaf7c77659180878`.
- The packaged app launched as its own local process, remained running for 15 seconds, and the exact task-owned process was then stopped. This is a process smoke, not visual approval.
- The ignored machine-readable manifest is `app/src-tauri/target/release/bundle/release-candidate-manifest.json`.

## Resettable setup

1. From `app/`, run `npm run package:mac`.
2. Mount the generated DMG and copy the app to a temporary local Applications-style folder if desired.
3. Start with a fresh app-data state by using the in-app reset before packaging in a development build, or remove only this app's local WebView storage after making a backup. Never reset unrelated browser/WebView data.
4. Launch the packaged app. The production build must show only the 640 x 480 game surface, not the development route map, key/door cheat buttons, or audio diagnostics.
5. Complete the walkthrough below, quit normally, relaunch, and repeat every persistence check.

## Route walkthrough

| Surface | Resettable check | Approval issue |
| --- | --- | --- |
| Overture | Launch, confirm source garden/skip path, then enter the main room | JIP-818 |
| Main Menu | Verify source room art, hotspots, locked Nutcracker gate, and no debug chrome | JIP-818 |
| Story | Traverse all four spreads; verify exact source prose, book art, NEXT/PREV/EXIT | JIP-819 |
| Composer Biography | Traverse all four spreads, including both frame-3 images | JIP-819 |
| Ballet History | Traverse all five spreads and source controls | JIP-819 |
| Music Dictionary | Advance through all 18 source-sequenced entries and play representative audio | JIP-820 |
| Nutcracker Suite | Start with no record selected; play/pause/replace several records and leave the route | JIP-820 |
| Nutcracker Chooser | Verify eight doors, source help/quit warnings, persistence, and the all-eight magic key | JIP-349/JIP-359 |
| Song 1 | Preview/select four tracks, wrong/hint/help/change/exit paths, completion and persistence | JIP-349/JIP-359 |
| Songs 2-8 | Repeat the Song 1 matrix for each song and verify source-local actors/scenery/audio | JIP-349/JIP-359 |
| Children's Album | Complete each song's exact instrument pattern; confirm saved doors and key6 | JIP-840 |
| Loopy Tunes | Complete all eight boards; confirm key3 is gated on all eight | JIP-840 |
| Orchestra | Exercise prompts, wrong/replay/completed controls, all 18 instruments, and key4 | JIP-845 |
| Toy Soldiers | Exercise invalid snaps, exact eight-soldier order, reset, and no invented key | JIP-845 |
| Waltz | Verify long-form audio/timeline controls and documented visual fallback boundary | JIP-845 |
| Tree Game | Complete all three rounds with source prompts/options and confirm key8 | JIP-825 |
| Flying Instruments | Exercise source instrument/family mappings through completion and confirm key3 | JIP-825 |
| Trivia | Check correct, wrong/AGAIN, score progression, completion, and key9 | JIP-825 |
| Melody | Check all difficulties, timed demonstrations, input lock, continue/new game, and key5 | JIP-830 |
| Memory | Check level sizes, shuffle, error limits, revealed faces, zero-error state, and key2 | JIP-830 |
| Alice Puzzles | Check all 12 chooser entries, exact three-choice answers, reset, and no invented key | JIP-850 |
| Nut House | Complete rooms 11-18 with preview/wrong/win audio, persistence, reset, and key7 | JIP-850 |
| Certificate | After all Nutcracker doors, open Print/Save PDF and verify only source certificate art prints | JIP-349/JIP-345 |

## Cross-route checks

- Leaving any route stops its active scene audio; delayed melody/feedback audio must not leak.
- Mute and volume behavior remains consistent for representative preview, loop, feedback, and long-form audio.
- Progress survives a normal quit/relaunch and reset clears every game key, Nutcracker door, Children's Album door, and Nut House room state.
- No preserved 640 x 480 viewport shows visible debug/provenance copy, generic scaffold cards, undocumented status badges, or a source asset assigned to the wrong scene.
- Keyboard focus remains visible and usable for source-recreated controls without exposing hidden accessibility text.
- The unsigned/private install warning and asset-rights caveat match `docs/release-notes-0.1.0-rc1.md`.

## Automation boundary

Automated checks prove typed behavior, DOM/state regressions, deterministic extraction, route/atlas completeness, production compilation, package metadata, ad-hoc signature status, DMG integrity/mountability, artifact architecture, and bundled-media counts. They do not prove subjective visual fidelity, audible correctness through the host device, native print-dialog behavior, or Marcus approval.

Record Marcus's decisions on the linked Linear issues. JIP-345 and the M09 milestone must remain In Review until every required Marcus explicit approval is present.
