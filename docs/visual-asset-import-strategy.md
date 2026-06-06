# Visual Asset Import Strategy

Linear issue: JIP-327

The remake should not wait for perfect SWF-to-canvas conversion. Use a hybrid import strategy:

## Asset Classes

| Class | Import approach | Examples |
| --- | --- | --- |
| Bitmap stills | Extract with `swfextract`, store in ignored private generated assets, then promote selected files into the local bundle when an implementation issue needs them. | JPEG/PNG objects from `nutchooser.swf`, `tree.swf`, and activity page backgrounds. |
| Simple vector shapes | Recreate as CSS/DOM or Canvas drawing primitives using the SWF catalog as reference. | Buttons, frames, simple decorative marks, color chips. |
| Timeline movie clips | Recreate as explicit scene state, CSS transitions, or PixiJS/Canvas animation. | Intro/help/warning states, chooser door states, mini-game win sequences. |
| ActionScript behavior | Reimplement as TypeScript route, game, progress, and audio logic. | `FSCommand:exec`, `_level1` loading, score/key updates, `StopSounds`. |
| Fonts/text | Use modern font substitutions unless rights are clarified. Keep original text data private and parsed through typed helpers. | Trivia prompts, activity pages, labels. |

## Naming And Folders

- Keep generated private exports in `app/generated/private-assets/swf/<swf-slug>/<kind>/<asset-id>.<ext>`.
- Keep private bundle media in `app/public/local-media`.
- When a later issue selects an asset for the app bundle, use stable semantic names under `app/public/local-media/visual/<scene>/<asset-name>.<ext>`.
- Reference app-loadable bundle paths with `/local-media/...`, not the original `analysis/setup/app` path.
- Preserve the original SWF path and asset ID in the implementation fixture or manifest entry.

## M03 Proof Fixtures

`npm run assets:pipeline` extracts:

- `navigation-nutchooser-background`: PNG asset 31 from `games/nutcrackergame/nutchooser.swf`;
- `game-tree-background`: PNG asset 63 from `games/tree/tree.swf`.

The fixture paths are recorded in `app/src/data/generated/visualImportSamples.ts`. They prove that one navigation screen and one game screen can be imported without committing private binary exports or requiring a full SWF renderer.

## Decision Rule

For each future scene, import bitmap stills when they provide useful background or sprite fidelity. Recreate motion and interaction manually when the SWF catalog flags vector shapes, movie clips, ActionScript tags, or font dependencies. This keeps M04-M08 unblocked while still preserving source traceability.
