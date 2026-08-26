import console from "node:console";
import { existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDir, "..");
const projectRoot = path.resolve(appRoot, "..");
const atlasFile = path.join(projectRoot, "docs/source-atlas.json");
const routesFile = path.join(appRoot, "src/routes.ts");
const outputFile = path.join(appRoot, "generated/source-atlas/contact-sheet.html");
const classificationVocabulary = [
  "original asset",
  "SWF-derived recreation",
  "original source text",
  "inferred behavior",
  "documented fallback",
  "defect",
];
const allowedLifecycles = new Set(["implemented-review", "implemented-defect", "planned", "auxiliary-review"]);
const issuePattern = /^JIP-\d+$/;
const promotionRoots = ["app/src/assets/", "app/public/local-media/"];
const canonicalPromotionRoots = promotionRoots.map((root) => realpathSync(path.resolve(projectRoot, root)));
const visualAssetPattern = /\.(gif|jpe?g|png|svg|webp)$/i;
const fallbackLocatorKinds = new Set(["sprite-timeline", "actor-frame", "projector-action"]);
const fallbackCapabilities = {
  "interactive-timeline-flattening": { tool: "SWFTools", evidence: /(cannot.*(?:flatten|interactive|timeline)|(?:flatten|timeline).*(?:cannot|unsupported))/i },
  "arbitrary-frame-selection": { tool: "local SWF frame renderer", evidence: /(transparent|crash|frame selector|later-frame)/i },
  "projector-action-bridge": { tool: "browser runtime", evidence: /(ActionScript|projector|native.*not present|bridge)/i },
};
const runtimeFallbackMechanisms = {
  "composed-promoted-layers": { details: /(promoted|display-list|layer)/i, retainedGap: /(timeline|interactive|playback)/i },
  "promoted-source-stills-with-typescript-state": { details: /(promoted|still|TypeScript)/i, retainedGap: /(animation|frame|motion)/i },
  "window-print-side-panel": { details: /(window\.print|Print|PDF)/i, retainedGap: /(native|print|PDF|desktop)/i },
};

export function validateSourceAtlas({ writeContactSheet = true } = {}) {
  const atlas = JSON.parse(readFileSync(atlasFile, "utf8"));
  const routeIds = readRouteIds(readFileSync(routesFile, "utf8"));
  const summary = validateAtlas(atlas, routeIds);

  if (writeContactSheet) {
    mkdirSync(path.dirname(outputFile), { recursive: true });
    writeFileSync(outputFile, renderContactSheet(atlas.entries, summary));
  }

  return { ...summary, routeIds, entries: atlas.entries, outputFile };
}

