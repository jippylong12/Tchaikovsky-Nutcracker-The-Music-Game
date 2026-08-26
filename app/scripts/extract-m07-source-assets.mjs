import { execFileSync } from "node:child_process";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import console from "node:console";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

const currentDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(currentDir, "..");
const projectRoot = resolve(appRoot, "..");
const generatedRoot = join(appRoot, "generated/m07-source-extract");
const promotedRoot = join(appRoot, "src/assets/m07-source");

const sources = [
  {
    id: "trivia",
    swf: "analysis/setup/app/games/trivia/trivia.swf",
    companions: ["analysis/setup/app/games/trivia/questions"],
    directPngIds: [],
  },
  {
    id: "melody",
    swf: "analysis/setup/app/games/melody/melody.swf",
    companions: ["analysis/setup/app/games/melody/snd"],
    directPngIds: [33],
  },
  {
    id: "memory",
    swf: "analysis/setup/app/games/memorygame/memory.swf",
    companions: ["analysis/setup/app/games/memorygame/snd"],
    directPngIds: [119],
  },
  {
    id: "tree",
    swf: "analysis/setup/app/games/tree/tree.swf",
    companions: [
      "analysis/setup/app/games/tree/dummy.swf",
      "analysis/setup/app/games/tree/Snd_1",
      "analysis/setup/app/games/tree/Snd_2",
      "analysis/setup/app/games/tree/Snd_3",
    ],
    directPngIds: [63],
  },
  {
    id: "flying-instruments",
    swf: "analysis/setup/app/games/flyinginstruments/flyinginstruments.swf",
    companions: [],
    directPngIds: [184],
  },
];

const expectedSourceHashes = {
  trivia: "4c4841aae981e5d96852c44d05f5c435cc069a461bd2f4ffec9a17d58c1cad77",
  melody: "cd6a2e1b10664de578a1505c4cf01e88c63f89bc9820e296b58d22984fc73ead",
  memory: "86b7e690388fa8a0d1f826642d63fb51a1550fc6c6ef516f6983ea07a9e70ce6",
  tree: "c32f04ce0c862d740a8e1147440c2c397f09a8acd846d066a993b5c03bc035ea",
  "flying-instruments": "36d3515a8edb048ca9f1c05552c4a243638c09fd9ead1ce03e9bba609ad7c9c5",
};

const sourceImagePromotions = {
  trivia: { "jpeg3-5.png": "trivia-book.png" },
  melody: {
    "jpeg3-27.png": "melody-frame-bottom.png",
    "jpeg3-37.png": "melody-frame-medallion.png",
    "jpeg3-41.png": "melody-frame-top.png",
    "jpeg3-46.png": "melody-curtain.png",
    "lossless-33.png": "melody-stage.png",
  },
  memory: {
    "jpeg3-113.png": "memory-frame-bottom.png",
    "jpeg3-123.png": "memory-frame-medallion.png",
    "jpeg3-127.png": "memory-frame-top.png",
    "jpeg3-132.png": "memory-curtain.png",
    "lossless-119.png": "memory-stage.png",
  },
  tree: {
    "jpeg3-4.png": "tree-hallway-line-art.png",
    "jpeg3-57.png": "tree-frame-bottom.png",
    "jpeg3-67.png": "tree-frame-medallion.png",
    "jpeg3-71.png": "tree-frame-top.png",
    "jpeg3-76.png": "tree-curtain.png",
    "lossless-63.png": "tree-stage.png",
  },
  "flying-instruments": {
    "jpeg3-74.png": "flying-flute.png",
    "jpeg3-76.png": "flying-oboe.png",
    "jpeg3-79.png": "flying-clarinet.png",
    "jpeg3-82.png": "flying-bassoon.png",
    "jpeg3-85.png": "flying-harp.png",
    "jpeg3-88.png": "flying-grand-piano-blue.png",
    "jpeg3-91.png": "flying-grand-piano-brown.png",
    "jpeg3-94.png": "flying-drum.png",
    "jpeg3-97.png": "flying-cymbals.png",
    "jpeg3-100.png": "flying-double-bass.png",
    "jpeg3-103.png": "flying-cello.png",
    "jpeg3-106.png": "flying-violin.png",
    "jpeg3-111.png": "flying-trumpet.png",
    "jpeg3-114.png": "flying-trombone.png",
    "jpeg3-117.png": "flying-french-horn.png",
    "jpeg3-120.png": "flying-tuba.png",
    "jpeg3-123.png": "flying-star.png",
    "jpeg3-178.png": "flying-frame-bottom.png",
    "jpeg3-188.png": "flying-frame-medallion.png",
    "jpeg3-192.png": "flying-frame-top.png",
    "jpeg3-197.png": "flying-curtain.png",
    "lossless-184.png": "flying-stage.png",
  },
};

