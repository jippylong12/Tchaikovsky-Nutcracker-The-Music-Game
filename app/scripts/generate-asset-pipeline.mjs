/* global console */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(appRoot, "..");
const sourceRoot = path.join(repoRoot, "analysis", "setup", "app");
const generatedDataRoot = path.join(appRoot, "src", "data", "generated");
const generatedRoot = path.join(appRoot, "generated");
const publicMediaRoot = path.join(appRoot, "public", "local-media");

const representativeSwfs = new Set([
  "flute_intro.swf",
  "activities/biography/biography.swf",
  "activities/ballet/ballet.swf",
  "activities/musictionary/musictionary.swf",
  "activities/originals/gramophone.swf",
  "activities/story/story.swf",
  "games/childrensalbum/childrensalbum.swf",
  "games/loopytunes/loopChooser.swf",
  "games/melody/melody.swf",
  "games/memorygame/memory.swf",
  "games/nutcrackergame/nutchooser.swf",
  "games/nuthouse/room11.swf",
  "games/tree/tree.swf",
  "games/trivia/trivia.swf",
]);

const visualSamples = [
  {
    id: "navigation-nutchooser-background",
    role: "navigation-screen",
    swfPath: "games/nutcrackergame/nutchooser.swf",
    kind: "png",
    assetId: 31,
  },
  {
    id: "game-tree-background",
    role: "game-screen",
    swfPath: "games/tree/tree.swf",
    kind: "png",
    assetId: 63,
  },
];

const embeddedAudioBundles = [
  {
    sourcePath: "activities/story/story.swf",
    sourceSha256: "e9445db9802becdd4ac04dfbd917ec1aec1c53432de23ba1d3fbde448c2a017f",
    outputPath: "activities/story",
    soundIds: [31],
    extractorFlag: "-s",
  },
  {
    sourcePath: "activities/biography/biography.swf",
    sourceSha256: "476e70ba2027bfd80524373c926821f2f430e468b45209e7e7a98e09294b6063",
    outputPath: "activities/biography",
    soundIds: [32],
    extractorFlag: "-s",
  },
  {
    sourcePath: "activities/ballet/ballet.swf",
    sourceSha256: "b0f95b56cbaebfb3a75ce295e413095a561dc16d36c44fd0d779f5fecbb6cf65",
    outputPath: "activities/ballet",
    soundIds: [33],
    extractorFlag: "-s",
  },
  {
    sourcePath: "activities/musictionary/musictionary.swf",
    sourceSha256: "c8ce65d2ee006afb6254e59e49b2867ad22cd4a5a6d5da004be53c28c632f7cd",
    outputPath: "activities/musictionary",
    soundIds: [149, 267, 305, 342, 390, 422, 454, 490, 527, 551, 601, 631, 677, 705, 741, 781, 813, 854],
    extractorFlag: "-M",
  },
];

const nutcrackerTrackStreamBundle = {
  expectedManifestSha256: "394f2c02bf6e59b1fe733b0f5183c245d5bb0fda0417a76038a9bae1ca65908c",
  sources: Array.from({ length: 8 }, (_song, songIndex) =>
    Array.from({ length: 8 }, (_track, trackIndex) => {
      const song = songIndex + 1;
      const track = trackIndex + 1;
      return {
        sourcePath: `games/nutcrackergame/song${song}/track${track}.swf`,
        outputPath: `games/nutcrackergame/song${song}/track${track}.mp3`,
      };
    }),
  ).flat(),
};

const extractableKinds = {
  Shapes: { kind: "shape", extension: "swf", folder: "shapes" },
  MovieClips: { kind: "movieClip", extension: "swf", folder: "movie-clips" },
  JPEG: { kind: "jpeg", extension: "jpg", folder: "jpeg" },
  JPEGs: { kind: "jpeg", extension: "jpg", folder: "jpeg" },
  PNG: { kind: "png", extension: "png", folder: "png" },
  PNGs: { kind: "png", extension: "png", folder: "png" },
  Sound: { kind: "sound", extension: "mp3", folder: "sounds" },
  Sounds: { kind: "sound", extension: "mp3", folder: "sounds" },
  Font: { kind: "font", extension: "swf", folder: "fonts" },
  Fonts: { kind: "font", extension: "swf", folder: "fonts" },
  "Embedded MP3": { kind: "embeddedMp3", extension: "mp3", folder: "embedded-mp3" },
  "Embedded MP3s": { kind: "embeddedMp3", extension: "mp3", folder: "embedded-mp3" },
  Frame: { kind: "frame", extension: "swf", folder: "frames" },
};