export function validateAtlas(atlas, routeIds) {
  const coveredRoutes = new Map();
  const entryIds = new Set();

  assert(atlas.schemaVersion === 1, `unsupported source atlas schema ${atlas.schemaVersion}`);
  assert(
    JSON.stringify(atlas.classificationVocabulary) === JSON.stringify(classificationVocabulary),
    "source atlas classification vocabulary does not match the fixed schema",
  );
  assert(Array.isArray(atlas.entries) && atlas.entries.length > 0, "source atlas has no entries");
  assert(Array.isArray(routeIds) && routeIds.length > 0, "app route manifest is empty");
  assert(new Set(routeIds).size === routeIds.length, "app route manifest contains duplicate ids");

  for (const entry of atlas.entries) {
    assert(typeof entry.id === "string" && entry.id.length > 0, "source atlas entry is missing id");
    assert(!entryIds.has(entry.id), `duplicate source atlas entry ${entry.id}`);
    entryIds.add(entry.id);
    assert(allowedLifecycles.has(entry.lifecycle), `${entry.id} has unsupported lifecycle ${entry.lifecycle}`);
    assert(Array.isArray(entry.routeIds), `${entry.id} route list is invalid`);
    assert(Array.isArray(entry.classifications) && entry.classifications.length > 0, `${entry.id} has no classifications`);
    for (const classification of entry.classifications) {
      assert(classificationVocabulary.includes(classification), `${entry.id} has unsupported classification ${classification}`);
    }
    assert(new Set(entry.classifications).size === entry.classifications.length, `${entry.id} repeats a classification`);
    assertLifecycleSemantics(entry);
    assert(Array.isArray(entry.sourceInputs) && entry.sourceInputs.length > 0, `${entry.id} has no source inputs`);
    assertPathsExist(entry.id, "source input", entry.sourceInputs);
    assertPathsExist(entry.id, "promoted asset", entry.promotedAssets);
    assertPathsExist(entry.id, "evidence document", entry.evidenceDocs);
    assertPromotedAssetSemantics(entry);
    assertFallbackSemantics(entry);
    assert(
      Array.isArray(entry.followUpIssues) && entry.followUpIssues.every((issue) => issuePattern.test(issue)),
      `${entry.id} has an invalid follow-up issue`,
    );
    if (entry.classifications.includes("defect")) {
      assert(entry.followUpIssues.length > 0, `${entry.id} is a defect without a follow-up issue`);
    }
    assert(entry.manualApproval === "required", `${entry.id} must retain the Marcus manual-approval gate`);
    assert(typeof entry.auditFinding === "string" && entry.auditFinding.length > 20, `${entry.id} lacks a durable audit finding`);

    for (const routeId of entry.routeIds) {
      assert(routeIds.includes(routeId), `${entry.id} references unknown app route ${routeId}`);
      assert(!coveredRoutes.has(routeId), `${routeId} is covered by both ${coveredRoutes.get(routeId)} and ${entry.id}`);
      coveredRoutes.set(routeId, entry.id);
    }
  }

  const missingRoutes = routeIds.filter((routeId) => !coveredRoutes.has(routeId));
  assert(missingRoutes.length === 0, `app routes missing from source atlas: ${missingRoutes.join(", ")}`);

  return {
    routeCount: routeIds.length,
    entryCount: atlas.entries.length,
    defectCount: atlas.entries.filter((entry) => entry.classifications.includes("defect")).length,
    plannedCount: atlas.entries.filter((entry) => entry.lifecycle === "planned").length,
    promotedAssetCount: atlas.entries.reduce((total, entry) => total + entry.promotedAssets.length, 0),
  };
}

export function readRouteIds(source) {
  const sourceFile = ts.createSourceFile("routes.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let routeArray;

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "routes" || !declaration.initializer) continue;
      routeArray = unwrapExpression(declaration.initializer);
    }
  }

  assert(routeArray && ts.isArrayLiteralExpression(routeArray), "routes.ts must export routes as a literal array");
  return routeArray.elements.map((element, index) => {
    assert(ts.isObjectLiteralExpression(element), `route ${index + 1} must be an object literal`);
    const idProperty = element.properties.find(
      (property) =>
        ts.isPropertyAssignment(property) &&
        ((ts.isIdentifier(property.name) && property.name.text === "id") ||
          (ts.isStringLiteral(property.name) && property.name.text === "id")),
    );
    assert(idProperty && ts.isPropertyAssignment(idProperty), `route ${index + 1} is missing a literal id`);
    assert(
      ts.isStringLiteral(idProperty.initializer) || ts.isNoSubstitutionTemplateLiteral(idProperty.initializer),
      `route ${index + 1} id must be a string literal`,
    );
    return idProperty.initializer.text;
  });
}

function assertPathsExist(entryId, label, paths) {
  assert(Array.isArray(paths), `${entryId} ${label} list is invalid`);
  for (const relativePath of paths) {
    assert(typeof relativePath === "string" && relativePath.length > 0, `${entryId} ${label} path is invalid`);
    assert(!path.isAbsolute(relativePath), `${entryId} ${label} must be repository-relative: ${relativePath}`);
    const candidate = path.resolve(projectRoot, relativePath);
    assert(isWithin(projectRoot, candidate), `${entryId} ${label} escapes the repository: ${relativePath}`);
    assert(existsSync(candidate), `${entryId} ${label} does not exist: ${relativePath}`);
    const realCandidate = realpathSync(candidate);
    assert(isWithin(realpathSync(projectRoot), realCandidate), `${entryId} ${label} resolves outside the repository: ${relativePath}`);

    if (label === "promoted asset") {
      assert(
        canonicalPromotionRoots.some((root) => isWithin(root, realCandidate)),
        `${entryId} promoted asset resolves outside approved roots: ${relativePath}`,
      );
      assert(statSync(realCandidate).isFile(), `${entryId} promoted asset is not a file: ${relativePath}`);
      assert(visualAssetPattern.test(relativePath), `${entryId} promoted asset is not a supported visual file: ${relativePath}`);
    }
    if (label === "evidence document") {
      assert(relativePath.startsWith("docs/") && relativePath.endsWith(".md"), `${entryId} evidence must be a Markdown file under docs/: ${relativePath}`);
      assert(statSync(realCandidate).isFile(), `${entryId} evidence document is not a file: ${relativePath}`);
    }
  }
}

