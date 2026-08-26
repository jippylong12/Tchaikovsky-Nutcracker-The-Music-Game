import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import console from "node:console";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractEmbeddedSwf } from "./lib/flash-projector.mjs";
import { parseSwfDisplayList } from "./lib/swf-display-list.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDir, "..");
const projectRoot = path.resolve(appRoot, "..");
const outputRoot = path.join(appRoot, "generated/certificate-projectors");
const spriteOutputRoot = path.join(outputRoot, "sprites");
const promotedAssetRoot = path.join(appRoot, "src/assets/nutcracker-source");
const sourceFiles = [
  {
    sourceFile: path.join(projectRoot, "analysis/setup/app/fscommand/n_certificate.exe"),
    certificateSpriteId: 42,
    expectedProjectorSha256: "4baa04edc04ca14425175d9e2b506f2d00e000ebc24ac3e1fb3d393161ce3cf2",
    expectedSwfSha256: "1e3fa6c7d24d3ba45280ebc7296bf91143273ccefafba3721354cf3039816209",
    expectedDeclaredLength: 32089,
    expectedInstanceName: "n_certificate",
  },
  {
    sourceFile: path.join(projectRoot, "analysis/setup/app/fscommand/nc_certificate.exe"),
    certificateSpriteId: 18,
    expectedProjectorSha256: "f10a0f94815f532b0f4233299f9d2d41e6bef24fa5d1d6cc24e2d284f7c4460e",
    expectedSwfSha256: "68297484067856e6ad3b7f07a2b396e581927b528db8e763e87784e5c4201503",
    expectedDeclaredLength: 48991,
    expectedInstanceName: "nc_certificate",
    promotedFile: path.join(promotedAssetRoot, "nutcracker-club-certificate.png"),
    promotedCrop: "440x252+60+49",
  },
];

mkdirSync(outputRoot, { recursive: true });
mkdirSync(spriteOutputRoot, { recursive: true });
mkdirSync(promotedAssetRoot, { recursive: true });

const manifest = sourceFiles.map((source) => {
  const {
    sourceFile,
    certificateSpriteId,
    expectedProjectorSha256,
    expectedSwfSha256,
    expectedDeclaredLength,
    expectedInstanceName,
    promotedFile,
    promotedCrop,
  } = source;
  const sourceName = path.basename(sourceFile, path.extname(sourceFile));
  const projector = readFileSync(sourceFile);
  const extracted = extractEmbeddedSwf(projector, path.relative(projectRoot, sourceFile));
  assertEqual(`${sourceName} projector SHA-256`, sha256(projector), expectedProjectorSha256);
  assertEqual(`${sourceName} embedded signature`, extracted.signature, "CWS");
  assertEqual(`${sourceName} embedded offset`, extracted.offset, 860160);
  assertEqual(`${sourceName} declared length`, extracted.declaredLength, expectedDeclaredLength);
  assertEqual(`${sourceName} embedded SWF SHA-256`, sha256(extracted.swf), expectedSwfSha256);
  const swfFile = path.join(outputRoot, `${sourceName}.swf`);
  const placementFile = path.join(outputRoot, `${sourceName}.placements.txt`);
  const actionFile = path.join(outputRoot, `${sourceName}.actions.txt`);
  const textFile = path.join(outputRoot, `${sourceName}.text.txt`);
  const displayListFile = path.join(outputRoot, `${sourceName}.display-list.json`);
  const renderFile = path.join(outputRoot, `${sourceName}.png`);
  const certificateSwfFile = path.join(spriteOutputRoot, `${sourceName}-certificate.swf`);
  const certificateRenderFile = path.join(spriteOutputRoot, `${sourceName}-certificate.png`);

  writeFileSync(swfFile, extracted.swf);
  const placements = run("swfdump", ["-b", "-p", swfFile]);
  const actions = run("swfdump", ["-a", swfFile]);
  const text = run("swfdump", ["-t", swfFile]);
  assertIncludes(
    `${sourceName} certificate placement`,
    placements,
    `PLACEOBJECT2 places id ${String(certificateSpriteId).padStart(4, "0")} at depth 0001 name "${expectedInstanceName}"`,
  );
  assertIncludes(`${sourceName} print action`, actions, `String:"print:#bmax" String:"${expectedInstanceName}"`);
  assertIncludes(`${sourceName} quit action`, actions, 'GetUrl URL:"FSCommand:quit" Label:""');
  assertIncludes(`${sourceName} certificate heading`, text, "MEMBERSHIP AWARD CERTIFICATE");
  assertIncludes(`${sourceName} game title`, text, "THE NUTCRACKER MUSIC GAME");
  writeFileSync(placementFile, placements);
  writeFileSync(actionFile, actions);
  writeFileSync(textFile, text);
  writeFileSync(
    displayListFile,
    `${JSON.stringify(parseSwfDisplayList(placements, path.relative(projectRoot, swfFile)), null, 2)}\n`,
  );
  run("swfrender", ["-o", renderFile, swfFile]);
  run("swfextract", ["-i", String(certificateSpriteId), "-o", certificateSwfFile, swfFile]);
  run("swfrender", ["-o", certificateRenderFile, certificateSwfFile]);
  if (promotedFile && promotedCrop) {
    run("magick", [certificateRenderFile, "-crop", promotedCrop, "+repage", "-strip", promotedFile]);
  }

  return {
    sourceFile: path.relative(projectRoot, sourceFile),
    projectorSha256: sha256(projector),
    embeddedSignature: extracted.signature,
    embeddedOffset: extracted.offset,
    swfVersion: extracted.version,
    declaredLength: extracted.declaredLength,
    swfSha256: sha256(extracted.swf),
    swfFile: path.relative(appRoot, swfFile),
    placementFile: path.relative(appRoot, placementFile),
    actionFile: path.relative(appRoot, actionFile),
    textFile: path.relative(appRoot, textFile),
    displayListFile: path.relative(appRoot, displayListFile),
    renderFile: path.relative(appRoot, renderFile),
    certificateSpriteId,
    certificateSwfFile: path.relative(appRoot, certificateSwfFile),
    certificateRenderFile: path.relative(appRoot, certificateRenderFile),
    promotedFile: promotedFile ? path.relative(appRoot, promotedFile) : null,
    promotedCrop: promotedCrop ?? null,
  };
});

const manifestFile = path.join(outputRoot, "manifest.json");
writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Recovered ${manifest.length} embedded certificate SWFs`);
for (const item of manifest) {
  console.log(`${item.sourceFile}: ${item.embeddedSignature} at ${item.embeddedOffset}, ${item.declaredLength} bytes -> ${item.renderFile}`);
}
console.log(`Wrote ${path.relative(appRoot, manifestFile)}`);

function run(command, args) {
  return execFileSync(command, args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 20 });
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label} mismatch: expected ${expected}, received ${actual}`);
  }
}

function assertIncludes(label, content, expected) {
  if (!content.includes(expected)) {
    throw new Error(`${label} is missing required source evidence: ${expected}`);
  }
}
