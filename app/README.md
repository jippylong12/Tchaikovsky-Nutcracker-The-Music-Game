# Tchaikovsky Nutcracker: The Music Game

Local desktop remake foundation for the recovered 2003 Flash game.

## Scope

This app is a private/local preservation build target. It uses Tauri, Vite, and TypeScript, with a fixed 640x480 game viewport inside a desktop window. The frontend exists as the desktop app core; do not add public hosting or deployment workflow for this project.

Original recovered assets remain outside this scaffold under the repository-level `base/` and `analysis/` directories until the M03 catalog pipeline selects normalized local bundle inputs.

## Local Development

Install dependencies from this directory:

```sh
npm install
```

Run the Vite-only shell:

```sh
npm run dev
```

Run the desktop app shell:

```sh
npm run tauri:dev
```

Both commands show only the game, with the native 640 x 480 stage scaled to fill the window. The developer route map, progress cheats, and audio diagnostics are hidden by default; add `?devpanel=1` to the Vite URL or set the `VITE_DEV_PANEL` environment variable to `1` to show them.

## Validation

Run these before packaging or larger feature changes:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

These checks do not require browser automation.

## macOS Package Proof

Build a private local macOS app bundle and DMG through Tauri:

```sh
npm run package:mac
```

This command validates release metadata and source-atlas readiness, runs the full frontend production build through Tauri, creates an app bundle and DMG with the configured ad-hoc identity (`-`), verifies the complete bundle signature and DMG, mounts it read-only, proves the mounted app matches the fresh app bundle, checks metadata and architecture, confirms bundled media counts, and writes an ignored `release-candidate-manifest.json` beside the artifacts.

Artifacts are created under `src-tauri/target/release/bundle/`. They are private local preservation builds: the generated app contains original/derived media that is not licensed for public redistribution. The ad-hoc signature only provides local bundle integrity; Developer ID signing and notarization are separate release concerns.

See `../docs/release-notes-0.1.0-rc1.md` for private install steps and caveats, `../docs/release-candidate-qa.md` for the resettable QA/approval checklist, and `../docs/cross-platform-packaging.md` for Windows/Linux feasibility.