function assertLifecycleSemantics(entry) {
  const hasDefect = entry.classifications.includes("defect");
  if (entry.lifecycle === "implemented-defect") {
    assert(hasDefect && entry.routeIds.length > 0, `${entry.id} implemented-defect must classify at least one route as a defect`);
  }
  if (entry.lifecycle === "planned") {
    assert(hasDefect && entry.routeIds.length === 0, `${entry.id} planned entry must be an unrouted defect`);
  }
  if (entry.lifecycle === "implemented-review") {
    assert(!hasDefect && entry.routeIds.length > 0, `${entry.id} implemented-review must cover a route without a defect classification`);
    assert(
      entry.classifications.some((classification) => ["original asset", "SWF-derived recreation", "original source text"].includes(classification)),
      `${entry.id} implemented-review lacks source-backed classifications`,
    );
  }
  if (entry.lifecycle === "auxiliary-review") {
    assert(!hasDefect && entry.routeIds.length === 0, `${entry.id} auxiliary-review must be an unrouted, non-defect artifact`);
  }
}

function assertPromotedAssetSemantics(entry) {
  const needsPromotedAsset = entry.classifications.some((classification) =>
    ["original asset", "SWF-derived recreation"].includes(classification),
  );
  if (needsPromotedAsset) {
    assert(entry.promotedAssets.length > 0, `${entry.id} claims source-backed art without a promoted asset`);
  }
}