const memoryCardShapeIds = [26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 53, 55, 36, 56];
const treeShapePromotions = new Map([
  [1, "tree-sky-gradient.png"],
  [2, "tree-door-blue.png"],
  [3, "tree-hallway-color.png"],
  [7, "tree-branch.png"],
]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function requirePath(path) {
  if (!existsSync(path)) throw new Error(`Required M07 source input is missing: ${relative(projectRoot, path)}`);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label} drifted: expected ${expected}, received ${actual}`);
}

function readBits(buffer, bitOffset, bitCount) {
  let value = 0;
  for (let index = 0; index < bitCount; index += 1) {
    const absolute = bitOffset + index;
    value = (value << 1) | ((buffer[Math.floor(absolute / 8)] >> (7 - (absolute % 8))) & 1);
  }
  return value;
}

function readSwf(path) {
  const raw = readFileSync(path);
  const signature = raw.subarray(0, 3).toString("ascii");
  if (signature !== "FWS" && signature !== "CWS") throw new Error(`Unsupported SWF signature ${signature}`);
  const body = signature === "CWS"
    ? Buffer.concat([Buffer.from("FWS"), raw.subarray(3, 8), inflateSync(raw.subarray(8))])
    : raw;
  const rectBitCount = readBits(body, 64, 5);
  const tagStart = 8 + Math.ceil((5 + 4 * rectBitCount) / 8) + 4;
  return { raw, body, tagStart };
}

function readTags(buffer, start) {
  const tags = [];
  let offset = start;
  while (offset + 2 <= buffer.length) {
    const header = buffer.readUInt16LE(offset);
    offset += 2;
    const code = header >> 6;
    let length = header & 0x3f;
    if (length === 0x3f) {
      length = buffer.readUInt32LE(offset);
      offset += 4;
    }
    if (offset + length > buffer.length) throw new Error(`Truncated SWF tag ${code}`);
    tags.push({ code, data: buffer.subarray(offset, offset + length) });
    offset += length;
    if (code === 0) break;
  }
  return tags;
}

function repairSwfJpegMarkers(buffer) {
  const markerPair = Buffer.from([0xff, 0xd9, 0xff, 0xd8]);
  const chunks = [];
  let rest = buffer;
  let markerIndex = rest.indexOf(markerPair);
  while (markerIndex !== -1) {
    chunks.push(rest.subarray(0, markerIndex));
    rest = rest.subarray(markerIndex + markerPair.length);
    markerIndex = rest.indexOf(markerPair);
  }
  chunks.push(rest);
  return Buffer.concat(chunks);
}

function readJpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;
    if (marker === 0xd9 || marker === 0xda) break;
    const length = buffer.readUInt16BE(offset);
    if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7)) {
      return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  throw new Error("JPEG dimensions were not found");
}

function extractJpeg3(tag, outputRoot) {
  const id = tag.data.readUInt16LE(0);
  const alphaOffset = tag.data.readUInt32LE(2);
  const jpeg = repairSwfJpegMarkers(tag.data.subarray(6, 6 + alphaOffset));
  const alpha = inflateSync(tag.data.subarray(6 + alphaOffset));
  const { width, height } = readJpegDimensions(jpeg);
  if (alpha.length !== width * height) throw new Error(`JPEG3 ${id} alpha size mismatch`);
  const jpegPath = join(outputRoot, `jpeg3-${id}.jpg`);
  const alphaPath = join(outputRoot, `jpeg3-${id}.alpha.pgm`);
  const pngPath = join(outputRoot, `jpeg3-${id}.png`);
  writeFileSync(jpegPath, jpeg);
  writeFileSync(alphaPath, Buffer.concat([Buffer.from(`P5\n${width} ${height}\n255\n`), alpha]));
  execFileSync("magick", [
    jpegPath,
    alphaPath,
    "-alpha", "off",
    "-compose", "CopyOpacity",
    "-composite",
    "-depth", "8",
    "-define", "png:color-type=6",
    "-define", "png:exclude-chunks=date,time",
    "-strip",
    pngPath,
  ]);
  return { id, width, height, sha256: sha256(readFileSync(pngPath)), output: relative(appRoot, pngPath) };
}

function walkFiles(path) {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path, { withFileTypes: true })
    .flatMap((entry) => walkFiles(join(path, entry.name)))
    .sort();
}

function companionInventory(paths) {
  return paths.flatMap((relativePath) => {
    const absolutePath = join(projectRoot, relativePath);
    requirePath(absolutePath);
    return walkFiles(absolutePath).map((filePath) => ({
      path: relative(projectRoot, filePath),
      bytes: statSync(filePath).size,
      sha256: sha256(readFileSync(filePath)),
      type: extname(filePath).slice(1).toLowerCase(),
    }));
  });
}

function copySourceFile(sourcePath, targetPath) {
  requirePath(sourcePath);
  mkdirSync(dirname(targetPath), { recursive: true });
  copyFileSync(sourcePath, targetPath);
}

function renderTrimmedSymbol(sourcePath, id, generatedPath, promotedPath) {
  const symbolPath = `${generatedPath}.swf`;
  const renderPath = `${generatedPath}.full.png`;
  execFileSync("swfextract", ["-i", String(id), "-o", symbolPath, sourcePath], { stdio: "pipe" });
  execFileSync("swfrender", ["-o", renderPath, symbolPath], { stdio: "pipe" });
  mkdirSync(dirname(promotedPath), { recursive: true });
  execFileSync("magick", [
    renderPath,
    "-trim", "+repage",
    "-depth", "8",
    "-define", "png:color-type=6",
    "-define", "png:exclude-chunks=date,time",
    "-strip",
    promotedPath,
  ]);
  return { id, output: relative(appRoot, promotedPath), sha256: sha256(readFileSync(promotedPath)) };
}

function promoteCompanionFiles() {
  const mappings = [
    ["analysis/setup/app/games/trivia/questions", "data/trivia"],
    ["analysis/setup/app/games/melody/snd", "audio/melody"],
    ["analysis/setup/app/games/memorygame/snd", "audio/memory"],
    ["analysis/setup/app/games/tree/Snd_1", "audio/tree/Snd_1"],
    ["analysis/setup/app/games/tree/Snd_2", "audio/tree/Snd_2"],
    ["analysis/setup/app/games/tree/Snd_3", "audio/tree/Snd_3"],
  ];
  for (const [sourceDirectory, targetDirectory] of mappings) {
    const sourceRoot = join(projectRoot, sourceDirectory);
    for (const sourcePath of walkFiles(sourceRoot)) {
      copySourceFile(sourcePath, join(promotedRoot, targetDirectory, relative(sourceRoot, sourcePath)));
    }
  }
}

function extractEmbeddedSound(sourcePath, sourceId, targetPath) {
  mkdirSync(dirname(targetPath), { recursive: true });
  execFileSync("swfextract", ["-s", String(sourceId), "-o", targetPath, sourcePath], { stdio: "pipe" });
}

rmSync(generatedRoot, { recursive: true, force: true });
rmSync(promotedRoot, { recursive: true, force: true });
mkdirSync(generatedRoot, { recursive: true });
mkdirSync(promotedRoot, { recursive: true });
const manifest = [];

for (const source of sources) {
  const sourcePath = join(projectRoot, source.swf);
  requirePath(sourcePath);
  const outputRoot = join(generatedRoot, source.id);
  mkdirSync(outputRoot, { recursive: true });
  const swf = readSwf(sourcePath);
  assertEqual(sha256(swf.raw), expectedSourceHashes[source.id], `${source.id} source SWF SHA-256`);
  const tags = readTags(swf.body, swf.tagStart);
  const jpeg3 = tags.filter((tag) => tag.code === 35).map((tag) => extractJpeg3(tag, outputRoot));
  const directPng = source.directPngIds.map((id) => {
    const outputPath = join(outputRoot, `lossless-${id}.png`);
    execFileSync("swfextract", ["-p", String(id), "-o", outputPath, sourcePath], { stdio: "pipe" });
    return { id, sha256: sha256(readFileSync(outputPath)), output: relative(appRoot, outputPath) };
  });
  for (const [name, flag] of [["actions", "-a"], ["placements", "-p"], ["text", "-t"]]) {
    writeFileSync(join(outputRoot, `${name}.txt`), execFileSync("swfdump", [flag, sourcePath], { maxBuffer: 64 * 1024 * 1024 }));
  }
  manifest.push({
    id: source.id,
    source: source.swf,
    sourceBytes: swf.raw.length,
    sourceSha256: sha256(swf.raw),
    frameCount: Number(execFileSync("swfdump", ["-f", sourcePath], { encoding: "utf8" }).trim().split(" ")[1]),
    frameRate: Number(execFileSync("swfdump", ["-r", sourcePath], { encoding: "utf8" }).trim().split(" ")[1]),
    width: Number(execFileSync("swfdump", ["-X", sourcePath], { encoding: "utf8" }).trim().split(" ")[1]),
    height: Number(execFileSync("swfdump", ["-Y", sourcePath], { encoding: "utf8" }).trim().split(" ")[1]),
    jpeg3,
    directPng,
    companions: companionInventory(source.companions),
    fullRootRender: {
      status: "blocked",
      tool: "local swfrender",
      observedFailure: source.id === "flying-instruments"
        ? "Rendered a transparent 640 x 480 PNG while reporting missing JPEG support and unknown child IDs."
        : "Produced no PNG while reporting missing JPEG support; additional gradient or unknown-child errors vary by source.",
    },
  });
}

for (const [sourceId, promotions] of Object.entries(sourceImagePromotions)) {
  for (const [generatedName, promotedName] of Object.entries(promotions)) {
    copySourceFile(join(generatedRoot, sourceId, generatedName), join(promotedRoot, promotedName));
  }
}

const memorySourcePath = join(projectRoot, "analysis/setup/app/games/memorygame/memory.swf");
const memoryShapeEvidence = [
  renderTrimmedSymbol(memorySourcePath, 61, join(generatedRoot, "memory/card-back-61"), join(promotedRoot, "memory-card-back.png")),
  ...memoryCardShapeIds.map((id, index) => renderTrimmedSymbol(
    memorySourcePath,
    id,
    join(generatedRoot, `memory/card-face-${id}`),
    join(promotedRoot, `memory-card-face-${String(index + 1).padStart(2, "0")}.png`),
  )),
];

const treeSourcePath = join(projectRoot, "analysis/setup/app/games/tree/tree.swf");
const treeShapeEvidence = [...treeShapePromotions].map(([id, name]) => renderTrimmedSymbol(
  treeSourcePath,
  id,
  join(generatedRoot, `tree/layer-${id}`),
  join(promotedRoot, name),
));

const flyingSourcePath = join(projectRoot, "analysis/setup/app/games/flyinginstruments/flyinginstruments.swf");
const flyingShapeEvidence = [
  renderTrimmedSymbol(
    flyingSourcePath,
    48,
    join(generatedRoot, "flying-instruments/instrument-viola-48"),
    join(promotedRoot, "flying-viola.png"),
  ),
];

promoteCompanionFiles();
const triviaSourcePath = join(projectRoot, "analysis/setup/app/games/trivia/trivia.swf");
extractEmbeddedSound(triviaSourcePath, 100, join(promotedRoot, "audio/trivia/intro.mp3"));
extractEmbeddedSound(triviaSourcePath, 135, join(promotedRoot, "audio/trivia/correct.mp3"));
extractEmbeddedSound(triviaSourcePath, 150, join(promotedRoot, "audio/trivia/wrong.mp3"));

const flyingSoundExports = new Map([
  [1, "sound12"], [2, "sound13"], [3, "sound17"], [4, "sound14"], [5, "sound15"],
  [6, "sound8"], [7, "sound9"], [8, "sound6"], [9, "sound2"], [10, "sound16"],
  [11, "sound7"], [12, "sound5"], [13, "sound1"], [14, "family4"], [15, "family1"],
  [16, "family3"], [17, "family2"], [18, "sound3"], [19, "sound11"], [20, "sound4"], [21, "sound10"],
]);
for (const [id, exportName] of flyingSoundExports) {
  extractEmbeddedSound(flyingSourcePath, id, join(promotedRoot, `audio/flying/${exportName}.mp3`));
}

const manifestPath = join(generatedRoot, "manifest.json");
writeFileSync(manifestPath, `${JSON.stringify({
  generatedBy: "app/scripts/extract-m07-source-assets.mjs",
  sources: manifest,
  promotions: {
    sourceImages: sourceImagePromotions,
    memoryShapeEvidence,
    treeShapeEvidence,
    flyingShapeEvidence,
    triviaEmbeddedSounds: { 100: "intro", 135: "correct", 150: "wrong" },
    flyingSoundExports: Object.fromEntries(flyingSoundExports),
  },
}, null, 2)}\n`);
writeFileSync(join(generatedRoot, "contact-sheet.html"), `<!doctype html>
<meta charset="utf-8"><title>M07 recovered source contact sheet</title>
<style>body{font:14px system-ui;background:#eee;color:#111}section{margin:24px}figure{display:inline-grid;gap:4px;margin:8px;padding:8px;background:#fff;vertical-align:top}img{max-width:280px;max-height:220px}code{max-width:280px;overflow-wrap:anywhere}</style>
<h1>M07 recovered source contact sheet</h1>
${manifest.map((entry) => `<section><h2>${entry.id}</h2>${[...entry.jpeg3, ...entry.directPng].map((image) => `<figure><img src="./${entry.id}/${image.output.split("/").at(-1)}" alt=""><code>${image.output}</code></figure>`).join("")}</section>`).join("\n")}`);

console.log(`M07 source audit extracted ${manifest.length} SWFs, ${manifest.reduce((total, item) => total + item.jpeg3.length + item.directPng.length, 0)} source images, and ${manifest.reduce((total, item) => total + item.companions.length, 0)} companion files.`);
