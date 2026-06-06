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

Build an unsigned local macOS app bundle and DMG through Tauri:

```sh
npm run package:mac
```

This command uses `tauri build --bundles app,dmg --no-sign`. It is intended for private local validation. Signing and notarization are separate release concerns, and Windows/Linux packaging remains optional until the macOS path is proven.
