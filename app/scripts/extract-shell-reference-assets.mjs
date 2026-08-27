import { execFileSync } from "node:child_process";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import console from "node:console";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { extractEmbeddedSwf } from "./lib/flash-projector.mjs";

const currentDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(currentDir, "..");
const projectRoot = resolve(appRoot, "..");
const generatedRoot = join(appRoot, "generated/shell-reference-source-extract");
const promotedRoot = join(appRoot, "src/assets/source-scenes");
const projectorPath = join(projectRoot, "analysis/setup/app/Nutcracker2.exe");
const introPath = join(projectRoot, "analysis/setup/app/flute_intro.swf");
const gramophonePath = join(projectRoot, "analysis/setup/app/activities/originals/gramophone.swf");
const projectorChooseCapturePath = join(
  appRoot,
  "source-evidence/shell/projector-choose-source.png",
);
const projectorPlayRoomLayerCapturePath = join(
  appRoot,
  "source-evidence/shell/projector-playroom-layer-source.png",
);
const readerSources = [
  {
    name: "story",
    path: join(projectRoot, "analysis/setup/app/activities/story/story.swf"),
    sourceSha256: "e9445db9802becdd4ac04dfbd917ec1aec1c53432de23ba1d3fbde448c2a017f",
    bookSha256: "e6257fedfea3a714382c52f764f8022fbed5b2e47d1f2d6d5b3933b9ada650b2",
  },
  {
    name: "biography",
    path: join(projectRoot, "analysis/setup/app/activities/biography/biography.swf"),
    sourceSha256: "476e70ba2027bfd80524373c926821f2f430e468b45209e7e7a98e09294b6063",
    bookSha256: "6397fe3b7b90768c0136c7c203234fe41d8eca6e2aff680c084071b6b623ff51",
  },
  {
    name: "ballet",
    path: join(projectRoot, "analysis/setup/app/activities/ballet/ballet.swf"),
    sourceSha256: "b0f95b56cbaebfb3a75ce295e413095a561dc16d36c44fd0d779f5fecbb6cf65",
    bookSha256: "4ad48b9beb2c2cb7b21070afe575df1f241b7ff89de126b6f4079bd8837044e8",
  },
];

const expected = {
  projectorSha256: "79e464b0af7452697e0d63c71a6829848834f6fe3d7a311129c82e0b08935bab",
  projectorOffset: 864256,
  projectorDeclaredLength: 6085533,
  playRoomJpegId: 518,
  playRoomSha256: "c0b4eb8a1b3a1fbf196bbc05a301d2b615de69e119d15bd09e694b7de796eddc",
  projectorChooseCaptureSha256: "d3cae55ce2e93c21bc461f7e6ccf8a5f5f83d6d001f6b9f32a63b906b9b093e5",
  projectorPlayRoomLayerCaptureSha256: "93a4f305c588c65665ec506545554f7c751740d18c1cd715743ea78a02412b0e",
  playRoomCompositeSha256: "f1f42c978c8735db266e6aa89bf67d34b2e4b84e7f9b43acfdc47a720b298f75",
  introSha256: "aa92b6b3022c3cf3030cecd7c06888aebd929a63bcc7b3ce18119f3f7476b782",
  introJpegId: 371,
  introStillSha256: "90185364eb26cb2b295084db962c23aeab64090d268ae09c89add44489d27e7d",
  gramophoneSha256: "76310a834c1ba3773bd429b594a20a1083b61c657d78de4fc9c1ac20cc58bbdf",
  gramophoneJpeg3Id: 45,
  gramophoneArtSha256: "e194eaf7018eedd3b980af3deadea6f70514cd99fbfa896145e364538981609d",
  listeningFramePngId: 108,
  listeningFrameSha256: "2a7b7bcb2a30b9e5e9fb5b5a82919e7b14605729e4f3c75e12a83928f0fa5261",
  listeningRecords: [
    { name: "lp1", spriteId: 63, sha256: "03ed65051b2f611b749ebfb1f527c77af5eed772d54cffc523da5dfb3e6de16a" },
    { name: "lp2", spriteId: 70, sha256: "eac8825b5fe13e7feecece7ccb3051d21fa0c1154dea6bac138028937ff55ff9" },
    { name: "lp3", spriteId: 72, sha256: "03fbec6756645a1c86184fe88f707ca9191e7ef1c91ee268d177085bd8c4a455" },
    { name: "lp4", spriteId: 66, sha256: "ee2b277b6ae87dd1c71dddd460dfb137759eb5efab05a4f72966f6a66aa655fc" },
    { name: "lp5", spriteId: 59, sha256: "8fc9a896ea6b361be3ada8028b87cff8142ea707eb953924064bab0df29ba01a" },
  ],
};

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function assertEqual(actual, wanted, label) {
  if (actual !== wanted) {
    throw new Error(`${label} drifted: expected ${wanted}, received ${actual}`);
  }
}

