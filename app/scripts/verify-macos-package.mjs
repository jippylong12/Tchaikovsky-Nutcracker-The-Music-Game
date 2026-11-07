import console from "node:console";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDir, "..");
const tauriRoot = path.join(appRoot, "src-tauri");
const config = JSON.parse(readFileSync(path.join(tauriRoot, "tauri.conf.json"), "utf8"));
const bundleRoot = path.join(tauriRoot, "target/release/bundle");
const appBundle = path.join(bundleRoot, "macos", `${config.productName}.app`);
const dmgDirectory = path.join(bundleRoot, "dmg");
const dmgPrefix = `${config.productName}_${config.version}_`;

assert(process.platform === "darwin", "macOS package verification must run on macOS");
assert(existsSync(appBundle), `app bundle is missing: ${appBundle}`);
assert(existsSync(dmgDirectory), `DMG directory is missing: ${dmgDirectory}`);

const dmgCandidates = readdirSync(dmgDirectory)
  .filter((name) => name.startsWith(dmgPrefix) && name.endsWith(".dmg"))
  .map((name) => path.join(dmgDirectory, name));
assert(dmgCandidates.length === 1, `expected one current DMG, found ${dmgCandidates.length}`);
const dmg = dmgCandidates[0];

const plistPath = path.join(appBundle, "Contents/Info.plist");
const plist = JSON.parse(run("plutil", ["-convert", "json", "-o", "-", plistPath]).stdout);
assert(plist.CFBundleDisplayName === config.productName, "app display name does not match Tauri metadata");
assert(plist.CFBundleIdentifier === config.identifier, "app bundle identifier does not match Tauri metadata");
assert(plist.CFBundleShortVersionString === config.version, "app version does not match Tauri metadata");

const executable = path.join(appBundle, "Contents/MacOS", plist.CFBundleExecutable);
assert(existsSync(executable), "packaged executable is missing");
const fileOutput = run("file", [executable]).stdout;
assert(fileOutput.includes("Mach-O 64-bit executable"), "packaged executable is not a 64-bit Mach-O");
assert(fileOutput.includes(process.arch === "arm64" ? "arm64" : "x86_64"), "packaged executable architecture is wrong");

const codeSign = run("codesign", ["-dv", "--verbose=4", appBundle], { allowNonZero: true });
const signatureOutput = `${codeSign.stdout}\n${codeSign.stderr}`;
assert(signatureOutput.includes("Signature=adhoc"), "private package should have only an ad-hoc signature");
assert(signatureOutput.includes("TeamIdentifier=not set"), "private package unexpectedly has a signing team");
run("codesign", ["--verify", "--deep", "--strict", "--verbose=2", appBundle]);
run("hdiutil", ["verify", dmg]);

const mountPoint = mkdtempSync(path.join(tmpdir(), "nutcracker-dmg-"));
const builtAppSha256 = hashPath(appBundle);
let mounted = false;
try {
  run("hdiutil", ["attach", dmg, "-readonly", "-nobrowse", "-mountpoint", mountPoint]);
  mounted = true;
  const mountedApp = path.join(mountPoint, `${config.productName}.app`);
  assert(existsSync(mountedApp), "mounted DMG does not contain the expected app bundle");
  const mountedPlist = JSON.parse(
    run("plutil", ["-convert", "json", "-o", "-", path.join(mountedApp, "Contents/Info.plist")]).stdout,
  );
  assert(mountedPlist.CFBundleIdentifier === config.identifier, "mounted DMG app has the wrong identifier");
  assert(mountedPlist.CFBundleDisplayName === config.productName, "mounted DMG app has the wrong display name");
  assert(mountedPlist.CFBundleShortVersionString === config.version, "mounted DMG app has the wrong version");
  assert(hashPath(mountedApp) === builtAppSha256, "mounted DMG app does not match the freshly built app bundle");
  run("codesign", ["--verify", "--deep", "--strict", "--verbose=2", mountedApp]);
} finally {
  if (mounted) run("hdiutil", ["detach", mountPoint]);
  rmSync(mountPoint, { recursive: true, force: true });
}

const distFiles = walk(path.join(appRoot, "dist"));
const audioFiles = distFiles.filter((file) => /\.(?:mp3|wav)$/i.test(file));
const imageFiles = distFiles.filter((file) => /\.(?:jpe?g|png)$/i.test(file));
// The room games play from the original CD files mirrored into projector-install/ (369 files on 2026-11-06).
const originalGameFiles = distFiles.filter((file) => file.split(path.sep).join("/").includes("/dist/projector-install/"));
assert(originalGameFiles.length >= 300, `production frontend contains only ${originalGameFiles.length} original CD game files`);
assert(audioFiles.length >= 400, `production frontend contains only ${audioFiles.length} audio files`);
assert(imageFiles.length >= 75, `production frontend contains only ${imageFiles.length} image files`);
assert(statSync(dmg).size > 1024 * 1024, "DMG is unexpectedly small");

const manifest = {
  productName: config.productName,
  version: config.version,
  identifier: config.identifier,
  architecture: process.arch,
  signature: "ad-hoc, not notarized",
  app: describeArtifact(appBundle),
  dmg: describeArtifact(dmg),
  frontend: { files: distFiles.length, audioFiles: audioFiles.length, imageFiles: imageFiles.length },
};
const manifestPath = path.join(bundleRoot, "release-candidate-manifest.json");
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ ...manifest, manifestPath }, null, 2));

function describeArtifact(file) {
  return {
    path: file,
    bytes: directorySize(file),
    sha256: hashPath(file),
  };
}

function hashPath(file) {
  const hash = createHash("sha256");
  const files = statSync(file).isDirectory() ? walk(file) : [file];
  for (const child of files) {
    if (files.length > 1) hash.update(path.relative(file, child));
    hash.update(readFileSync(child));
  }
  return hash.digest("hex");
}

function directorySize(file) {
  if (!statSync(file).isDirectory()) return statSync(file).size;
  return walk(file).reduce((total, child) => total + statSync(child).size, 0);
}

function walk(root) {
  assert(existsSync(root), `required path is missing: ${root}`);
  const output = [];
  const visit = (candidate) => {
    const stat = statSync(candidate);
    if (stat.isFile()) output.push(candidate);
    else if (stat.isDirectory()) {
      for (const name of readdirSync(candidate).sort()) visit(path.join(candidate, name));
    }
  };
  visit(root);
  return output;
}

function run(command, args, { allowNonZero = false } = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (!allowNonZero && result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed (${result.status}): ${result.stderr || result.stdout}`);
  }
  return result;
}

function assert(condition, message) {
  if (!condition) throw new Error(`macOS package verification failed: ${message}`);
}
