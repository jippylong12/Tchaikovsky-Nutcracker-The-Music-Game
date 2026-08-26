import { execFileSync } from "node:child_process";
import console from "node:console";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  buildDisplayListTargetProof,
  parseSwfDisplayList,
  renderDisplayListCatalogModule,
  renderDisplayListProofHtml,
} from "./lib/swf-display-list.mjs";

const sourceRoot = "../analysis/setup/app/games/nutcrackergame";
const outputRoot = "generated/nutcracker-source-extract/full-swf-pass";

const sourceFiles = [
  `${sourceRoot}/nutchooser.swf`,
  ...Array.from({ length: 8 }, (_item, songIndex) => `${sourceRoot}/song${songIndex + 1}/song.swf`),
  ...Array.from({ length: 8 }, (_songItem, songIndex) =>
    Array.from({ length: 8 }, (_trackItem, trackIndex) => `${sourceRoot}/song${songIndex + 1}/characters/anim${trackIndex + 1}.swf`),
  ).flat(),
];

const directPngPattern = /DEFINEBITSLOSSLESS2 defines id\s+0*([0-9]+) image ([0-9]+)x([0-9]+) \(([0-9]+) bpp\)/g;
const displayListTargets = [
  {
    key: "chooserHallway",
    label: "Chooser hallway",
    sourceFile: `${sourceRoot}/nutchooser.swf`,
    symbolId: 21,
    preferredOwnerSpriteId: null,
    preferredFrame: 1,
    preferredDepth: 1,
    requiredChildCharacterIds: [16, 17, 18, 20],
    promotedAssets: [
      "src/assets/nutcracker-source/chooser-hallway-fill.png",
      "src/assets/nutcracker-source/chooser-hallway-portal-cxform.png",
      "src/assets/nutcracker-source/chooser-hallway-vector.png",
      "src/assets/nutcracker-source/chooser-hallway-tint-cxform.png",
    ],
    notes: ["Full composite rendering is blocked by the local renderer's missing JPEG3 support; child vectors and repaired JPEG3-backed fill remain source-derived."],
  },
  {
    key: "chooserFrame",
    label: "Chooser frame",
    sourceFile: `${sourceRoot}/nutchooser.swf`,
    symbolId: 34,
    preferredOwnerSpriteId: null,
    preferredFrame: 6,
    preferredDepth: 55,
    requiredChildCharacterIds: [22, 25, 26, 28, 30, 33],
    promotedAssets: ["src/assets/nutcracker-source/nutchooser-frame-source.png"],
    notes: [],
  },
  {
    key: "chooserInstruments",
    label: "Chooser instruments",
    sourceFile: `${sourceRoot}/nutchooser.swf`,
    symbolId: 68,
    preferredOwnerSpriteId: null,
    preferredFrame: 6,
    preferredDepth: 69,
    requiredChildCharacterIds: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 59, 61, 63, 65, 67],
    promotedAssets: ["src/assets/nutcracker-source/chooser-instruments-cxform.png"],
    notes: ["The promoted render applies the recovered root placement color transform."],
  },
  {
    key: "songCurtain",
    label: "Song curtain and feedback",
    sourceFile: `${sourceRoot}/song1/song.swf`,
    symbolId: 63,
    preferredOwnerSpriteId: null,
    preferredFrame: 1,
    preferredDepth: 82,
    preferredName: "courtain",
    requiredChildCharacterIds: [42, 47, 49, 52, 53, 54, 57, 58, 59, 60, 61, 62],
    promotedAssets: [
      "src/assets/nutcracker-source/song-curtain-fill.png",
      "src/assets/nutcracker-source/song-curtain-curve-cxform.png",
      "src/assets/nutcracker-source/song-curtain-stars.png",
      "src/assets/nutcracker-source/song-curtain-scallop.png",
    ],
    notes: ["Dynamic _root.message edit text remains DOM-backed at recovered bounds; the source curtain timeline and child placements are retained in this proof."],
  },
  {
    key: "songHelp",
    label: "Song help frame",
    sourceFile: `${sourceRoot}/song1/song.swf`,
    symbolId: 333,
    preferredOwnerSpriteId: 359,
    preferredFrame: 28,
    preferredDepth: 1,
    requiredChildCharacterIds: [332],
    requiredFrameCharacterIds: [333, 334],
    promotedAssets: [
      "src/assets/nutcracker-source/song-help-art.png",
      "src/assets/nutcracker-source/song-helpframe-talker.png",
    ],
    notes: ["The talker sprite is rendered through a translated wrapper because direct rendering clips negative-coordinate source art."],
  },
  {
    key: "songWarning",
    label: "Song warning frame",
    sourceFile: `${sourceRoot}/song1/song.swf`,
    symbolId: 340,
    preferredOwnerSpriteId: 359,
    preferredFrame: 30,
    preferredDepth: 1,
    requiredChildCharacterIds: [339],
    requiredFrameCharacterIds: [340, 341, 346, 351, 352],
    promotedAssets: [
      "src/assets/nutcracker-source/song-warningframe-talker.png",
      "src/assets/nutcracker-source/song-warning-yes-body.png",
      "src/assets/nutcracker-source/song-warning-yes-label.png",
      "src/assets/nutcracker-source/song-warning-no-body.png",
      "src/assets/nutcracker-source/song-warning-no-label.png",
    ],
    notes: ["The warning talker uses a translated wrapper; source button bodies and text labels are composed as separate recoverable children."],
  },
];

function ensureDirectory(path) {
  mkdirSync(path, { recursive: true });
}

function run(command, args, options = {}) {
  return execFileSync(command, args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 80, ...options });
}

