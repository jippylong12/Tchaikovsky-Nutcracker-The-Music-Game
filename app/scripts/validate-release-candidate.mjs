import console from "node:console";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { validateSourceAtlas } from "./validate-source-atlas.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDir, "..");
const projectRoot = path.resolve(appRoot, "..");

const packageJson = readJson(path.join(appRoot, "package.json"));
const tauriConfig = readJson(path.join(appRoot, "src-tauri/tauri.conf.json"));
const routesSource = readText(path.join(appRoot, "src/routes.ts"));
const appSource = readText(path.join(appRoot, "src/app.ts"));
const readme = readText(path.join(appRoot, "README.md"));
const distributionConstraints = readText(path.join(projectRoot, "docs/distribution-constraints.md"));
const releaseNotes = readText(path.join(projectRoot, "docs/release-notes-0.1.0-rc1.md"));
const qaPack = readText(path.join(projectRoot, "docs/release-candidate-qa.md"));
const crossPlatform = readText(path.join(projectRoot, "docs/cross-platform-packaging.md"));
const atlas = validateSourceAtlas({ writeContactSheet: false });

assert(packageJson.version === tauriConfig.version, "package.json and Tauri versions must match");
assert(tauriConfig.productName === "Tchaikovsky Nutcracker Music Game", "unexpected final product name");
assert(tauriConfig.identifier === "com.jippylong12.nutcracker-music-game", "unexpected bundle identifier");
assert(tauriConfig.bundle?.category === "Game", "Tauri bundle category must be Game");
assert(
  ["app", "dmg"].every((target) => tauriConfig.bundle?.targets?.includes(target)),
  "macOS app and DMG bundle targets are required",
);
assert(tauriConfig.bundle?.macOS?.signingIdentity === "-", "macOS private package must use the ad-hoc signing identity");
assert(tauriConfig.bundle?.macOS?.hardenedRuntime === false, "macOS ad-hoc package must not claim hardened runtime");
assert(
  packageJson.scripts?.["package:mac"]?.includes("tauri build --bundles app,dmg")
    && !packageJson.scripts?.["package:mac"]?.includes("--no-sign"),
  "macOS package command must preserve the configured ad-hoc bundle signature",
);
assert(
  tauriConfig.bundle.icon.every((icon) => existsSync(path.join(appRoot, "src-tauri", icon))),
  "one or more configured app icons are missing",
);
assert(existsSync(path.join(appRoot, "src-tauri/app-icon.png")), "source-derived app icon master is missing");
assert(!/\bplaceholder\b/i.test(routesSource), "release route metadata still contains placeholder language");
assert(!/\b(?:planned|scaffold)\b/i.test(routesSource), "release route metadata still contains planned/scaffold language");
assert(
  appSource.includes("showDeveloperPanel ?? import.meta.env.DEV") && appSource.includes("showDeveloperPanel ?"),
  "production developer-panel gate is missing",
);
assert(atlas.routeCount === 28, `expected 28 release routes, found ${atlas.routeCount}`);
assert(atlas.defectCount === 0, `source atlas still contains ${atlas.defectCount} defect entries`);
assert(atlas.plannedCount === 0, `source atlas still contains ${atlas.plannedCount} planned entries`);
assert(/npm run package:mac/.test(readme), "README is missing the verified macOS package command");
assert(/private local preservation/i.test(distributionConstraints), "distribution rights caveat is missing");
assert(/not licensed for public redistribution/i.test(releaseNotes), "release notes are missing the rights caveat");
assert(/Marcus explicit approval/i.test(qaPack), "QA pack is missing the Marcus approval gate");
assert(/native Windows host/i.test(crossPlatform), "cross-platform notes are missing native-host requirements");

console.log(
  `Release candidate gate passed: ${atlas.routeCount} routes, ${atlas.entryCount} atlas entries, ` +
    `${atlas.defectCount} defects, ${atlas.plannedCount} planned entries, private macOS app+DMG metadata verified.`,
);

function readJson(file) {
  return JSON.parse(readText(file));
}

function readText(file) {
  assert(existsSync(file), `required release file is missing: ${path.relative(projectRoot, file)}`);
  return readFileSync(file, "utf8");
}

function assert(condition, message) {
  if (!condition) {
    console.error(`Release candidate validation failed: ${message}`);
    process.exit(1);
  }
}
