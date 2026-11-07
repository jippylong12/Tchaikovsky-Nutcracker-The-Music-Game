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
const musictionaryPath = join(projectRoot, "analysis/setup/app/activities/musictionary/musictionary.swf");
const gramophonePath = join(projectRoot, "analysis/setup/app/activities/originals/gramophone.swf");
const projectorChooseCapturePath = join(
  appRoot,
  "source-evidence/shell/projector-choose-source.png",
);
const projectorPlayRoomLayerCapturePath = join(
  appRoot,
  "source-evidence/shell/projector-playroom-layer-source.png",
);
const readerCaptureRoot = join(appRoot, "source-evidence/readers");
const jip820CaptureRoot = join(appRoot, "source-evidence/jip-820");
const musictionaryCaptures = [
  ["01-flute", "47f1d197064c459e72016f9fed6c8a04bd2f3e5580c5c29c9753953e906f2ff0"],
  ["02-oboe", "9fc33fa64442e3eb25fe866c020ade20ae279abc665f3b72d7334fcad65b6422"],
  ["03-clarinet", "44d9bb06a5288d5ae275ff6d44928ef5c574712684101680db488dee13387c4c"],
  ["04-bassoon", "cfa9a58f3125bff4939f2e850fcdedbf5611f86955f0004efba23eea693f26fb"],
  ["05-saxophone", "bfd199a46082068b8e45a4abad00aaf93d66420b01913b5faa10dc9f6ff05bd3"],
  ["06-harp", "7f08972d9b7f0855987175e4565f93dcf9d4e30e468549a7403b5175cc339e79"],
  ["07-piano", "0263f10823fa7e235315f19ecaadfb9b6096ea5009258ac80fa58cd014528eec"],
  ["08-vibraphone", "d2c629aabd51fb5b0b12e61e9b76f0f058cbd86244c238b13a2de27b81ad05d2"],
  ["09-timpani", "1d78daf1ae5427d0348f4a46f7d887667679692586c9656e784a28cd86f32d1b"],
  ["10-cymbals", "ad4652e471981c2019a21c3c548ddfa76a8d1d988d7ec99131d4f29b802154dd"],
  ["11-double-bass", "55339c2bbeef520d4a311a530f30b327608e0cdd0b3c9b7396f95a0fed6f0f0b"],
  ["12-cello", "45eccd09c4d49d5580bcb9747daa20a858f78fc617890fc323d11da65246665d"],
  ["13-violin", "5ed5da8d9b1552d2d3f4c27efbf80099d9e2f70c25a5ba578242e5c18db16f4d"],
  ["14-viola", "d9b4d41589e0ea1f008072086fcab718b8cc69147160d0a343eb0929655c0728"],
  ["15-trumpet", "fa73b87ec2721b408fa9659aeb638e9a704a281168246c4b7c765e51962919aa"],
  ["16-trombone", "0d1620d7c9733497b7459f129d946f1ed43b79276755e5a7fef8502912ece3be"],
  ["17-french-horn", "9778cc746ee9ac5fbe7c1cba3203c9d5a0681759be21cfb1872b449773beb76c"],
  ["18-tuba", "e7f60ee58305d9a7f20e602dcd7f422b4003c838c866820c7017b2540f1fce43"],
];
const fullSceneCaptures = [
  {
    sourceName: "musictionary-help-source.png",
    promotedName: "musictionary-help.png",
    sha256: "ac1f9c5b66bdd5388d6329de35a4675b9b9cc5f597f5029aae72c27aa06ead1e",
    sourceLocator: "projector playRoom to activities/musictionary/musictionary.swf help state; official Ruffle v0.5.0 source-runtime capture",
  },
  {
    sourceName: "musictionary-help-fish-source.png",
    promotedName: "musictionary-help-fish.png",
    sha256: "c30d6f27c19d9efbac8df992450aaad6c0e01d1fb1e29565ff3b49867612596d",
    sourceLocator: "projector playRoom to activities/musictionary/musictionary.swf help mascot state; official Ruffle v0.5.0 source-runtime capture",
  },
  {
    sourceName: "gramophone-source.png",
    promotedName: "listening-room-source.png",
    sha256: "488d7a78e8c8545b83d8fddd630bfb419a5bdf72acbbb6cc79008ec111db3b47",
    sourceLocator: "activities/originals/gramophone.swf neutral root state; official Ruffle v0.5.0 source-runtime capture",
  },
];
const readerSources = [
  {
    name: "story",
    path: join(projectRoot, "analysis/setup/app/activities/story/story.swf"),
    sourceSha256: "e9445db9802becdd4ac04dfbd917ec1aec1c53432de23ba1d3fbde448c2a017f",
    bookSha256: "e6257fedfea3a714382c52f764f8022fbed5b2e47d1f2d6d5b3933b9ada650b2",
    pageCaptureSha256: [
      "1623d95eaca4f9e3e7c24307551ab6b2131df508980a008930e5b380c8ccf522",
      "2163977522b632bf9fd316473522ce8e2e2c41e622804c26b9ce8cda47053981",
      "7810646f95b9533a78937ab655fb01cbdd30ae554c4727d063cdc0cf945ce556",
      "94d91683b9a6a3687602c8c7d6e14b28ebda6387bed9454c6650cb06aaea582b",
    ],
  },
  {
    name: "biography",
    path: join(projectRoot, "analysis/setup/app/activities/biography/biography.swf"),
    sourceSha256: "476e70ba2027bfd80524373c926821f2f430e468b45209e7e7a98e09294b6063",
    bookSha256: "6397fe3b7b90768c0136c7c203234fe41d8eca6e2aff680c084071b6b623ff51",
    pageCaptureSha256: [
      "df68afdf045985836d24698e3ecce7456051e56497e23d1aaa6bb93296ee7117",
      "9e958422c003dcdc1b000db675d0a9699509a24e5b32ec6c7516d71a0c30fcd9",
      "3c4b8a03ba1fdf9cd399c81cfdf1cb23b46ae4e5b69404fa230e0f37e57be87c",
      "f07e7b241fee52d8a6fff7ec1311d2b8208bb931e3b20422b76cb8c99785904a",
    ],
  },
  {
    name: "ballet",
    path: join(projectRoot, "analysis/setup/app/activities/ballet/ballet.swf"),
    sourceSha256: "b0f95b56cbaebfb3a75ce295e413095a561dc16d36c44fd0d779f5fecbb6cf65",
    bookSha256: "4ad48b9beb2c2cb7b21070afe575df1f241b7ff89de126b6f4079bd8837044e8",
    pageCaptureSha256: [
      "a8e7d90de0a997b9f6bb9555cd7ec5db5838f7e28caf61fb7e166a46a5ea090e",
      "ba32e42102d3518e873d5e954ba3d509ebe6b5e01aab240d38d399b8685edbe1",
      "34a9902994a67157d77f73752b84da171a0261f49253d96166771b69517800e2",
      "a66723199734e366f716da74b81fe59faf2e98f811b58f29566eaeb885cdbdf8",
      "d42073b16c91252ebc8a69fc03681f9d69264112318e1dd9592416e558b0f228",
    ],
  },
];

