// Maintainer tool: packs the recovered CD install (analysis/setup/app) and the Internet Archive scans
// and metadata (base/, minus the disc image itself) into original-cd/ as a brotli-compressed tar split
// into parts that GitHub accepts (each under 50 MB). scripts/restore-original-cd.mjs reverses it with
// Node alone. Run from app/: node scripts/pack-original-cd.mjs
import console from "node:console";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants } from "node:zlib";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const outputRoot = join(repoRoot, "original-cd");
const partSize = 45 * 1024 * 1024;

// ustar, no macOS AppleDouble or extended attributes, so every platform's restore sees plain files.
const tar = execFileSync(
  "tar",
  [
    "--format", "ustar",
    "--exclude", "recovered-renders",
    "--exclude", ".DS_Store",
    "--exclude", "*.iso",
    "-cf", "-",
    "analysis/setup/app",
    "base",
  ],
  { cwd: repoRoot, env: { ...process.env, COPYFILE_DISABLE: "1" }, maxBuffer: 1024 * 1024 * 1024 },
);
console.log(`tar: ${tar.length} bytes`);

const packed = brotliCompressSync(tar, {
  params: { [constants.BROTLI_PARAM_QUALITY]: 9, [constants.BROTLI_PARAM_LGWIN]: 24 },
});
console.log(`brotli: ${packed.length} bytes`);

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });
const parts = [];
for (let offset = 0, index = 1; offset < packed.length; offset += partSize, index += 1) {
  const chunk = packed.subarray(offset, offset + partSize);
  const name = `original-cd.tar.br.part${String(index).padStart(2, "0")}`;
  writeFileSync(join(outputRoot, name), chunk);
  parts.push({ name, size: chunk.length, sha256: createHash("sha256").update(chunk).digest("hex") });
}

const manifest = {
  description: "Recovered Tchaikovsky Nutcracker CD install (analysis/setup/app) and Internet Archive scans (base/)",
  tarSha256: createHash("sha256").update(tar).digest("hex"),
  tarSize: tar.length,
  parts,
};
writeFileSync(join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`wrote ${parts.length} parts to ${outputRoot}: ${readdirSync(outputRoot).join(", ")}`);
