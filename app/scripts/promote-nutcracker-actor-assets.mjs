import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import console from "node:console";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDir, "..");
const sourceRoot = path.join(appRoot, "generated/nutcracker-source-extract/full-swf-pass/direct-png");
const targetRoot = path.join(appRoot, "src/assets/nutcracker-source");

const songIds = [1, 2, 3, 4, 5, 6, 7, 8];
const trackNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
const preferredAssetIds = {
  2: [14],
};

await mkdir(targetRoot, { recursive: true });

let promotedCount = 0;

for (const songId of songIds) {
  for (const trackNumber of trackNumbers) {
    const sourceDir = path.join(sourceRoot, `song${songId}__characters__anim${trackNumber}`);
    if (!existsSync(sourceDir)) {
      throw new Error(`Missing extracted actor directory: ${path.relative(appRoot, sourceDir)}`);
    }

    const sourceFile = await selectActorSourceFile(sourceDir, trackNumber);
    const targetFile = path.join(targetRoot, `song${songId}-track${trackNumber}-actor.png`);
    await copyFile(sourceFile, targetFile);
    promotedCount += 1;
    console.log(`${path.relative(appRoot, sourceFile)} -> ${path.relative(appRoot, targetFile)}`);
  }
}

console.log(`Promoted ${promotedCount} Nutcracker actor assets`);

async function selectActorSourceFile(sourceDir, trackNumber) {
  const fileNames = (await readdir(sourceDir)).filter((fileName) => fileName.endsWith(".png"));
  const preferredIds = preferredAssetIds[trackNumber] ?? [];

  for (const preferredId of preferredIds) {
    const preferredFile = path.join(sourceDir, `lossless-${preferredId}.png`);
    if (existsSync(preferredFile)) {
      return preferredFile;
    }
  }

  const candidates = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(sourceDir, fileName);
      const stats = await stat(filePath);
      return { filePath, size: stats.size };
    }),
  );

  candidates.sort((a, b) => b.size - a.size || a.filePath.localeCompare(b.filePath));
  const selected = candidates[0];
  if (!selected) {
    throw new Error(`No PNG actor assets found in ${sourceDir}`);
  }

  return selected.filePath;
}