if (!existsSync(sourceRoot)) {
  throw new Error(`Missing recovered app source at ${sourceRoot}`);
}

mkdirSync(generatedDataRoot, { recursive: true });
mkdirSync(generatedRoot, { recursive: true });
mkdirSync(publicMediaRoot, { recursive: true });

const allFiles = listFiles(sourceRoot).sort(comparePath);
const swfFiles = allFiles.filter((file) => file.toLowerCase().endsWith(".swf"));
const audioFiles = allFiles.filter((file) => /\.(mp3|wav)$/i.test(file));
const textFiles = allFiles.filter((file) => file.toLowerCase().endsWith(".txt"));

const swfCatalog = swfFiles.map((relativePath) => inspectSwf(relativePath));
validateEmbeddedAudioSources();
const mediaCatalog = buildMediaCatalog(audioFiles, textFiles);
const sampleImports = extractVisualSamples(swfCatalog);

writeGeneratedModule("swfAssetCatalog.ts", "swfAssetCatalog", swfCatalog, "SwfCatalogEntry");
writeGeneratedModule("mediaManifest.ts", "mediaManifest", mediaCatalog, "MediaManifest");
writeGeneratedModule("visualImportSamples.ts", "visualImportSamples", sampleImports, "VisualImportSample");
writeJson(path.join(generatedRoot, "catalog", "swf-asset-catalog.json"), swfCatalog);
writeJson(path.join(generatedRoot, "catalog", "media-manifest.json"), mediaCatalog);
writeSummaryDoc(swfCatalog, mediaCatalog, sampleImports);

console.log(`Cataloged ${swfCatalog.length} SWFs, ${mediaCatalog.audio.length} audio files, and ${mediaCatalog.text.length} text files.`);
console.log(`Generated manifests in ${path.relative(repoRoot, generatedDataRoot)} and private outputs in ${path.relative(repoRoot, generatedRoot)}.`);

function inspectSwf(relativePath) {
  const absolutePath = path.join(sourceRoot, relativePath);
  const extractOutput = runTool("swfextract", [absolutePath]);
  const dumpOutput = runTool("swfdump", [absolutePath]);
  const counts = parseSwfExtractCounts(extractOutput);
  const header = parseSwfHeader(dumpOutput);
  const namedAssets = parseNamedAssets(dumpOutput);
  const actionScriptTagCount = countMatches(dumpOutput, /\bDOACTION\b|\bDOINITACTION\b|\bDEFINEBUTTON2\b/g);
  const extractableAssets = Object.entries(counts)
    .flatMap(([kind, ids]) =>
      ids.map((id) => ({
        id,
        kind,
        outputPath: toPosix(path.join("app", "generated", "private-assets", "swf", slugForPath(relativePath), outputFolder(kind), `${id}.${outputExtension(kind)}`)),
      })),
    )
    .sort((a, b) => a.kind.localeCompare(b.kind) || a.id - b.id);

  return {
    originalPath: relativePath,
    representative: representativeSwfs.has(relativePath),
    version: header.version,
    frameRate: header.frameRate,
    frameCount: header.frameCount,
    width: header.width,
    height: header.height,
    actionScriptTagCount,
    counts: countSummary(counts),
    namedAssets,
    extractableAssets,
    manualReconstruction: manualReconstructionFor(counts, header, actionScriptTagCount),
  };
}

