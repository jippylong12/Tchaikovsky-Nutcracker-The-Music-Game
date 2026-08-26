import { execFileSync, spawnSync } from "node:child_process";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import console from "node:console";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

const currentDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(currentDir, "..");
const projectRoot = resolve(appRoot, "..");
const generatedRoot = join(appRoot, "generated/m08-source-extract");
const promotedRoot = join(appRoot, "src/assets/m08-source");

const fixedSources = [
  ["childrens-album", "analysis/setup/app/games/childrensalbum/childrensalbum.swf"],
  ["orchestra", "analysis/setup/app/games/orchestragame/orchestra.swf"],
  ["toy-soldiers", "analysis/setup/app/games/toysoldiersgame/toysoldiersgame.swf"],
  ["waltz", "analysis/setup/app/games/wedding/waltz.swf"],
];

const repeatedSources = [
  ["loopy-chooser", "analysis/setup/app/games/loopytunes/loopChooser.swf"],
  ...Array.from({ length: 8 }, (_, index) => [
    `loopy-${index + 1}`,
    `analysis/setup/app/games/loopytunes/loop${index + 1}.swf`,
  ]),
  ["alice-chooser", "analysis/setup/app/games/aliceSWF/alice.swf"],
  ...Array.from({ length: 12 }, (_, index) => [
    `alice-${String(index + 1).padStart(2, "0")}`,
    `analysis/setup/app/games/aliceSWF/game_${String(index + 1).padStart(2, "0")}.swf`,
  ]),
  ...Array.from({ length: 8 }, (_, index) => [
    `nut-house-${index + 11}`,
    `analysis/setup/app/games/nuthouse/room${index + 11}.swf`,
  ]),
];

const expectedSourceHashes = {
  "childrens-album": "af83d869e7303b05843eaa890bc1b23ceead48eba4788063b3893667236f09c4",
  orchestra: "51fef8eae8e4afb07af4669d1b6e59a9b0658a71b9dacb5e032c9b60d878300c",
  "toy-soldiers": "64d2a74dbca4a4ef1b7bde631d4abb699741d3e709665449cd23ce535f72e9f8",
  waltz: "169ea6f0b1c180f337841f62483681f312780f5150bb29754dbd8eeffa133ea1",
  "loopy-chooser": "abcf931c9cca711f7266402fe76742857026c4fc0f58a1bb883a35a418fa1f27",
  "loopy-1": "9ccece2107a4710345871f1d2c9ca4145ed20d34c2275ce09d06b43bc2d9b472",
  "loopy-2": "e0634edd4caedef35419f59da913ccdfaee535f9ee64a10365b52def7fcc8e77",
  "loopy-3": "37696a85af9472e0bd52f69e83e9cb33c41ae78ed85790d072cca10f8a86a95e",
  "loopy-4": "32e808e9f12d9b2793178d23d934d4fa8159e61121b939febc8d41bb918c5e6d",
  "loopy-5": "03646074ab12940e06566db62520fc110ab96a90fc5ad36b0e72ab83093878f6",
  "loopy-6": "1172a8b64a116a21f5d9788d73299878000e80c49d1941215d92c167cf24bc26",
  "loopy-7": "8f9c82dd27d5bcb7c18d863c45eda09e7d0b4ed3142c105d719c63c8794a73a6",
  "loopy-8": "3461af3dd01c9922c59162d6dfcfa9261f0719a3abdb6473b60cc03efa14ecb7",
  "alice-chooser": "1a9f87985f22008de407ca6c90bdc89d20f9d52de1df882949d67c72fdbc5bd7",
  "alice-01": "dd71219610a038845916950a7564edcfa1f20a6b00d8a366fbf223b21db99e3a",
  "alice-02": "dd71219610a038845916950a7564edcfa1f20a6b00d8a366fbf223b21db99e3a",
  "alice-03": "dd71219610a038845916950a7564edcfa1f20a6b00d8a366fbf223b21db99e3a",
  "alice-04": "00dd11a74b3519b834f89431887b71662c2dec98000d7a8faf38e72f866f8821",
  "alice-05": "00dd11a74b3519b834f89431887b71662c2dec98000d7a8faf38e72f866f8821",
  "alice-06": "00dd11a74b3519b834f89431887b71662c2dec98000d7a8faf38e72f866f8821",
  "alice-07": "9772b2c4dce89de1f5aad1b48ce5230ef595bfffb6d5dcce8a074d9160b06212",
  "alice-08": "9772b2c4dce89de1f5aad1b48ce5230ef595bfffb6d5dcce8a074d9160b06212",
  "alice-09": "9772b2c4dce89de1f5aad1b48ce5230ef595bfffb6d5dcce8a074d9160b06212",
  "alice-10": "687e03ee6275800034c20d7cdc349e5d0fa0f998925ae9ee738e4f8723d46f6a",
  "alice-11": "687e03ee6275800034c20d7cdc349e5d0fa0f998925ae9ee738e4f8723d46f6a",
  "alice-12": "687e03ee6275800034c20d7cdc349e5d0fa0f998925ae9ee738e4f8723d46f6a",
  "nut-house-11": "d299d0920212410a3148b24f44d6a5f89524d487fec7b723efa2c22df1b87329",
  "nut-house-12": "4e5df2c35bb2e3472e7a45f90d1f9085de21c22b7f458bf68e85006f9f0ebd73",
  "nut-house-13": "6f123e4cefaca135db7e9b5c211bed8e469a1f1ec2d4756c9abb077e807ba0e6",
  "nut-house-14": "362a6d27dc1d2fd2a98f8d10fbdda91813519465a6f45e1e4d6cd1711cdee389",
  "nut-house-15": "17d686dce757a21c20e849bd88cf1967f006e6c2f685adcdf168ffde324ee1d9",
  "nut-house-16": "67c99f418af156d5ae790c012ba6c9f1b86f512c0cc45389e1b3829fa1368916",
  "nut-house-17": "ef49384201d2cced281b35840726b1858f066c8ef28d1a0fc259f96f4f1ab023",
  "nut-house-18": "781b2ac4e88c98473616dcbca6a4544b59066c9d44bb7f4b944523274ecf5d6c",
};