const readerControlCaptures = [
  {
    name: "next-hover",
    sourcePath: join(readerCaptureRoot, "story-frame-2-next-hover-source.png"),
    sourceSha256: "25d4722b50d37490e9a1a16293635e98626b0e8c4056d61545f67297cad5a50a",
    crop: "65x34+415+399",
    promotedSha256: "0d4376708525b2b4842f29558357c0b064fec492a280e00e37a79d5680dc9ec8",
  },
  {
    name: "prev-hover",
    sourcePath: join(readerCaptureRoot, "story-frame-2-prev-hover-source.png"),
    sourceSha256: "ee0c14672f7939ce05715c2c49fe09ecfeb710452d343cd3be7881ae833c5d75",
    crop: "64x34+160+399",
    promotedSha256: "b47fb6f25a78c035be60fc5a03ed1b8176aaa670e9fce9f62df8c1d26104ddb9",
  },
  {
    name: "exit-hover",
    sourcePath: join(readerCaptureRoot, "story-frame-1-exit-hover-source.png"),
    sourceSha256: "1c82191cf3dd657a9d0ed1a4bbfcf1cfadbce9da371e9b3abc6bed8db4c9687f",
    crop: "47x34+578+31",
    promotedSha256: "f56879812e9423ca3ea4a587fb8983febd170793ca5aeafa3754664bdebb95d1",
  },
  {
    name: "exit-hover-ballet",
    sourcePath: join(readerCaptureRoot, "ballet-frame-1-exit-hover-source.png"),
    sourceSha256: "3f9372a9339fe7f55417183e03799f029a6859a1a0ac22e825bce129cb90a6c0",
    crop: "47x34+578+31",
    promotedSha256: "9001308bc99e2c32ee603835c5897d766d16a62a9cd98711740f3c48ed830e70",
  },
];