function buildMediaCatalog(audioRelativePaths, textRelativePaths) {
  rmSync(path.join(publicMediaRoot, "audio"), { recursive: true, force: true });
  rmSync(path.join(publicMediaRoot, "text"), { recursive: true, force: true });

  const normalizedPaths = new Map();
  const audio = audioRelativePaths.map((relativePath) => {
    const absolutePath = path.join(sourceRoot, relativePath);
    const normalizedPath = uniqueNormalizedPath(relativePath, normalizedPaths);
    const publicPath = toPosix(path.join("/local-media/audio", normalizedPath));
    const outputPath = path.join(publicMediaRoot, "audio", normalizedPath);
    mkdirSync(path.dirname(outputPath), { recursive: true });
    copyFileSync(absolutePath, outputPath);
    const probe = probeAudio(absolutePath);

    return {
      originalPath: relativePath,
      normalizedPath,
      publicPath,
      extension: path.extname(relativePath).slice(1).toLowerCase(),
      sizeBytes: statSync(absolutePath).size,
      sha256: sha256(absolutePath),
      durationSeconds: probe.durationSeconds,
      codec: probe.codec,
      needsConversion: path.extname(relativePath).toLowerCase() === ".wav",
    };
  });

  const text = textRelativePaths.map((relativePath) => {
    const absolutePath = path.join(sourceRoot, relativePath);
    const normalizedPath = uniqueNormalizedPath(relativePath, normalizedPaths);
    const publicPath = toPosix(path.join("/local-media/text", normalizedPath));
    const outputPath = path.join(publicMediaRoot, "text", normalizedPath);
    mkdirSync(path.dirname(outputPath), { recursive: true });
    copyFileSync(absolutePath, outputPath);
    const content = readFileSync(absolutePath, "utf8");
    const variableNames = parseVariableNames(content);

    return {
      originalPath: relativePath,
      normalizedPath,
      publicPath,
      sizeBytes: statSync(absolutePath).size,
      sha256: sha256(absolutePath),
      variableCount: variableNames.length,
      variableNames,
      parser: parserForTextPath(relativePath),
    };
  });

  extractEmbeddedAudioBundles();

  return {
    sourceRoot: "analysis/setup/app",
    generatedPublicRoot: "app/public/local-media",
    audio: audio.sort((a, b) => comparePath(a.originalPath, b.originalPath)),
    text: text.sort((a, b) => comparePath(a.originalPath, b.originalPath)),
  };
}

function validateEmbeddedAudioSources() {
  for (const bundle of embeddedAudioBundles) {
    const sourcePath = path.join(sourceRoot, bundle.sourcePath);
    if (!existsSync(sourcePath)) throw new Error(`Missing embedded-audio source ${bundle.sourcePath}`);
    const actualSha256 = sha256(sourcePath);
    if (actualSha256 !== bundle.sourceSha256) {
      throw new Error(`Embedded-audio source drifted: ${bundle.sourcePath} expected ${bundle.sourceSha256}, received ${actualSha256}`);
    }
  }

  const nutcrackerManifest = nutcrackerTrackStreamBundle.sources
    .map(({ sourcePath }) => {
      const absolutePath = path.join(sourceRoot, sourcePath);
      if (!existsSync(absolutePath)) throw new Error(`Missing Nutcracker track-stream source ${sourcePath}`);
      return `${sourcePath}:${sha256(absolutePath)}`;
    })
    .join("\n");
  const actualManifestSha256 = sha256Text(nutcrackerManifest);
  if (actualManifestSha256 !== nutcrackerTrackStreamBundle.expectedManifestSha256) {
    throw new Error(
      `Nutcracker track-stream sources drifted: expected manifest ${nutcrackerTrackStreamBundle.expectedManifestSha256}, received ${actualManifestSha256}`,
    );
  }
}

function extractEmbeddedAudioBundles() {
  for (const bundle of embeddedAudioBundles) {
    const sourcePath = path.join(sourceRoot, bundle.sourcePath);
    const outputRoot = path.join(publicMediaRoot, "audio", bundle.outputPath);
    mkdirSync(outputRoot, { recursive: true });
    for (const soundId of bundle.soundIds) {
      const outputPath = path.join(outputRoot, `${soundId}.mp3`);
      execFileSync("swfextract", [bundle.extractorFlag, String(soundId), "-o", outputPath, sourcePath], { stdio: "pipe" });
      if (!existsSync(outputPath) || statSync(outputPath).size < 1000) {
        throw new Error(`Embedded audio ${bundle.sourcePath} sound ${soundId} was not extracted`);
      }
    }
  }

  for (const track of nutcrackerTrackStreamBundle.sources) {
    const sourcePath = path.join(sourceRoot, track.sourcePath);
    const outputPath = path.join(publicMediaRoot, "audio", track.outputPath);
    mkdirSync(path.dirname(outputPath), { recursive: true });
    execFileSync("swfextract", ["-m", "-o", outputPath, sourcePath], { stdio: "pipe" });
    if (!existsSync(outputPath) || statSync(outputPath).size < 1000) {
      throw new Error(`Nutcracker track stream ${track.sourcePath} was not extracted`);
    }
  }
}