const sources = [...fixedSources, ...repeatedSources].map(([id, swf]) => ({ id, swf }));

const companionMappings = [
  ["analysis/setup/app/games/childrensalbum/preview", "audio/childrens-album/preview"],
  ...Array.from({ length: 8 }, (_, index) => [
    `analysis/setup/app/games/childrensalbum/song${index + 1}`,
    `audio/childrens-album/song${index + 1}`,
  ]),
  ["analysis/setup/app/games/data/childrensalbum.txt", "data/childrensalbum.txt"],
  ["analysis/setup/app/games/data/childrensdoors.txt", "data/childrensdoors.txt"],
  ["analysis/setup/app/games/data/nuthouserooms.txt", "data/nuthouserooms.txt"],
  ["analysis/setup/app/games/wedding/MP3Wedding3.wav", "audio/waltz/MP3Wedding3.wav"],
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function requirePath(path) {
  if (!existsSync(path)) throw new Error(`Required M08 source input is missing: ${relative(projectRoot, path)}`);
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

function preflightInputs() {
  for (const source of sources) {
    const sourcePath = join(projectRoot, source.swf);
    requirePath(sourcePath);
    const swf = readSwf(sourcePath);
    assertEqual(sha256(swf.raw), expectedSourceHashes[source.id], `${source.id} source SWF SHA-256`);
  }
  for (const [sourceRelative] of companionMappings) {
    requirePath(join(projectRoot, sourceRelative));
  }
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

function copySourceFile(sourcePath, targetPath) {
  requirePath(sourcePath);
  mkdirSync(dirname(targetPath), { recursive: true });
  copyFileSync(sourcePath, targetPath);
}

function walkFiles(path) {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path, { withFileTypes: true })
    .flatMap((entry) => walkFiles(join(path, entry.name)))
    .sort();
}

function copyCompanions() {
  const copied = [];
  for (const [sourceRelative, targetRelative] of companionMappings) {
    const sourcePath = join(projectRoot, sourceRelative);
    requirePath(sourcePath);
    const sourceFiles = (statSync(sourcePath).isDirectory() ? walkFiles(sourcePath) : [sourcePath]).filter(
      (filePath) => !filePath.endsWith(".bak") && !(statSync(sourcePath).isDirectory() && filePath.endsWith(".wav")),
    );
    for (const filePath of sourceFiles) {
      const targetPath = statSync(sourcePath).isDirectory()
        ? join(promotedRoot, targetRelative, relative(sourcePath, filePath))
        : join(promotedRoot, targetRelative);
      copySourceFile(filePath, targetPath);
      copied.push({
        source: relative(projectRoot, filePath),
        target: relative(appRoot, targetPath),
        sha256: sha256(readFileSync(filePath)),
      });
    }
  }
  return copied;
}

function extractRootStream(sourcePath, targetPath) {
  const inventory = execFileSync("swfextract", [sourcePath], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  if (!inventory.includes("MP3 Soundstream")) return null;
  mkdirSync(dirname(targetPath), { recursive: true });
  const result = spawnSync("swfextract", ["-m", "-o", targetPath, sourcePath], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  if (!existsSync(targetPath)) {
    return {
      status: "blocked",
      diagnostics: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim().slice(0, 1000),
    };
  }
  return { status: "extracted", output: relative(appRoot, targetPath), sha256: sha256(readFileSync(targetPath)) };
}

function extractEmbeddedSounds(sourcePath, tags, sourceId) {
  return tags.filter((tag) => tag.code === 14).map((tag) => {
    const id = tag.data.readUInt16LE(0);
    const targetPath = join(promotedRoot, "audio/embedded", sourceId, `sound-${id}.mp3`);
    mkdirSync(dirname(targetPath), { recursive: true });
    const result = spawnSync("swfextract", ["-s", String(id), "-o", targetPath, sourcePath], {
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
    if (!existsSync(targetPath)) {
      return {
        id,
        status: "blocked",
        diagnostics: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim().slice(0, 1000),
      };
    }
    return {
      id,
      status: "extracted",
      output: relative(appRoot, targetPath),
      sha256: sha256(readFileSync(targetPath)),
    };
  });
}

function promoteAlias(sourceId, generatedName, promotedName) {
  copySourceFile(
    join(generatedRoot, sourceId, generatedName),
    join(promotedRoot, promotedName),
  );
}

function promoteRenderedSymbol({ sourceId, symbolId, promotedName, width, height, layout = "centered" }) {
  const source = sources.find((candidate) => candidate.id === sourceId);
  if (!source) throw new Error(`Unknown M08 source id for symbol promotion: ${sourceId}`);
  const sourcePath = join(projectRoot, source.swf);
  const helperRoot = join(generatedRoot, sourceId, "promoted-symbols");
  const symbolSwf = join(helperRoot, `symbol-${symbolId}.swf`);
  const wrappedSwf = join(helperRoot, `symbol-${symbolId}-wrapped.swf`);
  const renderedPng = join(helperRoot, `symbol-${symbolId}-wrapped.png`);
  const promotedPath = join(promotedRoot, promotedName);
  const canvasWidth = layout === "wide" ? 1536 : 2048;
  const canvasHeight = layout === "wide" ? 256 : 2048;
  const x = layout === "wide" ? 0 : canvasWidth / 2;
  const y = layout === "wide" ? 0 : canvasHeight / 2;

  mkdirSync(helperRoot, { recursive: true });
  execFileSync("swfextract", ["-i", String(symbolId), "-o", symbolSwf, sourcePath], { stdio: "pipe" });
  execFileSync("swfcombine", [
    "--stack1",
    "-X", String(canvasWidth),
    "-Y", String(canvasHeight),
    "-x", String(x),
    "-y", String(y),
    "-o", wrappedSwf,
    symbolSwf,
  ], { stdio: "pipe" });
  execFileSync("swfrender", ["-o", renderedPng, wrappedSwf], { stdio: "pipe" });
  execFileSync("magick", [
    renderedPng,
    "-trim",
    "+repage",
    "-resize", `${width}x${height}!`,
    "-depth", "8",
    "-define", "png:color-type=6",
    "-define", "png:exclude-chunks=date,time",
    "-strip",
    promotedPath,
  ]);

  return { sourceId, symbolId, promotedName, width, height, layout };
}

function promoteSemanticImages() {
  const aliases = [
    ["childrens-album", "jpeg3-279.png", "childrens-album-scene.png"],
    ["childrens-album", "jpeg3-284.png", "childrens-album-frame-bottom.png"],
    ["childrens-album", "jpeg3-298.png", "childrens-album-frame-medallion.png"],
    ["childrens-album", "jpeg3-306.png", "childrens-album-frame-top.png"],
    ["childrens-album", "jpeg3-311.png", "childrens-album-curtain.png"],
    ["childrens-album", "lossless-294.png", "childrens-album-stage.png"],
    ["orchestra", "jpeg3-30.png", "orchestra-frame-bottom.png"],
    ["orchestra", "jpeg3-734.png", "orchestra-frame-medallion.png"],
    ["orchestra", "jpeg3-742.png", "orchestra-frame-top.png"],
    ["orchestra", "jpeg3-747.png", "orchestra-curtain.png"],
    ["orchestra", "lossless-730.png", "orchestra-stage.png"],
    ["alice-chooser", "jpeg3-67.png", "alice-chooser-jpeg3-67.png"],
    ["alice-chooser", "lossless-85.png", "alice-chooser-lossless-85.png"],
    ["waltz", "root-probe.png", "waltz-source-gradient.png"],
  ];
  const loopyImageIds = [84, 102, 110, 106, 85, 70, 73, 62];
  const loopyStageIds = [88, 106, 114, 110, 89, 74, 77, 66];
  for (let index = 0; index < 8; index += 1) {
    aliases.push([
      `loopy-${index + 1}`,
      `jpeg3-${loopyImageIds[index]}.png`,
      `loopy-${index + 1}-frame-medallion.png`,
    ]);
    aliases.push([
      `loopy-${index + 1}`,
      `lossless-${loopyStageIds[index]}.png`,
      `loopy-${index + 1}-stage.png`,
    ]);
  }
  const alicePrimaryImages = [3, 3, 3, 1, 1, 1, 28, 28, 28, 4, 4, 4];
  for (let index = 0; index < 12; index += 1) {
    const sourceId = `alice-${String(index + 1).padStart(2, "0")}`;
    const imageId = alicePrimaryImages[index];
    aliases.push([
      sourceId,
      `jpeg3-${imageId}.png`,
      `alice-puzzle-${String(index + 1).padStart(2, "0")}-primary.png`,
    ]);
  }
  const nutHouseBackgroundIds = [199, 30, 36, 30, 31, 31, 31, 31];
  const nutHouseFrameIds = [30, 43, 49, 43, 44, 44, 44, 44];
  const nutHouseStageIds = [34, 47, 53, 47, 48, 48, 48, 48];
  for (let index = 0; index < 8; index += 1) {
    const room = index + 11;
    aliases.push([
      `nut-house-${room}`,
      `jpeg3-${nutHouseBackgroundIds[index]}.png`,
      `nut-house-room-${room}-scene.png`,
    ]);
    aliases.push([
      `nut-house-${room}`,
      `jpeg3-${nutHouseFrameIds[index]}.png`,
      `nut-house-room-${room}-frame-medallion.png`,
    ]);
    aliases.push([
      `nut-house-${room}`,
      `lossless-${nutHouseStageIds[index]}.png`,
      `nut-house-room-${room}-stage.png`,
    ]);
  }
  for (const [sourceId, generatedName, promotedName] of aliases) {
    promoteAlias(sourceId, generatedName, promotedName);
  }
  const renderedSymbols = [
    { sourceId: "toy-soldiers", symbolId: 20, promotedName: "toy-soldiers-field.png", width: 509, height: 272 },
    { sourceId: "toy-soldiers", symbolId: 21, promotedName: "toy-soldiers-moving-note.png", width: 92, height: 124 },
    { sourceId: "toy-soldiers", symbolId: 24, promotedName: "toy-soldiers-staff.png", width: 487, height: 176 },
    { sourceId: "toy-soldiers", symbolId: 25, promotedName: "toy-soldiers-correct-flash.png", width: 79, height: 81 },
    { sourceId: "toy-soldiers", symbolId: 27, promotedName: "toy-soldiers-wrong-flash.png", width: 85, height: 94 },
    { sourceId: "toy-soldiers", symbolId: 29, promotedName: "toy-soldiers-soldier.png", width: 42, height: 42 },
    { sourceId: "toy-soldiers", symbolId: 32, promotedName: "toy-soldiers-play-button-body.png", width: 177, height: 42 },
    { sourceId: "toy-soldiers", symbolId: 34, promotedName: "toy-soldiers-play-button-label.png", width: 92, height: 15, layout: "wide" },
    { sourceId: "toy-soldiers", symbolId: 37, promotedName: "toy-soldiers-correct-label.png", width: 288, height: 31, layout: "wide" },
  ].map(promoteRenderedSymbol);
  return [
    ...aliases.map(([sourceId, generatedName, promotedName]) => ({ sourceId, generatedName, promotedName })),
    ...renderedSymbols,
  ];
}

preflightInputs();
rmSync(generatedRoot, { recursive: true, force: true });
rmSync(promotedRoot, { recursive: true, force: true });
mkdirSync(generatedRoot, { recursive: true });
mkdirSync(promotedRoot, { recursive: true });

const manifest = [];
for (const source of sources) {
  const sourcePath = join(projectRoot, source.swf);
  requirePath(sourcePath);
  const outputRoot = join(generatedRoot, source.id);
  const promotedImageRoot = join(promotedRoot, "images", source.id);
  mkdirSync(outputRoot, { recursive: true });
  mkdirSync(promotedImageRoot, { recursive: true });
  const swf = readSwf(sourcePath);
  assertEqual(sha256(swf.raw), expectedSourceHashes[source.id], `${source.id} source SWF SHA-256`);
  const tags = readTags(swf.body, swf.tagStart);
  const jpeg3 = tags.filter((tag) => tag.code === 35).map((tag) => extractJpeg3(tag, outputRoot));
  const lossless = tags.filter((tag) => tag.code === 20 || tag.code === 36).map((tag) => {
    const id = tag.data.readUInt16LE(0);
    const outputPath = join(outputRoot, `lossless-${id}.png`);
    execFileSync("swfextract", ["-p", String(id), "-o", outputPath, sourcePath], { stdio: "pipe" });
    return { id, sha256: sha256(readFileSync(outputPath)), output: relative(appRoot, outputPath) };
  });
  for (const image of [...jpeg3, ...lossless]) {
    const generatedPath = join(appRoot, image.output);
    copySourceFile(generatedPath, join(promotedImageRoot, generatedPath.split("/").at(-1)));
  }
  for (const [name, flag] of [["actions", "-a"], ["placements", "-p"], ["text", "-t"]]) {
    writeFileSync(join(outputRoot, `${name}.txt`), execFileSync("swfdump", [flag, sourcePath], { maxBuffer: 64 * 1024 * 1024 }));
  }
  const rootProbePath = join(outputRoot, "root-probe.png");
  const rootProbe = spawnSync("swfrender", ["-o", rootProbePath, sourcePath], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  const rootProbeExists = existsSync(rootProbePath);
  const stream = extractRootStream(sourcePath, join(promotedRoot, "audio/embedded", `${source.id}.mp3`));
  const embeddedSounds = extractEmbeddedSounds(sourcePath, tags, source.id);
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
    lossless,
    stream,
    embeddedSounds,
    rootProbe: {
      status: rootProbe.status,
      signal: rootProbe.signal,
      output: rootProbeExists ? relative(appRoot, rootProbePath) : null,
      diagnostics: `${rootProbe.stdout ?? ""}${rootProbe.stderr ?? ""}`.trim().slice(0, 1000),
    },
  });
}

const companions = copyCompanions();
const semanticImageAliases = promoteSemanticImages();
const manifestPayload = {
  generatedBy: "app/scripts/extract-m08-source-assets.mjs",
  sources: manifest,
  companions,
  semanticImageAliases,
};
writeFileSync(join(generatedRoot, "manifest.json"), `${JSON.stringify(manifestPayload, null, 2)}\n`);
writeFileSync(join(generatedRoot, "contact-sheet.html"), `<!doctype html>
<meta charset="utf-8"><title>M08 recovered source contact sheet</title>
<style>body{font:14px system-ui;background:#eee;color:#111}section{margin:24px}figure{display:inline-grid;gap:4px;margin:8px;padding:8px;background:#fff;vertical-align:top}img{max-width:280px;max-height:220px}code{max-width:280px;overflow-wrap:anywhere}</style>
<h1>M08 recovered source contact sheet</h1>
${manifest.map((entry) => `<section><h2>${entry.id}</h2>${[...entry.jpeg3, ...entry.lossless].map((image) => `<figure><img src="./${entry.id}/${image.output.split("/").at(-1)}" alt=""><code>${image.output}</code></figure>`).join("")}</section>`).join("\n")}`);

const imageCount = manifest.reduce((total, source) => total + source.jpeg3.length + source.lossless.length, 0);
const streamCount = manifest.filter((source) => source.stream?.status === "extracted").length;
const soundCount = manifest.reduce(
  (total, source) => total + source.embeddedSounds.filter((sound) => sound.status === "extracted").length,
  0,
);
console.log(`M08 source audit extracted ${manifest.length} SWFs, ${imageCount} source images, ${streamCount} embedded streams, ${soundCount} embedded sounds, and ${companions.length} companion files.`);