const expected = {
  projectorSha256: "79e464b0af7452697e0d63c71a6829848834f6fe3d7a311129c82e0b08935bab",
  projectorOffset: 864256,
  projectorDeclaredLength: 6085533,
  playRoomJpegId: 518,
  playRoomSha256: "c0b4eb8a1b3a1fbf196bbc05a301d2b615de69e119d15bd09e694b7de796eddc",
  projectorChooseCaptureSha256: "d0bf34493f250904056468eae4525f039da4e55797282ae2d97d7246c54ecaf0",
  projectorPlayRoomLayerCaptureSha256: "93a4f305c588c65665ec506545554f7c751740d18c1cd715743ea78a02412b0e",
  playRoomCompositeSha256: "f1f42c978c8735db266e6aa89bf67d34b2e4b84e7f9b43acfdc47a720b298f75",
  introSha256: "aa92b6b3022c3cf3030cecd7c06888aebd929a63bcc7b3ce18119f3f7476b782",
  alicePreviewSha256: "c4f8ff3cdb1585a4756107469c05673d803a109a4ed357205be8c8ae3d86a84e",
  introJpegId: 371,
  introStillSha256: "90185364eb26cb2b295084db962c23aeab64090d268ae09c89add44489d27e7d",
  musictionarySha256: "c8ce65d2ee006afb6254e59e49b2867ad22cd4a5a6d5da004be53c28c632f7cd",
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
requireFile(musictionaryPath);
requireFile(gramophonePath);
requireFile(projectorChooseCapturePath);
requireFile(projectorPlayRoomLayerCapturePath);
readerSources.forEach((reader) => requireFile(reader.path));
readerSources.forEach((reader) =>
  reader.pageCaptureSha256.forEach((_, index) =>
    requireFile(join(readerCaptureRoot, `${reader.name}-frame-${index + 1}-source.png`)),
  ),
);
readerControlCaptures.forEach((capture) => requireFile(capture.sourcePath));
musictionaryCaptures.forEach(([name]) => requireFile(join(jip820CaptureRoot, `musictionary-source-${name}.png`)));
fullSceneCaptures.forEach((capture) => requireFile(join(jip820CaptureRoot, capture.sourceName)));
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
// The launcher's Alice preview (aliceBTN -> _root.gotoAndPlay("aliceIntro")) is a trailer inside the
// projector's own root timeline, frames 1535-2141. Ruffle cannot start a movie at a label, so the
// runtime plays a copy of the projector whose root frame-1 action (DOACTION at byte 79408:
// _quality MEDIUM, fscommands, GotoFrame 1267 = label choose, Play) jumps to frame 1535 instead.
// That is the only change: the 2-byte ActionGotoFrame operand 1267 becomes 1534 (zero-based).
const aliceFrameOneAction = 79408;
const gotoChooseBytes = Buffer.from([0x81, 0x02, 0x00, 0xf3, 0x04]);
const frameOneBody = embedded.swf.subarray(aliceFrameOneAction + 6, aliceFrameOneAction + 6 + 113);
assertEqual(embedded.swf.readUInt16LE(aliceFrameOneAction) >> 6, 12, "projector root frame-1 DOACTION tag code");
const gotoChooseAt = frameOneBody.indexOf(gotoChooseBytes);
assertEqual(gotoChooseAt >= 0 && frameOneBody.indexOf(gotoChooseBytes, gotoChooseAt + 1) < 0, true, "single GotoFrame 1267 in frame-1 action");
const alicePreview = Buffer.from(embedded.swf);
alicePreview.writeUInt16LE(1534, aliceFrameOneAction + 6 + gotoChooseAt + 3);
const alicePreviewPath = join(promotedRoot, "projector-alice-preview.swf");
writeFileSync(alicePreviewPath, alicePreview);
assertEqual(sha256(readFileSync(alicePreviewPath)), expected.alicePreviewSha256, "projector-alice-preview.swf SHA-256");

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
// The whole source intro movie is promoted byte-for-byte so the runtime can play it through Ruffle.
const introMoviePath = join(promotedRoot, "flute-intro.swf");
writeFileSync(introMoviePath, intro);
assertEqual(sha256(readFileSync(introMoviePath)), expected.introSha256, "promoted flute-intro.swf SHA-256");
const introStillPath = join(promotedRoot, "flute-intro-garden.jpg");
const introStill = extractJpeg(introPath, expected.introJpegId, introStillPath);
assertEqual(sha256(introStill), expected.introStillSha256, "flute intro JPEG 371 SHA-256");

const musictionary = readFileSync(musictionaryPath);
assertEqual(sha256(musictionary), expected.musictionarySha256, "musictionary.swf SHA-256");
for (const [suffix, flag] of [["actions", "-a"], ["placements", "-p"], ["text", "-t"]]) {
  writeFileSync(
    join(generatedRoot, `musictionary.${suffix}.txt`),
    execFileSync("swfdump", [flag, musictionaryPath], { maxBuffer: 64 * 1024 * 1024 }),
  );
}

const musictionaryScenes = musictionaryCaptures.map(([name, expectedSha256], index) => {
  const sourcePath = join(jip820CaptureRoot, `musictionary-source-${name}.png`);
  const sourceCapture = readFileSync(sourcePath);
  assertEqual(sha256(sourceCapture), expectedSha256, `Musictionary frame ${index + 1} source capture SHA-256`);
  const promotedPath = join(promotedRoot, `musictionary-frame-${index + 1}.png`);
  writeFileSync(promotedPath, sourceCapture);
  return { frame: index + 1, sourceCapture };
});

const promotedFullScenes = fullSceneCaptures.map((capture) => {
  const sourcePath = join(jip820CaptureRoot, capture.sourceName);
  const sourceCapture = readFileSync(sourcePath);
  assertEqual(sha256(sourceCapture), capture.sha256, `${capture.sourceName} SHA-256`);
  writeFileSync(join(promotedRoot, capture.promotedName), sourceCapture);
  return { ...capture, sourceCapture };
});

const gramophone = readFileSync(gramophonePath);
assertEqual(sha256(gramophone), expected.gramophoneSha256, "gramophone.swf SHA-256");
for (const [suffix, flag] of [["actions", "-a"], ["placements", "-p"], ["text", "-t"]]) {
  writeFileSync(
    join(generatedRoot, `gramophone.${suffix}.txt`),
    execFileSync("swfdump", [flag, gramophonePath], { maxBuffer: 64 * 1024 * 1024 }),
  );
}
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

const readerScenes = readerSources.flatMap((reader) =>
  reader.pageCaptureSha256.map((expectedSha256, index) => {
    const frame = index + 1;
    const sourcePath = join(readerCaptureRoot, `${reader.name}-frame-${frame}-source.png`);
    const sourceCapture = readFileSync(sourcePath);
    assertEqual(sha256(sourceCapture), expectedSha256, `${reader.name} reader frame ${frame} Ruffle capture SHA-256`);
    const promotedPath = join(promotedRoot, `${reader.name}-reader-frame-${frame}.png`);
    writeFileSync(promotedPath, sourceCapture);
    return { name: reader.name, frame, promoted: sourceCapture };
  }),
);

const readerControls = readerControlCaptures.map((capture) => {
  const sourceCapture = readFileSync(capture.sourcePath);
  assertEqual(sha256(sourceCapture), capture.sourceSha256, `reader ${capture.name} source capture SHA-256`);
  const promotedPath = join(promotedRoot, `reader-control-${capture.name}.png`);
  execFileSync("magick", [
    capture.sourcePath,
    "-crop",
    capture.crop,
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
  assertEqual(sha256(promoted), capture.promotedSha256, `reader ${capture.name} promoted crop SHA-256`);
  return { ...capture, promoted };
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
      sourceLocator: "embedded main SWF with root frame-1 ActionGotoFrame 1267 (choose) retargeted to 1534 (aliceIntro); trailer frames 1535-2141 played through bundled Ruffle v0.5.0",
      path: "app/src/assets/source-scenes/projector-alice-preview.swf",
      sha256: expected.alicePreviewSha256,
    },
    {
      sourceLocator: "analysis/setup/app/flute_intro.swf complete 800 x 600, 15 fps, 1277-frame movie played through bundled Ruffle v0.5.0",
      path: "app/src/assets/source-scenes/flute-intro.swf",
      sha256: expected.introSha256,
    },
    {
      sourceLocator: `flute_intro.swf DEFINEBITSJPEG id ${expected.introJpegId}`,
      path: "app/src/assets/source-scenes/flute-intro-garden.jpg",
      sha256: sha256(introStill),
    },
    ...musictionaryScenes.map((scene) => ({
      sourceLocator: `activities/musictionary/musictionary.swf root instrument ${scene.frame}; official Ruffle v0.5.0 stable fact-state source-runtime capture`,
      path: `app/src/assets/source-scenes/musictionary-frame-${scene.frame}.png`,
      sha256: sha256(scene.sourceCapture),
    })),
    ...promotedFullScenes.map((scene) => ({
      sourceLocator: scene.sourceLocator,
      path: `app/src/assets/source-scenes/${scene.promotedName}`,
      sha256: sha256(scene.sourceCapture),
    })),
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
    ...readerScenes.map((scene) => ({
      sourceLocator: `activities/${scene.name}/${scene.name}.swf root frame label ${scene.frame}; official Ruffle v0.5.0 neutral source-runtime capture`,
      path: `app/src/assets/source-scenes/${scene.name}-reader-frame-${scene.frame}.png`,
      sha256: sha256(scene.promoted),
    })),
    ...readerControls.map((control) => ({
      sourceLocator: `activities/story/story.swf and activities/ballet/ballet.swf source button hover state crop ${control.crop}`,
      path: `app/src/assets/source-scenes/reader-control-${control.name}.png`,
      sha256: sha256(control.promoted),
    })),
  ],
};
writeFileSync(join(generatedRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `Shell/reference extraction verified: projector byte ${embedded.offset}, source launcher, composed playRoom, intro JPEG ${expected.introJpegId}, ${musictionaryScenes.length} Musictionary frames, ${promotedFullScenes.length} full reference captures, gramophone JPEG3 ${expected.gramophoneJpeg3Id}, ${readerBooks.length} reader books, ${readerScenes.length} complete reader frames, and ${readerControls.length} source control states.`,
);