function assertFallbackSemantics(entry) {
  if (!entry.classifications.includes("documented fallback")) return;
  assert(Array.isArray(entry.fallbackEvidence) && entry.fallbackEvidence.length > 0, `${entry.id} documented fallback lacks exact evidence`);
  for (const fallback of entry.fallbackEvidence) {
    assert(fallback && typeof fallback === "object" && !Array.isArray(fallback), `${entry.id} fallback evidence must be structured`);
    assertPathsExist(entry.id, "fallback source", [fallback.source]);
    assertPathsExist(entry.id, "evidence document", [fallback.evidenceDoc]);
    const locator = fallback.sourceLocator;
    assert(
      locator && typeof locator === "object" && !Array.isArray(locator) && fallbackLocatorKinds.has(locator.kind),
      `${entry.id} fallback evidence lacks a supported source-locator kind`,
    );
    assert(
      typeof locator.identifier === "string" && /(?:ActionScript|anim|frame|id|ratio|song|sprite).*\d|\d.*(?:ActionScript|anim|frame|id|ratio|song|sprite)/i.test(locator.identifier),
      `${entry.id} fallback evidence lacks an exact numbered source locator`,
    );
    assert(
      typeof locator.frameOrState === "string" && /\d/.test(locator.frameOrState) && locator.frameOrState.length > 10,
      `${entry.id} fallback evidence lacks an exact numbered frame or state`,
    );
    if (locator.kind === "projector-action") {
      assert(
        typeof locator.actionTarget === "string" && /(FSCommand|GetURL|print:#)/i.test(locator.actionTarget),
        `${entry.id} projector fallback lacks an exact ActionScript target`,
      );
    }

    const limitation = fallback.toolLimitation;
    const capabilityRule = limitation && fallbackCapabilities[limitation.capability];
    assert(capabilityRule, `${entry.id} fallback evidence lacks a supported tool capability`);
    assert(limitation.tool === capabilityRule.tool, `${entry.id} fallback evidence names the wrong tool for ${limitation.capability}`);
    assert(
      typeof limitation.observedFailure === "string" && capabilityRule.evidence.test(limitation.observedFailure),
      `${entry.id} fallback evidence lacks capability-specific observed failure evidence`,
    );

    const runtime = fallback.runtimeFallback;
    const runtimeRule = runtime && runtimeFallbackMechanisms[runtime.mechanism];
    assert(runtimeRule, `${entry.id} fallback evidence lacks a supported runtime mechanism`);
    assert(
      typeof runtime.details === "string" && runtime.details.length > 30 && runtimeRule.details.test(runtime.details),
      `${entry.id} fallback evidence lacks mechanism-specific runtime details`,
    );
    assert(
      typeof runtime.retainedGap === "string" && runtime.retainedGap.length > 20 && runtimeRule.retainedGap.test(runtime.retainedGap),
      `${entry.id} fallback evidence lacks a mechanism-specific retained gap`,
    );
  }
}

function unwrapExpression(expression) {
  let current = expression;
  while (ts.isSatisfiesExpression(current) || ts.isAsExpression(current) || ts.isParenthesizedExpression(current)) {
    current = current.expression;
  }
  return current;
}

function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function renderContactSheet(entries, summary) {
  const rows = entries
    .map((entry) => {
      const images = entry.promotedAssets
        .filter((asset) => /\.(png|jpe?g)$/i.test(asset))
        .map((asset) => `<img src="../../../${escapeHtml(asset)}" alt="" loading="lazy" />`)
        .join("");
      return `<article class="entry ${entry.classifications.includes("defect") ? "defect" : "review"}">
        <div class="preview">${images || "<span>No promoted visual yet</span>"}</div>
        <div>
          <p class="eyebrow">${escapeHtml(entry.lifecycle)} · ${escapeHtml(entry.routeIds.join(", ") || "planned/auxiliary")}</p>
          <h2>${escapeHtml(entry.title)}</h2>
          <p>${escapeHtml(entry.auditFinding)}</p>
          <p><strong>Classification:</strong> ${escapeHtml(entry.classifications.join("; "))}</p>
          <p><strong>Source:</strong> ${escapeHtml(entry.sourceInputs.join(" · "))}</p>
          <p><strong>Linear:</strong> ${escapeHtml(entry.followUpIssues.join(", "))}</p>
        </div>
      </article>`;
    })
    .join("\n");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" />
<title>Nutcracker Remake Source Atlas</title><style>
body{margin:0;padding:32px;font:15px/1.45 system-ui,sans-serif;color:#201914;background:#f2ede4}header{max-width:1100px;margin:auto auto 24px}h1{margin:0 0 8px}.grid{display:grid;gap:16px;max-width:1100px;margin:auto}.entry{display:grid;grid-template-columns:260px 1fr;gap:20px;padding:18px;border:1px solid #bfae93;background:#fff}.entry.defect{border-left:8px solid #8f2d2b}.entry.review{border-left:8px solid #1f4d43}.preview{display:flex;flex-wrap:wrap;align-content:flex-start;gap:8px;min-height:120px;background:#eee}.preview img{max-width:250px;max-height:180px;object-fit:contain}.preview span{margin:auto;color:#6f665c}.eyebrow{margin:0;color:#6f665c;text-transform:uppercase;font-size:12px}h2{margin:3px 0 8px;font-size:20px}p{margin:6px 0}@media(max-width:760px){.entry{grid-template-columns:1fr}}
</style></head><body><header><h1>Project-wide source atlas</h1><p>${summary.routeCount} app routes · ${summary.entryCount} source families · ${summary.defectCount} defect/planned entries · ${summary.promotedAssetCount} promoted visual samples. Marcus manual approval remains required for every visible route.</p></header><main class="grid">${rows}</main></body></html>\n`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = validateSourceAtlas();
  console.log(
    `Validated ${result.routeCount} routes across ${result.entryCount} atlas entries (${result.defectCount} defect/planned, ${result.promotedAssetCount} promoted visual samples)`,
  );
  console.log(`Wrote ${path.relative(appRoot, result.outputFile)}`);
}
