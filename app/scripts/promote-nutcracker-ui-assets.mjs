import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import console from "node:console";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDir, "..");
const projectRoot = path.resolve(appRoot, "..");
const sourceRoot = path.join(appRoot, "generated/nutcracker-source-extract/full-swf-pass/direct-png");
const targetRoot = path.join(appRoot, "src/assets/nutcracker-source");
const helperRoot = path.join(appRoot, "generated/nutcracker-source-extract/nutchooser-helpframe");
const nutchooserSwf = path.join(projectRoot, "analysis/setup/app/games/nutcrackergame/nutchooser.swf");

function runTool(command, args) {
  const result = spawnSync(command, args, { cwd: projectRoot, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed\n${result.stdout}${result.stderr}`);
  }
}

const uiAssets = [
  {
    source: path.join(sourceRoot, "song1__song/lossless-39.png"),
    target: "song-curtain-scallop.png",
    sourceId: "song1/song.swf DEFINEBITSLOSSLESS2 id 0039, used by courtain base sprite id 0042",
  },
  {
    source: path.join(helperRoot, "helpframe-169-wrapped.png"),
    target: "chooser-helpframe-talker.png",
    sourceId: "nutchooser.swf nested talker sprite id 0169 rendered in translated wrapper, animated by helpframe sprite id 0170 and placed by root helpframe at depth 0001 x -0.90 y 39.65 ratio 22",
  },
];

await mkdir(targetRoot, { recursive: true });
await mkdir(helperRoot, { recursive: true });

for (const spriteId of ["169", "170"]) {
  const renderedPng = path.join(helperRoot, `helpframe-${spriteId}.png`);
  if (!existsSync(renderedPng)) {
    const extractedSwf = path.join(helperRoot, `helpframe-${spriteId}.swf`);
    runTool("swfextract", ["-i", spriteId, "-o", extractedSwf, nutchooserSwf]);
    runTool("swfrender", ["-o", renderedPng, extractedSwf]);
  }
}

const wrappedTalkerSwf = path.join(helperRoot, "helpframe-169-wrapped.swf");
const wrappedTalkerPng = path.join(helperRoot, "helpframe-169-wrapped.png");
if (!existsSync(wrappedTalkerPng)) {
  runTool("swfcombine", [
    "--stack1",
    "-X",
    "360",
    "-Y",
    "260",
    "-x",
    "150",
    "-y",
    "120",
    "-o",
    wrappedTalkerSwf,
    path.join(helperRoot, "helpframe-169.swf"),
  ]);
  runTool("swfrender", ["-o", wrappedTalkerPng, wrappedTalkerSwf]);
}

for (const asset of uiAssets) {
  if (!existsSync(asset.source)) {
    throw new Error(`Missing generated UI source asset: ${path.relative(appRoot, asset.source)}. Run npm run assets:nutcracker-swf first.`);
  }

  const targetFile = path.join(targetRoot, asset.target);
  await copyFile(asset.source, targetFile);
  console.log(`${path.relative(appRoot, asset.source)} -> ${path.relative(appRoot, targetFile)} (${asset.sourceId})`);
}
