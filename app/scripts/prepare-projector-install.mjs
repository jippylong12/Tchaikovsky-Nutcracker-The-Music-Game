// Mirrors the recovered CD's room games and activities from analysis/setup/app/ into
// public/projector-install/ so the live projector can load the original movies into _level1,
// the way Nutcracker2.exe did. Files are hard-linked when possible (no extra disk space) and
// copied otherwise. index.json maps each lowercased path to its real spelling, because the
// Windows CD was case-insensitive and the movies ask for "Games/Melody/Snd/Melody.txt" and
// "games/data/childrensDoors.txt".
//
// The recovered install is local-only (analysis/ is git-ignored). Without it this writes an empty
// index and the shell falls back to the hand-made routes.
import console from "node:console";
import { copyFileSync, existsSync, linkSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const installRoot = join(appRoot, "../analysis/setup/app");
const outputRoot = join(appRoot, "public/projector-install");

// Everything the room's loadGame hotspots, the Nutcracker chooser, and their own loads reach.
export const projectorInstallSources = [
  "games/childrensalbum",
  "games/flyinginstruments",
  "games/melody",
  "games/memorygame",
  "games/nutcrackergame",
  "games/nuthouse",
  "games/orchestragame",
  "games/tree",
  "games/trivia",
  "games/data/childrensalbum.txt",
  "activities/ballet",
  "activities/biography",
  "activities/musictionary",
  "activities/originals",
  "activities/story",
];

// Render captures made during analysis, and a stray duplicate folder left on the CD image.
const skipped = new Set(["recovered-renders", "Copy of song2", ".DS_Store"]);

function walk(path, files) {
  const stats = statSync(path);
  if (stats.isDirectory()) {
    for (const entry of readdirSync(path)) {
      if (!skipped.has(entry)) walk(join(path, entry), files);
    }
  } else if (stats.isFile()) {
    files.push(path);
  }
}

function mirror(source, target) {
  if (existsSync(target)) {
    const a = statSync(source);
    const b = statSync(target);
    if (a.ino === b.ino || (a.size === b.size && a.mtimeMs <= b.mtimeMs)) return false;
    rmSync(target);
  }
  mkdirSync(dirname(target), { recursive: true });
  try {
    linkSync(source, target);
  } catch {
    copyFileSync(source, target);
  }
  return true;
}

const index = {};
let changed = 0;
if (existsSync(installRoot)) {
  const files = [];
  for (const source of projectorInstallSources) {
    const path = join(installRoot, source);
    if (existsSync(path)) walk(path, files);
    else console.warn(`prepare-projector-install: ${source} is missing from the recovered install`);
  }
  for (const file of files) {
    const path = relative(installRoot, file).split(sep).join("/");
    index[path.toLowerCase()] = path;
    if (mirror(file, join(outputRoot, path))) changed += 1;
  }
} else {
  console.warn("prepare-projector-install: analysis/setup/app is not present; the room uses the hand-made routes");
}

mkdirSync(outputRoot, { recursive: true });
writeFileSync(join(outputRoot, "index.json"), `${JSON.stringify({ files: index }, null, 0)}\n`);
console.log(`prepare-projector-install: ${Object.keys(index).length} files indexed, ${changed} updated in ${outputRoot}`);
