# Distribution Constraints

Linear issue: JIP-321

## Scope

This remake is a private/local preservation build of Tchaikovsky's Nutcracker: The Music Game using recovered original disc, Flash, audio, text, and artwork assets.

The project should produce a local desktop application, primarily for macOS. It should not introduce a hosted public website as the release artifact.

## Ownership Assumptions

Known source metadata identifies:

| Field | Value |
| --- | --- |
| Title | Tchaikovsky's Nutcracker: The Music Game |
| Creator | Quaint Interactive |
| Year | 2003 |
| Source media | Recovered ISO and installed Flash project |

The original art, audio recordings, text, Flash movies, and executable assets should be treated as third-party copyrighted material unless Marcus provides explicit rights documentation.

## What Can Be Shared Publicly

Public sharing is acceptable for:

| Artifact | Constraint |
| --- | --- |
| Remake source code written for this project | Do not include original proprietary assets unless rights are confirmed |
| Documentation about architecture and extraction approach | Avoid bundling large asset dumps or redistributed media |
| Parser tests with tiny synthetic fixtures | Prefer invented fixture content, not copied original text/audio/art |
| Build instructions | Make clear that original assets must be supplied locally/private |

## What Should Stay Private/Local

Keep these out of public redistribution unless explicit rights are confirmed:

| Artifact | Reason |
| --- | --- |
| `base/tchaikovsky-nutcracker-the-music-game.iso` | Original commercial/preserved disc image |
| `analysis/setup/app/**/*.swf` | Original Flash movies/art/timeline content |
| `analysis/setup/app/**/*.mp3` and `*.wav` | Original audio recordings/assets |
| Original question/story/biography/ballet/music-dictionary text | Original educational content |
| Extracted/generated image or sprite exports derived from SWFs | Derived original artwork |
| Windows projector/helper EXEs | Original executable assets |

Private/local app builds may bundle original assets for Marcus's use. Public releases should require the user to provide their own local source assets or should omit original media.

## Packaging Note

Use this release-note language for local preservation builds:

> This is a private local preservation remake that requires the original recovered Tchaikovsky's Nutcracker: The Music Game assets. Original art, audio, text, and Flash-derived media are not licensed for public redistribution by this project.

Packaging issues must reference this constraint before producing distributable artifacts:

| Linear issue | Required note |
| --- | --- |
| JIP-324 | Early macOS package proof should document private/unsigned local packaging and avoid public asset redistribution. |
| JIP-343 | Final macOS app/DMG artifact should include local/private install notes and asset-rights caveat. |
| JIP-344 | Windows/Linux feasibility should distinguish private local builds from public redistributable artifacts. |
| JIP-345 | Release notes should list asset rights as a known distribution constraint. |

## Engineering Rules

1. Keep original assets under `base/` and `analysis/` as local source/reference material.
2. Do not publish `analysis/` asset dumps or generated SWF exports without rights review.
3. Make app code able to load bundled local assets, but keep the public release path asset-aware.
4. Do not add web hosting or public deployment configuration for this game unless Marcus explicitly changes the release goal.
5. Prefer documentation that says "private/local preservation build" over language implying a public commercial or open-source asset release.
