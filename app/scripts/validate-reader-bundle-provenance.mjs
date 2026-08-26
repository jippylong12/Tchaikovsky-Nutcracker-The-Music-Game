import { readFileSync, readdirSync } from "node:fs";
import console from "node:console";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const assetsRoot = resolve(currentDir, "../dist/assets");
const assetNames = readdirSync(assetsRoot);
const bundleText = assetNames
  .filter((assetName) => assetName.endsWith(".js"))
  .map((assetName) => readFileSync(join(assetsRoot, assetName), "utf8"))
  .join("\n");

const readers = ["story", "biography", "ballet"];
const emittedAssets = readers.map((reader) => {
  const matches = assetNames.filter(
    (assetName) => assetName.startsWith(`${reader}-reader-book-`) && assetName.endsWith(".png"),
  );
  if (matches.length !== 1) {
    throw new Error(`Expected one ${reader} reader book in the production bundle, found ${matches.length}`);
  }
  if (!bundleText.includes(matches[0])) {
    throw new Error(`Production JavaScript does not reference ${matches[0]}`);
  }
  return matches[0];
});

if (new Set(emittedAssets).size !== readers.length) {
  throw new Error("Reader book provenance collapsed to a shared production asset");
}

console.log(`Verified source-local reader bundle assets: ${emittedAssets.join(", ")}`);
