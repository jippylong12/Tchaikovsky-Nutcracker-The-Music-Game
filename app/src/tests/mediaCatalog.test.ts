import { describe, expect, it } from "vitest";
import { swfAssetCatalog } from "../data/generated/swfAssetCatalog";
import { mediaManifest } from "../data/generated/mediaManifest";
import { visualImportSamples } from "../data/generated/visualImportSamples";
import { findAudioByOriginalPath, findCaseInsensitiveConflicts, findTextByOriginalPath, resolveBundledPath } from "../data/mediaCatalog";

describe("generated asset pipeline manifests", () => {
  it("catalogs representative SWFs and manual reconstruction notes", () => {
    const nutchooser = swfAssetCatalog.find((entry) => entry.originalPath === "games/nutcrackergame/nutchooser.swf");
    const tree = swfAssetCatalog.find((entry) => entry.originalPath === "games/tree/tree.swf");

    expect(nutchooser?.representative).toBe(true);
    expect(nutchooser?.counts.png).toBeGreaterThan(0);
    expect(tree?.manualReconstruction).toContain("actionscript-behavior-needs-modern-routing-state-or-game-logic");
  });

  it("resolves normalized private local media paths", () => {
    const audio = findAudioByOriginalPath(mediaManifest, "activities/originals/theme1.mp3");
    const text = findTextByOriginalPath(mediaManifest, "games/data/gamekeys.txt");

    expect(audio).toBeDefined();
    expect(text).toBeDefined();
    expect(audio ? resolveBundledPath(audio) : "").toBe("/local-media/audio/activities/originals/theme1.mp3");
    expect(text ? resolveBundledPath(text) : "").toBe("/local-media/text/games/data/gamekeys.txt");
    expect(text?.parser).toBe("gameKeys");
  });

  it("has no case-insensitive public path conflicts", () => {
    const publicPaths = [...mediaManifest.audio.map((asset) => asset.publicPath), ...mediaManifest.text.map((asset) => asset.publicPath)];

    expect(findCaseInsensitiveConflicts(publicPaths)).toEqual([]);
  });

  it("records one navigation and one game visual sample fixture", () => {
    expect(visualImportSamples.map((sample) => sample.role).sort()).toEqual(["game-screen", "navigation-screen"]);
    expect(visualImportSamples.every((sample) => sample.generatedPath.startsWith("app/generated/private-assets/visual-samples/"))).toBe(true);
  });
});
