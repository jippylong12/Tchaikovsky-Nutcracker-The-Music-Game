import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { describe, expect, it } from "vitest";
import { readRouteIds, validateAtlas, validateSourceAtlas } from "../../scripts/validate-source-atlas.mjs";

const atlasFile = path.resolve(process.cwd(), "../docs/source-atlas.json");
const routesFile = path.resolve(process.cwd(), "src/routes.ts");

function currentAtlas() {
  return JSON.parse(readFileSync(atlasFile, "utf8"));
}

function currentRoutes() {
  return readRouteIds(readFileSync(routesFile, "utf8"));
}

describe("project-wide source atlas", () => {
  it("covers every app route with existing source evidence and a manual gate", () => {
    const result = validateSourceAtlas({ writeContactSheet: false });

    expect(result.routeCount).toBe(22);
    expect(result.routeIds).toContain("overture");
    expect(result.routeIds).toContain("nutcracker-chooser");
    expect(result.routeIds).toContain("song-8");
    expect(result.routeIds).toContain("puzzles");
    expect(result.entries.every((entry) => entry.manualApproval === "required")).toBe(true);
    expect(result.entries.find((entry) => entry.id === "nutcracker-chooser")?.followUpIssues).toContain("JIP-349");
    expect(result.entries.find((entry) => entry.id === "nutcracker-songs")?.followUpIssues).toContain("JIP-349");
  });

  it("tracks defects as Linear follow-ups instead of accepting placeholders", () => {
    const result = validateSourceAtlas({ writeContactSheet: false });
    const defects = result.entries.filter((entry) => entry.classifications.includes("defect"));

    expect(defects.length).toBeGreaterThan(10);
    expect(defects.every((entry) => entry.followUpIssues.length > 0)).toBe(true);
    expect(result.entries.find((entry) => entry.id === "trivia")?.followUpIssues).toContain("JIP-821");
    expect(result.entries.find((entry) => entry.id === "overture")?.followUpIssues).toContain("JIP-818");
  });

  it("discovers alternate route formatting and rejects an uncovered new route", () => {
    const source = readFileSync(routesFile, "utf8");
    const withSingleQuotedRoute = source.replace(
      "export const routes = [",
      "export const routes = [{ id: 'new-visible-route', label: 'New', group: 'Activities', kind: 'activity' },",
    );
    const routeIds = readRouteIds(withSingleQuotedRoute);

    expect(routeIds).toContain("new-visible-route");
    expect(() => validateAtlas(currentAtlas(), routeIds)).toThrow(/new-visible-route/);
  });

  it("rejects self-defined vocabulary, invalid lifecycle claims, vague fallbacks, and repository escapes", () => {
    const routeIds = currentRoutes();

    const customVocabulary = currentAtlas();
    customVocabulary.classificationVocabulary.push("trust me");
    expect(() => validateAtlas(customVocabulary, routeIds)).toThrow(/fixed schema/);

    const invalidLifecycle = currentAtlas();
    invalidLifecycle.entries.find((entry) => entry.id === "overture").classifications = ["inferred behavior"];
    expect(() => validateAtlas(invalidLifecycle, routeIds)).toThrow(/implemented-defect/);

    const vagueFallback = currentAtlas();
    vagueFallback.entries.find((entry) => entry.id === "nutcracker-chooser").fallbackEvidence = [
      "Playback remains unavailable, so the implementation uses a documented fallback for this route.",
    ];
    expect(() => validateAtlas(vagueFallback, routeIds)).toThrow(/must be structured/);

    const vagueStructuredFallback = currentAtlas();
    const fallback = vagueStructuredFallback.entries.find((entry) => entry.id === "nutcracker-chooser").fallbackEvidence[0];
    fallback.sourceLocator = { kind: "sprite-timeline", identifier: "frame", frameOrState: "frame" };
    fallback.toolLimitation = {
      capability: "interactive-timeline-flattening",
      tool: "SWFTools",
      observedFailure: "The available tool cannot perform the required operation.",
    };
    fallback.runtimeFallback = {
      mechanism: "composed-promoted-layers",
      details: "The runtime uses a fallback implementation for this route.",
      retainedGap: "The unavailable behavior remains.",
    };
    expect(() => validateAtlas(vagueStructuredFallback, routeIds)).toThrow(/numbered source locator/);

    const escapedPath = currentAtlas();
    escapedPath.entries.find((entry) => entry.id === "overture").sourceInputs = ["../../../../etc/passwd"];
    expect(() => validateAtlas(escapedPath, routeIds)).toThrow(/escapes the repository/);

    const escapedPromotionRoot = currentAtlas();
    escapedPromotionRoot.entries.find((entry) => entry.id === "story").promotedAssets = ["app/src/assets/../routes.ts"];
    expect(() => validateAtlas(escapedPromotionRoot, routeIds)).toThrow(/outside approved roots/);
  });
});
