# Asset Catalog And Media Pipeline

Linear issues: JIP-325, JIP-326

Run the full M03 generation pass from the app directory:

```sh
cd app
npm run assets:pipeline
```

The command reads the local recovered installer output at `analysis/setup/app`, then:

- scans every SWF with `swfextract` and `swfdump`;
- emits safe SWF metadata into `app/src/data/generated/swfAssetCatalog.ts`;
- emits safe audio/text metadata into `app/src/data/generated/mediaManifest.ts`;
- copies private audio and text into ignored `app/public/local-media/audio` and `app/public/local-media/text` bundle paths;
- extracts two private visual sample fixtures into ignored `app/generated/private-assets/visual-samples`;
- writes machine-readable mirrors under ignored `app/generated/catalog`.

After catalog generation, run `npm run assets:source-atlas`. That gate validates every app route against `docs/source-atlas.json` and writes the ignored route/contact-sheet index at `app/generated/source-atlas/contact-sheet.html`.

## Boundaries

The generated TypeScript manifests contain paths, object IDs, sizes, hashes, durations, parser assignments, and reconstruction notes. They do not embed original trivia/story/educational text or binary media.

The ignored local media copies are for private desktop packaging only. They replace the original installer folder layout with case-safe Vite/Tauri paths such as `/local-media/audio/activities/originals/theme1.mp3`.

## Implementation Inputs

- `swfAssetCatalog` links each SWF path to exported object IDs, names when `EXPORTASSETS` or `PLACEOBJECT2` exposes them, planned private export paths, dimensions, frame count, and manual reconstruction notes.
- `mediaManifest.audio` catalogs all MP3/WAV files, normalized public bundle paths, codec/duration when `ffprobe` can read them, and WAV files that should be considered for conversion.
- `mediaManifest.text` catalogs all Flash `loadVariables` text files, variable names, parser families, hashes, and normalized public bundle paths.
- `app/src/data/flashVariables.ts` provides typed helpers for progress flags, trivia questions, and melody sequences.

## Sample Verification

The generated summary at `docs/generated-asset-catalog-summary.md` should show all 200 SWFs, all external audio/text files, representative SWFs from activities and games, and both visual sample fixtures.