function requireFile(path) {
  if (!existsSync(path)) {
    throw new Error(`Required source file is missing: ${path}`);
  }
}

function extractJpeg(sourceSwf, jpegId, targetPath) {
  execFileSync("swfextract", ["-j", String(jpegId), "-o", targetPath, sourceSwf], { stdio: "pipe" });
  return readFileSync(targetPath);
}

function readBits(buffer, bitOffset, bitCount) {
  let value = 0;
  for (let index = 0; index < bitCount; index += 1) {
    const absolute = bitOffset + index;
    value = (value << 1) | ((buffer[Math.floor(absolute / 8)] >> (7 - (absolute % 8))) & 1);
  }
  return value;
}

function readTags(buffer) {
  const rectBits = readBits(buffer, 64, 5);
  let offset = 8 + Math.ceil((5 + 4 * rectBits) / 8) + 4;
  const tags = [];
  while (offset + 2 <= buffer.length) {
    const header = buffer.readUInt16LE(offset);
    offset += 2;
    const code = header >> 6;
    let length = header & 0x3f;
    if (length === 0x3f) {
      length = buffer.readUInt32LE(offset);
      offset += 4;
    }
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

function extractJpeg3(sourceSwf, jpegId, targetPath, generatedName, pngComment) {
  const tag = readTags(sourceSwf).find((candidate) => candidate.code === 35 && candidate.data.readUInt16LE(0) === jpegId);
  if (!tag) throw new Error(`JPEG3 ${jpegId} is missing`);
  const alphaOffset = tag.data.readUInt32LE(2);
  const jpeg = repairSwfJpegMarkers(tag.data.subarray(6, 6 + alphaOffset));
  const alpha = inflateSync(tag.data.subarray(6 + alphaOffset));
  const { width, height } = readJpegDimensions(jpeg);
  assertEqual(alpha.length, width * height, `JPEG3 ${jpegId} alpha length`);
  const jpgPath = join(generatedRoot, `${generatedName}-jpeg3-${jpegId}.jpg`);
  const alphaPath = join(generatedRoot, `${generatedName}-jpeg3-${jpegId}.alpha.pgm`);
  writeFileSync(jpgPath, jpeg);
  writeFileSync(alphaPath, Buffer.concat([Buffer.from(`P5\n${width} ${height}\n255\n`), alpha]));
  const magickArguments = [
    jpgPath,
    alphaPath,
    "-alpha",
    "off",
    "-compose",
    "CopyOpacity",
    "-composite",
    "-depth",
    "8",
    "-define",
    "png:color-type=6",
    "-define",
    "png:exclude-chunks=date,time",
    "-strip",
  ];
  magickArguments.push(targetPath);
  execFileSync("magick", magickArguments);
  if (pngComment) {
    const commentedPath = `${targetPath}.commented.png`;
    execFileSync("magick", [
      targetPath,
      "-define",
      "png:exclude-chunks=date,time",
      "-set",
      "Comment",
      pngComment,
      commentedPath,
    ]);
    renameSync(commentedPath, targetPath);
  }
  return readFileSync(targetPath);
}

requireFile(projectorPath);
requireFile(introPath);
requireFile(gramophonePath);
requireFile(projectorChooseCapturePath);
requireFile(projectorPlayRoomLayerCapturePath);
readerSources.forEach((reader) => requireFile(reader.path));
mkdirSync(generatedRoot, { recursive: true });
mkdirSync(promotedRoot, { recursive: true });

const projector = readFileSync(projectorPath);
assertEqual(sha256(projector), expected.projectorSha256, "Nutcracker2.exe SHA-256");
const embedded = extractEmbeddedSwf(projector, "analysis/setup/app/Nutcracker2.exe");
assertEqual(embedded.offset, expected.projectorOffset, "projector SWF offset");
assertEqual(embedded.declaredLength, expected.projectorDeclaredLength, "projector SWF declared length");

const mainSwfPath = join(generatedRoot, "nutcracker2-main.swf");
writeFileSync(mainSwfPath, embedded.swf);
for (const [suffix, flag] of [["actions", "-a"], ["placements", "-p"], ["text", "-t"]]) {
  writeFileSync(
    join(generatedRoot, `nutcracker2-main.${suffix}.txt`),
    execFileSync("swfdump", [flag, mainSwfPath], { maxBuffer: 64 * 1024 * 1024 }),
  );
}

const playRoomPath = join(promotedRoot, "main-playroom-background.jpg");
const playRoom = extractJpeg(mainSwfPath, expected.playRoomJpegId, playRoomPath);
assertEqual(sha256(playRoom), expected.playRoomSha256, "playRoom JPEG 518 SHA-256");

const projectorChooseCapture = readFileSync(projectorChooseCapturePath);
assertEqual(
  sha256(projectorChooseCapture),
  expected.projectorChooseCaptureSha256,
  "projector choose Ruffle capture SHA-256",
);
const projectorChoosePath = join(promotedRoot, "projector-choose-source.png");
writeFileSync(projectorChoosePath, projectorChooseCapture);

const projectorPlayRoomLayerCapture = readFileSync(projectorPlayRoomLayerCapturePath);
assertEqual(
  sha256(projectorPlayRoomLayerCapture),
  expected.projectorPlayRoomLayerCaptureSha256,
  "projector playRoom layer Ruffle capture SHA-256",
);
const transparentPlayRoomLayerPath = join(generatedRoot, "projector-playroom-layer-transparent.png");
execFileSync("magick", [
  projectorPlayRoomLayerCapturePath,
  "-alpha",
  "on",
  "-fuzz",
  "7%",
  "-transparent",
  "#000066",
  "-depth",
  "8",
  "-define",
  "png:color-type=6",
  "-define",
  "png:exclude-chunks=date,time",
  "-strip",
  transparentPlayRoomLayerPath,
]);
const playRoomCompositePath = join(promotedRoot, "main-playroom-source-composite.png");
execFileSync("magick", [
  playRoomPath,
  transparentPlayRoomLayerPath,
  "-compose",
  "over",
  "-composite",
  "-depth",
  "8",
  "-define",
  "png:color-type=2",
  "-define",
  "png:exclude-chunks=date,time",
  "-strip",
  playRoomCompositePath,
]);
const playRoomComposite = readFileSync(playRoomCompositePath);
assertEqual(
  sha256(playRoomComposite),
  expected.playRoomCompositeSha256,
  "composed playRoom source capture SHA-256",
);

const intro = readFileSync(introPath);
assertEqual(sha256(intro), expected.introSha256, "flute_intro.swf SHA-256");
for (const [suffix, flag] of [["actions", "-a"], ["placements", "-p"], ["text", "-t"]]) {
  writeFileSync(
    join(generatedRoot, `flute-intro.${suffix}.txt`),
    execFileSync("swfdump", [flag, introPath], { maxBuffer: 64 * 1024 * 1024 }),
  );
}
const introStillPath = join(promotedRoot, "flute-intro-garden.jpg");
const introStill = extractJpeg(introPath, expected.introJpegId, introStillPath);
assertEqual(sha256(introStill), expected.introStillSha256, "flute intro JPEG 371 SHA-256");

const gramophone = readFileSync(gramophonePath);
assertEqual(sha256(gramophone), expected.gramophoneSha256, "gramophone.swf SHA-256");
const gramophoneArtPath = join(promotedRoot, "listening-room-gramophone.png");
const gramophoneArt = extractJpeg3(gramophone, expected.gramophoneJpeg3Id, gramophoneArtPath, "gramophone");
assertEqual(sha256(gramophoneArt), expected.gramophoneArtSha256, "gramophone JPEG3 45 SHA-256");
const listeningFramePath = join(promotedRoot, "listening-room-frame.png");
execFileSync("swfextract", ["-p", String(expected.listeningFramePngId), "-o", listeningFramePath, gramophonePath]);
const listeningFrame = readFileSync(listeningFramePath);
assertEqual(sha256(listeningFrame), expected.listeningFrameSha256, "listening room PNG 108 SHA-256");

const listeningRecords = expected.listeningRecords.map((record) => {
  const extractedPath = join(generatedRoot, `listening-room-record-${record.name}.swf`);
  const wrappedPath = join(generatedRoot, `listening-room-record-${record.name}.wrapped.swf`);
  const renderedPath = join(generatedRoot, `listening-room-record-${record.name}.wrapped.png`);
  const promotedPath = join(promotedRoot, `listening-room-record-${record.name}.png`);
  execFileSync("swfextract", ["-i", String(record.spriteId), "-o", extractedPath, gramophonePath], { stdio: "pipe" });
  execFileSync(
    "swfcombine",
    ["--stack1", "-X", "180", "-Y", "180", "-x", "90", "-y", "90", "-o", wrappedPath, extractedPath],
    { stdio: "pipe" },
  );
  execFileSync("swfrender", ["-o", renderedPath, wrappedPath], { stdio: "pipe" });
  execFileSync("magick", [
    renderedPath,
    "-trim",
    "+repage",
    "-depth",
    "8",
    "-define",
    "png:color-type=6",
    "-define",
    "png:exclude-chunks=date,time",
    "-strip",
    promotedPath,
  ]);
  const promoted = readFileSync(promotedPath);
  assertEqual(sha256(promoted), record.sha256, `listening room ${record.name} sprite ${record.spriteId} SHA-256`);
  return { ...record, promoted };
});

const readerBooks = readerSources.map((reader) => {
  const source = readFileSync(reader.path);
  assertEqual(sha256(source), reader.sourceSha256, `${reader.name} reader SWF SHA-256`);
  const promotedPath = join(promotedRoot, `${reader.name}-reader-book.png`);
  const sourceLocator = `analysis/setup/app/activities/${reader.name}/${reader.name}.swf DEFINEBITSJPEG3 id 0005`;
  const promoted = extractJpeg3(source, 5, promotedPath, `${reader.name}-reader`, `Source: ${sourceLocator}`);
  assertEqual(sha256(promoted), reader.bookSha256, `${reader.name} reader book JPEG3 5 SHA-256`);
  return { ...reader, promoted };
});

const manifest = {
  source: "analysis/setup/app/Nutcracker2.exe",
  embeddedSwf: {
    signature: embedded.signature,
    offset: embedded.offset,
    version: embedded.version,
    declaredLength: embedded.declaredLength,
  },
  promoted: [
    {
      sourceLocator: `embedded main SWF DEFINEBITSJPEG id ${expected.playRoomJpegId}; root frame 2378 label playRoom`,
      path: "app/src/assets/source-scenes/main-playroom-background.jpg",
      sha256: sha256(playRoom),
    },
    {
      sourceLocator: "embedded main SWF root frame 1268 label choose; official Ruffle v0.5.0 source-runtime capture",
      path: "app/src/assets/source-scenes/projector-choose-source.png",
      sha256: sha256(projectorChooseCapture),
    },
    {
      sourceLocator: `embedded main SWF root frame 2378 label playRoom; official Ruffle v0.5.0 render of the extracted frame composited over DEFINEBITSJPEG id ${expected.playRoomJpegId}`,
      path: "app/src/assets/source-scenes/main-playroom-source-composite.png",
      sha256: sha256(playRoomComposite),
    },
    {
      sourceLocator: `flute_intro.swf DEFINEBITSJPEG id ${expected.introJpegId}`,
      path: "app/src/assets/source-scenes/flute-intro-garden.jpg",
      sha256: sha256(introStill),
    },
    {
      sourceLocator: `activities/originals/gramophone.swf DEFINEBITSJPEG3 id ${expected.gramophoneJpeg3Id}`,
      path: "app/src/assets/source-scenes/listening-room-gramophone.png",
      sha256: sha256(gramophoneArt),
    },
    {
      sourceLocator: `activities/originals/gramophone.swf lossless PNG id ${expected.listeningFramePngId}`,
      path: "app/src/assets/source-scenes/listening-room-frame.png",
      sha256: sha256(listeningFrame),
    },
    ...listeningRecords.map((record) => ({
      sourceLocator: `activities/originals/gramophone.swf record ${record.name} sprite id ${String(record.spriteId).padStart(4, "0")}`,
      path: `app/src/assets/source-scenes/listening-room-record-${record.name}.png`,
      sha256: sha256(record.promoted),
    })),
    ...readerBooks.map((reader) => ({
      sourceLocator: `activities/${reader.name}/${reader.name}.swf DEFINEBITSJPEG3 id 0005; root sprite id 0007 centered x 320.10 y 240.00`,
      path: `app/src/assets/source-scenes/${reader.name}-reader-book.png`,
      sha256: sha256(reader.promoted),
    })),
  ],
};
writeFileSync(join(generatedRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `Shell/reference extraction verified: projector byte ${embedded.offset}, source launcher, composed playRoom, intro JPEG ${expected.introJpegId}, gramophone JPEG3 ${expected.gramophoneJpeg3Id}, and ${readerBooks.length} reader books.`,
);