function extractVisualSamples(catalog) {
  const sampleRoot = path.join(generatedRoot, "private-assets", "visual-samples");
  rmSync(sampleRoot, { recursive: true, force: true });
  mkdirSync(sampleRoot, { recursive: true });

  return visualSamples.map((sample) => {
    const swf = catalog.find((entry) => entry.originalPath === sample.swfPath);
    const asset = swf?.extractableAssets.find((item) => item.kind === sample.kind && item.id === sample.assetId);
    if (!asset) {
      throw new Error(`Missing sample asset ${sample.kind} ${sample.assetId} in ${sample.swfPath}`);
    }

    const extension = outputExtension(sample.kind);
    const outputPath = path.join(sampleRoot, sample.id, `${sample.assetId}.${extension}`);
    mkdirSync(path.dirname(outputPath), { recursive: true });
    const flag = sample.kind === "jpeg" ? "-j" : "-p";
    runTool("swfextract", [flag, String(sample.assetId), "-o", outputPath, path.join(sourceRoot, sample.swfPath)]);

    return {
      id: sample.id,
      role: sample.role,
      originalSwfPath: sample.swfPath,
      assetId: sample.assetId,
      kind: sample.kind,
      generatedPath: toPosix(path.relative(repoRoot, outputPath)),
      implementationUse: sample.role === "navigation-screen" ? "Proof fixture for chooser/menu still backgrounds." : "Proof fixture for in-game still/background imports.",
    };
  });
}

function parseSwfExtractCounts(output) {
  const counts = {};
  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.trim();
    const match = line.match(/^\[-[A-Za-z]\]\s+\d+\s+(.+?): ID\(s\)\s+(.+)$/);
    if (!match) {
      if (line.includes("MP3 Soundstream")) {
        counts.soundStream = [0];
      }
      continue;
    }
    const descriptor = match[1].trim();
    const definition = extractableKinds[descriptor];
    if (!definition) {
      continue;
    }
    counts[definition.kind] = expandIds(match[2]);
  }
  return counts;
}

function parseSwfHeader(output) {
  return {
    version: numberFrom(output.match(/File version:\s+(\d+)/)),
    frameRate: numberFrom(output.match(/Frame rate:\s+([0-9.]+)/)),
    frameCount: numberFrom(output.match(/Frame count:\s+(\d+)/)),
    width: numberFrom(output.match(/Movie width:\s+([0-9.]+)/)),
    height: numberFrom(output.match(/Movie height:\s+([0-9.]+)/)),
  };
}

function parseNamedAssets(output) {
  const names = new Map();
  for (const match of output.matchAll(/exports\s+(\d+)\s+as\s+"([^"]+)"/g)) {
    names.set(`${Number(match[1])}:export`, { id: Number(match[1]), name: match[2], source: "EXPORTASSETS" });
  }
  for (const match of output.matchAll(/places id\s+(\d+).*? name "([^"]+)"/g)) {
    names.set(`${Number(match[1])}:${match[2]}:place`, { id: Number(match[1]), name: match[2], source: "PLACEOBJECT2" });
  }
  return [...names.values()].sort((a, b) => a.id - b.id || a.name.localeCompare(b.name));
}

function manualReconstructionFor(counts, header, actionScriptTagCount) {
  const items = [];
  if ((counts.shape?.length ?? 0) > 0) {
    items.push("vector-shapes-need-dom-canvas-or-hand-authored-recreation");
  }
  if ((counts.movieClip?.length ?? 0) > 0 || (header.frameCount ?? 0) > 1) {
    items.push("timeline-animation-should-be-recreated-as-scene-state-or-css-canvas-animation");
  }
  if (actionScriptTagCount > 0) {
    items.push("actionscript-behavior-needs-modern-routing-state-or-game-logic");
  }
  if ((counts.font?.length ?? 0) > 0) {
    items.push("fonts-need-modern-font-substitution-or-private-font-review");
  }
  if ((counts.jpeg?.length ?? 0) + (counts.png?.length ?? 0) === 0 && (counts.shape?.length ?? 0) > 0) {
    items.push("no-bitmap-export-available-for-vector-only-art");
  }
  return items;
}

