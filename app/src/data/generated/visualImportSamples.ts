import type { VisualImportSample } from "../catalogTypes";

export const visualImportSamples = [
  {
    "id": "navigation-nutchooser-background",
    "role": "navigation-screen",
    "originalSwfPath": "games/nutcrackergame/nutchooser.swf",
    "assetId": 31,
    "kind": "png",
    "generatedPath": "app/generated/private-assets/visual-samples/navigation-nutchooser-background/31.png",
    "implementationUse": "Proof fixture for chooser/menu still backgrounds."
  },
  {
    "id": "game-tree-background",
    "role": "game-screen",
    "originalSwfPath": "games/tree/tree.swf",
    "assetId": 63,
    "kind": "png",
    "generatedPath": "app/generated/private-assets/visual-samples/game-tree-background/63.png",
    "implementationUse": "Proof fixture for in-game still/background imports."
  }
] as const satisfies readonly VisualImportSample[];
