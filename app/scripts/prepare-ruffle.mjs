// Unpacks the pinned, committed official Ruffle v0.5.0 self-hosted web build into public/ruffle/
// so Vite (dev) and the Tauri bundle (build) serve it locally. No network access at any point.
import console from "node:console";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const archivePath = join(appRoot, "vendor/ruffle/ruffle-0.5.0-web-selfhosted.zip");
const expectedSha256 = "4e0d44ba990f9fe3434d7848f740348299bd6c473db59fb5f8606b750fcc5760";
const outputRoot = join(appRoot, "public/ruffle");
const stampPath = join(outputRoot, ".ruffle-archive-sha256");

const actualSha256 = createHash("sha256").update(readFileSync(archivePath)).digest("hex");
if (actualSha256 !== expectedSha256) {
  throw new Error(`Ruffle archive SHA-256 mismatch: expected ${expectedSha256}, got ${actualSha256}`);
}

const upToDate =
  existsSync(stampPath) &&
  readFileSync(stampPath, "utf8").trim() === expectedSha256 &&
  existsSync(join(outputRoot, "ruffle.js"));

if (!upToDate) {
  rmSync(outputRoot, { recursive: true, force: true });
  mkdirSync(outputRoot, { recursive: true });
  // Source maps are 1.5 MB of debugging data the player never requests; leave them out of the bundle.
  execFileSync("unzip", ["-q", "-o", archivePath, "-x", "*.map", "-d", outputRoot]);
  writeFileSync(stampPath, `${expectedSha256}\n`);
  console.log(`Unpacked Ruffle v0.5.0 into ${outputRoot}`);
}