function countSummary(counts) {
  return {
    shapes: counts.shape?.length ?? 0,
    movieClips: counts.movieClip?.length ?? 0,
    jpeg: counts.jpeg?.length ?? 0,
    png: counts.png?.length ?? 0,
    sounds: counts.sound?.length ?? 0,
    embeddedMp3: counts.embeddedMp3?.length ?? 0,
    fonts: counts.font?.length ?? 0,
    frames: counts.frame?.length ?? 0,
    soundStreams: counts.soundStream?.length ?? 0,
  };
}

function parseVariableNames(content) {
  const names = new Set();
  for (const part of content.split("&")) {
    const [rawName] = part.split("=");
    const name = rawName.trim();
    if (name) {
      names.add(name);
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function parserForTextPath(relativePath) {
  if (relativePath.includes("trivia/questions/")) return "triviaQuestions";
  if (relativePath.endsWith("games/melody/snd/Melody.txt")) return "melodySequences";
  if (relativePath.endsWith("games/data/gamekeys.txt")) return "gameKeys";
  if (relativePath.endsWith("games/data/nutdoors.txt")) return "nutcrackerDoors";
  if (relativePath.endsWith("games/data/childrensdoors.txt")) return "childrensAlbumDoors";
  if (relativePath.endsWith("games/data/nuthouserooms.txt")) return "nutHouseRooms";
  if (relativePath.endsWith("games/data/childrensalbum.txt")) return "childrensAlbumPatterns";
  if (relativePath.endsWith("trackinfo.txt")) return "trackInfo";
  return "flashVariables";
}

function probeAudio(absolutePath) {
  try {
    const output = runTool("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_name", "-of", "json", absolutePath]);
    const json = JSON.parse(output);
    return {
      durationSeconds: json.format?.duration ? Number(Number(json.format.duration).toFixed(3)) : null,
      codec: json.streams?.[0]?.codec_name ?? null,
    };
  } catch {
    return { durationSeconds: null, codec: null };
  }
}

function uniqueNormalizedPath(relativePath, seen) {
  const extension = path.extname(relativePath).toLowerCase();
  const withoutExt = relativePath.slice(0, -path.extname(relativePath).length);
  let normalized = `${withoutExt
    .split(/[\\/]/)
    .map((part) =>
      part
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    )
    .filter(Boolean)
    .join("/")}${extension}`;
  const first = normalized;
  let index = 2;
  while (seen.has(normalized)) {
    normalized = `${first.slice(0, -extension.length)}-${index}${extension}`;
    index += 1;
  }
  seen.set(normalized, relativePath);
  return normalized;
}

function expandIds(raw) {
  return raw
    .split(",")
    .flatMap((piece) => {
      const trimmed = piece.trim();
      const range = trimmed.match(/^(\d+)-(\d+)$/);
      if (range) {
        const start = Number(range[1]);
        const end = Number(range[2]);
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
      }
      const value = Number(trimmed);
      return Number.isFinite(value) ? [value] : [];
    })
    .sort((a, b) => a - b);
}

function listFiles(root, current = "") {
  const absolute = path.join(root, current);
  return readdirSync(absolute).flatMap((entry) => {
    const relative = path.join(current, entry);
    const childAbsolute = path.join(root, relative);
    if (statSync(childAbsolute).isDirectory()) {
      return listFiles(root, relative);
    }
    return [toPosix(relative)];
  });
}

function writeGeneratedModule(filename, exportName, data, typeName) {
  const importPath = "../catalogTypes";
  const source = `import type { ${typeName} } from "${importPath}";\n\nexport const ${exportName} = ${JSON.stringify(data, null, 2)} as const satisfies ${typeForExport(typeName)};\n`;
  writeFileSync(path.join(generatedDataRoot, filename), source);
}

function typeForExport(typeName) {
  if (typeName === "MediaManifest") return typeName;
  return `readonly ${typeName}[]`;
}

function writeJson(filename, data) {
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(filename, `${JSON.stringify(data, null, 2)}\n`);
}

function writeSummaryDoc(catalog, media, samples) {
  const representative = catalog.filter((entry) => entry.representative);
  const total = catalog.reduce(
    (sum, entry) => ({
      swfs: sum.swfs + 1,
      bitmaps: sum.bitmaps + entry.counts.jpeg + entry.counts.png,
      sounds: sum.sounds + entry.counts.sounds + entry.counts.embeddedMp3 + entry.counts.soundStreams,
      shapes: sum.shapes + entry.counts.shapes,
      movieClips: sum.movieClips + entry.counts.movieClips,
      fonts: sum.fonts + entry.counts.fonts,
    }),
    { swfs: 0, bitmaps: 0, sounds: 0, shapes: 0, movieClips: 0, fonts: 0 },
  );
  const body = `# Generated Asset Catalog Summary\n\nLinear issues: JIP-325, JIP-326, JIP-327\n\nGenerated by \`npm run assets:pipeline\` from \`analysis/setup/app\`.\n\n## Outputs\n\n| Output | Role | Tracked? |\n| --- | --- | --- |\n| \`app/src/data/generated/swfAssetCatalog.ts\` | Safe SWF metadata and planned export paths | Yes |\n| \`app/src/data/generated/mediaManifest.ts\` | Safe audio/text metadata plus normalized bundle paths | Yes |\n| \`app/src/data/generated/visualImportSamples.ts\` | Proof fixture paths for representative imports | Yes |\n| \`app/generated/catalog/*.json\` | Machine-readable private/generated catalog mirrors | No, ignored |\n| \`app/generated/private-assets/visual-samples\` | Extracted sample bitmap fixtures | No, ignored |\n| \`app/public/local-media/audio\` and \`app/public/local-media/text\` | Private local bundle copy for Vite/Tauri loading | No, ignored |\n\n## Catalog Totals\n\n| Item | Count |\n| --- | ---: |\n| SWFs | ${total.swfs} |\n| External audio files | ${media.audio.length} |\n| Text data files | ${media.text.length} |\n| SWF bitmap exports | ${total.bitmaps} |\n| SWF sound exports/streams | ${total.sounds} |\n| SWF vector shapes | ${total.shapes} |\n| SWF movie clips | ${total.movieClips} |\n| SWF fonts | ${total.fonts} |\n\n## Representative SWFs\n\n${representative
    .map(
      (entry) =>
        `- \`${entry.originalPath}\`: ${entry.width}x${entry.height}, ${entry.frameCount} frames, ${entry.counts.jpeg + entry.counts.png} bitmap exports, ${entry.counts.shapes} vector shapes, ${entry.counts.movieClips} movie clips.`,
    )
    .join("\n")}\n\n## Visual Import Samples\n\n${samples.map((sample) => `- \`${sample.id}\`: ${sample.role}, ${sample.kind} asset ${sample.assetId} from \`${sample.originalSwfPath}\` -> \`${sample.generatedPath}\`.`).join("\n")}\n`;
  writeFileSync(path.join(repoRoot, "docs", "generated-asset-catalog-summary.md"), body);
}

function slugForPath(relativePath) {
  return relativePath
    .replace(/\.[^.]+$/, "")
    .split("/")
    .map((part) => part.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))
    .filter(Boolean)
    .join("__");
}

function outputFolder(kind) {
  return {
    embeddedMp3: "embedded-mp3",
    font: "fonts",
    frame: "frames",
    jpeg: "jpeg",
    movieClip: "movie-clips",
    png: "png",
    shape: "shapes",
    sound: "sounds",
    soundStream: "sound-stream",
  }[kind];
}

function outputExtension(kind) {
  return {
    embeddedMp3: "mp3",
    font: "swf",
    frame: "swf",
    jpeg: "jpg",
    movieClip: "swf",
    png: "png",
    shape: "swf",
    sound: "mp3",
    soundStream: "mp3",
  }[kind];
}

function sha256(absolutePath) {
  return createHash("sha256").update(readFileSync(absolutePath)).digest("hex");
}

function sha256Text(value) {
  return createHash("sha256").update(value).digest("hex");
}

function runTool(command, args) {
  return execFileSync(command, args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
}

function numberFrom(match) {
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function comparePath(a, b) {
  return a.localeCompare(b, undefined, { numeric: true });
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}
