import { execFileSync } from "node:child_process";
import console from "node:console";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

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

  ensureDirectory(dirname(placementDumpFile));
  writeFileSync(placementDumpFile, placementDump);
  writeFileSync(actionDumpFile, actionDump);
  writeFileSync(textDumpFile, textDump);

  return {
    sourceFile,
    placementDumpFile,
    actionDumpFile,
    textDumpFile,
    directPngs: extractDirectPngs(sourceFile, placementDump),
  };
}

ensureDirectory(outputRoot);

const manifest = sourceFiles.map(inspectSwf);
const manifestFile = join(outputRoot, "manifest.json");
writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

const directPngCount = manifest.reduce((count, item) => count + (item.directPngs?.length ?? 0), 0);
const failedCount = manifest.reduce(
  (count, item) => count + (item.directPngs?.filter((record) => record.error).length ?? 0),
  0,
);

console.log(`Inspected ${manifest.length} SWFs`);
console.log(`Extracted/listed ${directPngCount} direct lossless PNG assets (${failedCount} failures)`);
console.log(`Wrote ${manifestFile}`);

if (failedCount > 0) {
  const failed = manifest
    .flatMap((item) => item.directPngs?.filter((record) => record.error).map((record) => `${item.sourceFile} id ${record.id}`) ?? [])
    .join("\n");
  console.log(`Failed direct PNGs:\n${failed}`);
}