function safeSlug(path) {
  return path
    .replace(sourceRoot, "")
    .replace(/^\//, "")
    .replace(/\.swf$/i, "")
    .replaceAll("/", "__")
    .replaceAll(" ", "-");
}

function extractDirectPngs(sourceFile, swfDump) {
  const records = [];
  const outputDirectory = join(outputRoot, "direct-png", safeSlug(sourceFile));
  ensureDirectory(outputDirectory);

  for (const match of swfDump.matchAll(directPngPattern)) {
    const [, id, width, height, bitDepth] = match;
    const outputFile = join(outputDirectory, `lossless-${id}.png`);
    try {
      execFileSync("swfextract", ["-p", id, "-o", outputFile, sourceFile], { stdio: "pipe" });
      records.push({
        type: "DEFINEBITSLOSSLESS2",
        id: Number(id),
        width: Number(width),
        height: Number(height),
        bitDepth: Number(bitDepth),
        outputFile,
      });
    } catch (error) {
      records.push({
        type: "DEFINEBITSLOSSLESS2",
        id: Number(id),
        width: Number(width),
        height: Number(height),
        bitDepth: Number(bitDepth),
        outputFile,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return records;
}

function inspectSwf(sourceFile) {
  if (!existsSync(sourceFile)) {
    return { sourceFile, missing: true };
  }

  const slug = safeSlug(sourceFile);
  const dumpDirectory = join(outputRoot, "dumps", dirname(slug));
  ensureDirectory(dumpDirectory);

  const placementDump = run("swfdump", ["-b", "-p", sourceFile]);
  const actionDump = run("swfdump", ["-a", sourceFile]);
  const textDump = run("swfdump", ["-t", sourceFile]);

  const placementDumpFile = join(outputRoot, "dumps", `${slug}.placements.txt`);
  const actionDumpFile = join(outputRoot, "dumps", `${slug}.actions.txt`);
  const textDumpFile = join(outputRoot, "dumps", `${slug}.text.txt`);
  const displayListFile = join(outputRoot, "display-list", `${slug}.json`);

  ensureDirectory(dirname(placementDumpFile));
  ensureDirectory(dirname(displayListFile));
  writeFileSync(placementDumpFile, placementDump);
  writeFileSync(actionDumpFile, actionDump);
  writeFileSync(textDumpFile, textDump);
  const displayList = parseSwfDisplayList(placementDump, sourceFile);
  writeFileSync(displayListFile, `${JSON.stringify(displayList, null, 2)}\n`);

  return {
    sourceFile,
    placementDumpFile,
    actionDumpFile,
    textDumpFile,
    displayListFile,
    displayList,
    directPngs: extractDirectPngs(sourceFile, placementDump),
  };
}

const missingSourceFiles = sourceFiles.filter((sourceFile) => !existsSync(sourceFile));
if (missingSourceFiles.length > 0) {
  throw new Error(`Missing required source SWFs:\n${missingSourceFiles.join("\n")}`);
}

ensureDirectory(outputRoot);

const inspectedFiles = sourceFiles.map(inspectSwf);
const manifest = inspectedFiles.map((item) => Object.fromEntries(Object.entries(item).filter(([key]) => key !== "displayList")));
const manifestFile = join(outputRoot, "manifest.json");
writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

const targetProofs = displayListTargets.map(({ sourceFile, ...target }) => {
  const inspected = inspectedFiles.find((item) => item.sourceFile === sourceFile);
  if (!inspected?.displayList) {
    throw new Error(`Missing parsed display list for ${sourceFile}`);
  }
  return buildDisplayListTargetProof(inspected.displayList, target);
});
for (const target of targetProofs) {
  const missingPromotedAssets = target.promotedAssets.filter((asset) => !existsSync(asset));
  if (missingPromotedAssets.length > 0) {
    target.status = "blocked";
    target.blockers.push(
      `${target.sourceFile} target ${target.key} is missing promoted runtime assets ${missingPromotedAssets.join(", ")}`,
    );
  }
}
const blockedTargets = targetProofs.filter((target) => target.status === "blocked");
if (blockedTargets.length > 0) {
  throw new Error(blockedTargets.flatMap((target) => target.blockers).join("\n"));
}

const proofRoot = join(outputRoot, "display-list");
const targetProofFile = join(proofRoot, "targets.json");
const contactSheetFile = join(proofRoot, "contact-sheet.html");
const catalogFile = "src/data/generated/nutcrackerDisplayListCatalog.ts";
ensureDirectory(proofRoot);
ensureDirectory(dirname(catalogFile));
writeFileSync(targetProofFile, `${JSON.stringify(targetProofs, null, 2)}\n`);
writeFileSync(contactSheetFile, renderDisplayListProofHtml(targetProofs));
writeFileSync(catalogFile, renderDisplayListCatalogModule(targetProofs));

const directPngCount = manifest.reduce((count, item) => count + (item.directPngs?.length ?? 0), 0);
const failedCount = manifest.reduce(
  (count, item) => count + (item.directPngs?.filter((record) => record.error).length ?? 0),
  0,
);

console.log(`Inspected ${manifest.length} SWFs`);
console.log(`Extracted/listed ${directPngCount} direct lossless PNG assets (${failedCount} failures)`);
console.log(`Wrote ${manifestFile}`);
console.log(`Recovered ${targetProofs.length} required display-list composition targets`);
console.log(`Wrote ${targetProofFile}, ${contactSheetFile}, and ${catalogFile}`);

if (failedCount > 0) {
  const failed = manifest
    .flatMap((item) => item.directPngs?.filter((record) => record.error).map((record) => `${item.sourceFile} id ${record.id}`) ?? [])
    .join("\n");
  console.log(`Failed direct PNGs:\n${failed}`);
}
