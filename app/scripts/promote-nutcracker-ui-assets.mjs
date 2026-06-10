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
const chooserRoot = path.join(appRoot, "generated/nutcracker-source-extract/nutchooser");
const helperRoot = path.join(appRoot, "generated/nutcracker-source-extract/nutchooser-helpframe");
const warningRoot = path.join(appRoot, "generated/nutcracker-source-extract/nutchooser-warningframe");
const songHelpRoot = path.join(appRoot, "generated/nutcracker-source-extract/song-helpframe");
const songWarningRoot = path.join(appRoot, "generated/nutcracker-source-extract/song-warningframe");
const nutchooserSwf = path.join(projectRoot, "analysis/setup/app/games/nutcrackergame/nutchooser.swf");
const song1Swf = path.join(projectRoot, "analysis/setup/app/games/nutcrackergame/song1/song.swf");

function runTool(command, args) {
  const result = spawnSync(command, args, { cwd: projectRoot, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed\n${result.stdout}${result.stderr}`);
  }
}

function imagesArePixelEquivalent(source, target) {
  if (!existsSync(target)) {
    return false;
  }

  const result = spawnSync("magick", ["compare", "-metric", "AE", source, target, "null:"], {
    cwd: projectRoot,
    encoding: "utf8",
  });
  return result.status === 0;
}

const uiAssets = [
  {
    source: path.join(sourceRoot, "song1__song/lossless-39.png"),
    target: "song-curtain-scallop.png",
    sourceId: "song1/song.swf DEFINEBITSLOSSLESS2 id 0039, used by courtain base sprite id 0042",
  },
  {
    source: path.join(chooserRoot, "help-exit-sprite-68-cxform.png"),
    target: "chooser-instruments-cxform.png",
    sourceId: "nutchooser.swf sprite id 0068 rendered, trimmed, then root placement depth 0069 CXForm add -209 -153 134 -223 applied",
  },
  {
    source: path.join(helperRoot, "helpframe-169-wrapped.png"),
    target: "chooser-helpframe-talker.png",
    sourceId: "nutchooser.swf nested talker sprite id 0169 rendered in translated wrapper, animated by helpframe sprite id 0170 and placed by root helpframe at depth 0001 x -0.90 y 39.65 ratio 22",
  },
  {
    source: path.join(warningRoot, "warningframe-177-wrapped.png"),
    target: "chooser-warningframe-talker.png",
    sourceId: "nutchooser.swf warningFrame sprite id 0177 rendered in translated wrapper, placed by root warningFrame at depth 0001 x -10.05 y 18.50 ratio 24",
  },
  {
    source: path.join(warningRoot, "warning-yes-text-180-trim.png"),
    target: "chooser-warning-yes-label.png",
    sourceId: "nutchooser.swf warningFrame YES text id 0180, button id 0183, root placement x -58.15 y -76.55 ratio 24",
  },
  {
    source: path.join(warningRoot, "warning-no-text-185-trim.png"),
    target: "chooser-warning-no-label.png",
    sourceId: "nutchooser.swf warningFrame NO text id 0185, button id 0188, root placement x 35.30 y -76.55 ratio 24",
  },
  {
    source: path.join(songHelpRoot, "helpframe-333-wrapped.png"),
    target: "song-helpframe-talker.png",
    sourceId: "song1/song.swf helpframe sprite id 0333 rendered in translated wrapper, placed by root helpframe at depth 0001 x -5.00 y 74.95 ratio 27",
  },
  {
    source: path.join(songWarningRoot, "song-warningframe-340-wrapped.png"),
    target: "song-warningframe-talker.png",
    sourceId: "song1/song.swf warningFrame sprite id 0340 rendered in translated wrapper, placed by root warningFrame at depth 0001 x -15.45 y 52.40 ratio 29",
  },
  {
    source: path.join(songWarningRoot, "song-warning-yes-text-345-trim.png"),
    target: "song-warning-yes-label.png",
    sourceId: "song1/song.swf warningFrame YES text id 0345, button id 0346, root placement x -66.15 y -43.55 ratio 29",
  },
  {
    source: path.join(songWarningRoot, "song-warning-no-text-350-trim.png"),
    target: "song-warning-no-label.png",
    sourceId: "song1/song.swf warningFrame NO text id 0350, button id 0351, root placement x 27.30 y -43.55 ratio 29",
  },
];

await mkdir(targetRoot, { recursive: true });
await mkdir(chooserRoot, { recursive: true });
await mkdir(helperRoot, { recursive: true });
await mkdir(warningRoot, { recursive: true });
await mkdir(songHelpRoot, { recursive: true });
await mkdir(songWarningRoot, { recursive: true });

const chooserInstrumentSwf = path.join(chooserRoot, "help-exit-sprite-68.swf");
const chooserInstrumentPng = path.join(chooserRoot, "help-exit-sprite-68.png");
const chooserInstrumentTrimmedPng = path.join(chooserRoot, "help-exit-sprite-68-trim.png");
const chooserInstrumentCxformPng = path.join(chooserRoot, "help-exit-sprite-68-cxform.png");
if (!existsSync(chooserInstrumentSwf)) {
  runTool("swfextract", ["-i", "68", "-o", chooserInstrumentSwf, nutchooserSwf]);
}
if (!existsSync(chooserInstrumentPng)) {
  runTool("swfrender", ["-o", chooserInstrumentPng, chooserInstrumentSwf]);
}
if (!existsSync(chooserInstrumentTrimmedPng)) {
  runTool("magick", [chooserInstrumentPng, "-trim", "+repage", chooserInstrumentTrimmedPng]);
}
runTool("magick", [
  chooserInstrumentTrimmedPng,
  "-channel",
  "R",
  "-evaluate",
  "subtract",
  "81.9608%",
  "+channel",
  "-channel",
  "G",
  "-evaluate",
  "subtract",
  "60%",
  "+channel",
  "-channel",
  "B",
  "-evaluate",
  "add",
  "52.549%",
  "+channel",
  "-channel",
  "A",
  "-evaluate",
  "subtract",
  "87.451%",
  "+channel",
  chooserInstrumentCxformPng,
]);

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

const warningSpriteSwf = path.join(warningRoot, "warningframe-177.swf");
if (!existsSync(warningSpriteSwf)) {
  runTool("swfextract", ["-i", "177", "-o", warningSpriteSwf, nutchooserSwf]);
}

const wrappedWarningSwf = path.join(warningRoot, "warningframe-177-wrapped.swf");
const wrappedWarningPng = path.join(warningRoot, "warningframe-177-wrapped.png");
if (!existsSync(wrappedWarningPng)) {
  runTool("swfcombine", [
    "--stack1",
    "-X",
    "360",
    "-Y",
    "220",
    "-x",
    "130",
    "-y",
    "90",
    "-o",
    wrappedWarningSwf,
    warningSpriteSwf,
  ]);
  runTool("swfrender", ["-o", wrappedWarningPng, wrappedWarningSwf]);
}

const warningLabels = [
  { id: "180", source: "warning-yes-text-180.swf", rendered: "warning-yes-text-180.png", trimmed: "warning-yes-text-180-trim.png" },
  { id: "185", source: "warning-no-text-185.swf", rendered: "warning-no-text-185.png", trimmed: "warning-no-text-185-trim.png" },
];

for (const label of warningLabels) {
  const labelSwf = path.join(warningRoot, label.source);
  const labelPng = path.join(warningRoot, label.rendered);
  const labelTrimmedPng = path.join(warningRoot, label.trimmed);
  if (!existsSync(labelSwf)) {
    runTool("swfextract", ["-i", label.id, "-o", labelSwf, nutchooserSwf]);
  }
  if (!existsSync(labelPng)) {
    runTool("swfrender", ["-o", labelPng, labelSwf]);
  }
  if (!existsSync(labelTrimmedPng)) {
    runTool("magick", [labelPng, "-trim", "+repage", labelTrimmedPng]);
  }
}

const songHelpSpriteSwf = path.join(songHelpRoot, "helpframe-333.swf");
if (!existsSync(songHelpSpriteSwf)) {
  runTool("swfextract", ["-i", "333", "-o", songHelpSpriteSwf, song1Swf]);
}

const wrappedSongHelpSwf = path.join(songHelpRoot, "helpframe-333-wrapped.swf");
const wrappedSongHelpPng = path.join(songHelpRoot, "helpframe-333-wrapped.png");
if (!existsSync(wrappedSongHelpPng)) {
  runTool("swfcombine", [
    "--stack1",
    "-X",
    "360",
    "-Y",
    "240",
    "-x",
    "140",
    "-y",
    "60",
    "-o",
    wrappedSongHelpSwf,
    songHelpSpriteSwf,
  ]);
  runTool("swfrender", ["-o", wrappedSongHelpPng, wrappedSongHelpSwf]);
}

const songWarningSpriteSwf = path.join(songWarningRoot, "song-warningframe-340.swf");
if (!existsSync(songWarningSpriteSwf)) {
  runTool("swfextract", ["-i", "340", "-o", songWarningSpriteSwf, song1Swf]);
}

const wrappedSongWarningSwf = path.join(songWarningRoot, "song-warningframe-340-wrapped.swf");
const wrappedSongWarningPng = path.join(songWarningRoot, "song-warningframe-340-wrapped.png");
if (!existsSync(wrappedSongWarningPng)) {
  runTool("swfcombine", [
    "--stack1",
    "-X",
    "360",
    "-Y",
    "240",
    "-x",
    "140",
    "-y",
    "80",
    "-o",
    wrappedSongWarningSwf,
    songWarningSpriteSwf,
  ]);
  runTool("swfrender", ["-o", wrappedSongWarningPng, wrappedSongWarningSwf]);
}

const songWarningLabels = [
  { id: "345", source: "song-warning-yes-text-345.swf", rendered: "song-warning-yes-text-345.png", trimmed: "song-warning-yes-text-345-trim.png" },
  { id: "350", source: "song-warning-no-text-350.swf", rendered: "song-warning-no-text-350.png", trimmed: "song-warning-no-text-350-trim.png" },
];

for (const label of songWarningLabels) {
  const labelSwf = path.join(songWarningRoot, label.source);
  const labelPng = path.join(songWarningRoot, label.rendered);
  const labelTrimmedPng = path.join(songWarningRoot, label.trimmed);
  if (!existsSync(labelSwf)) {
    runTool("swfextract", ["-i", label.id, "-o", labelSwf, song1Swf]);
  }
  if (!existsSync(labelPng)) {
    runTool("swfrender", ["-o", labelPng, labelSwf]);
  }
  if (!existsSync(labelTrimmedPng)) {
    runTool("magick", [labelPng, "-trim", "+repage", labelTrimmedPng]);
  }
}

for (const asset of uiAssets) {
  if (!existsSync(asset.source)) {
    throw new Error(`Missing generated UI source asset: ${path.relative(appRoot, asset.source)}. Run npm run assets:nutcracker-swf first.`);
  }

  const targetFile = path.join(targetRoot, asset.target);
  if (imagesArePixelEquivalent(asset.source, targetFile)) {
    console.log(`${path.relative(appRoot, targetFile)} unchanged (${asset.sourceId})`);
    continue;
  }

  await copyFile(asset.source, targetFile);
  console.log(`${path.relative(appRoot, asset.source)} -> ${path.relative(appRoot, targetFile)} (${asset.sourceId})`);
}
