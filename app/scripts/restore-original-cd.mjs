// Unpacks the original CD files committed under original-cd/ back into analysis/setup/app/ and base/,
// using only Node (no tar, unzip, or other tools). Runs automatically before `npm run dev` and
// `npm run build`; run it by hand with `npm run setup:cd`. Skips the work when the files are already
// restored from the same archive.
import { Buffer } from "node:buffer";
import console from "node:console";
import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, utimesSync, writeFileSync } from "node:fs";
import { dirname, join, normalize, sep } from "node:path";
import process from "node:process";
import { PassThrough } from "node:stream";
import { fileURLToPath } from "node:url";
import { createBrotliDecompress } from "node:zlib";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const archiveRoot = join(repoRoot, "original-cd");
const stampPath = join(repoRoot, "analysis/.original-cd-restored");
const allowedRoots = ["analysis/setup/app/", "base/"];

const manifestPath = join(archiveRoot, "manifest.json");
if (!existsSync(manifestPath)) {
  console.warn("restore-original-cd: original-cd/manifest.json is missing; nothing to restore");
  process.exit(0);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

if (existsSync(stampPath) && readFileSync(stampPath, "utf8").trim() === manifest.tarSha256) {
  process.exit(0);
}

// Every part must be present and intact before anything is written.
for (const part of manifest.parts) {
  const path = join(archiveRoot, part.name);
  if (!existsSync(path)) throw new Error(`restore-original-cd: ${part.name} is missing`);
  const sha256 = createHash("sha256").update(readFileSync(path)).digest("hex");
  if (sha256 !== part.sha256) throw new Error(`restore-original-cd: ${part.name} is damaged (SHA-256 mismatch)`);
}

function field(header, offset, length) {
  const raw = header.subarray(offset, offset + length);
  const end = raw.indexOf(0);
  return raw.subarray(0, end === -1 ? length : end).toString("utf8");
}

function octal(header, offset, length) {
  return parseInt(field(header, offset, length).trim() || "0", 8);
}

function safeTarget(name) {
  const normalized = normalize(name).split(sep).join("/");
  if (normalized.startsWith("/") || normalized.split("/").includes("..")) return null;
  if (!allowedRoots.some((root) => normalized.startsWith(root) || `${normalized}/` === root)) return null;
  return join(repoRoot, normalized);
}

console.log("restore-original-cd: unpacking the original CD files (about 250 MB, one time)...");
const tarHash = createHash("sha256");
let pending = Buffer.alloc(0);
let current = null; // { path, size, mtime, chunks, remaining }
let skipPadding = 0;
let files = 0;
let ended = false;

function consume() {
  for (;;) {
    if (skipPadding > 0) {
      const take = Math.min(skipPadding, pending.length);
      pending = pending.subarray(take);
      skipPadding -= take;
      if (skipPadding > 0) return;
    }
    if (current) {
      const take = Math.min(current.remaining, pending.length);
      if (take > 0) current.chunks.push(pending.subarray(0, take));
      pending = pending.subarray(take);
      current.remaining -= take;
      if (current.remaining > 0) return;
      if (current.path) {
        mkdirSync(dirname(current.path), { recursive: true });
        writeFileSync(current.path, Buffer.concat(current.chunks));
        utimesSync(current.path, current.mtime, current.mtime);
        files += 1;
      }
      skipPadding = (512 - (current.size % 512)) % 512;
      current = null;
      continue;
    }
    if (ended || pending.length < 512) return;
    const header = pending.subarray(0, 512);
    pending = pending.subarray(512);
    if (header.every((byte) => byte === 0)) {
      ended = true;
      return;
    }
    const prefix = field(header, 345, 155);
    const name = prefix ? `${prefix}/${field(header, 0, 100)}` : field(header, 0, 100);
    const size = octal(header, 124, 12);
    const type = String.fromCharCode(header[156] || 48);
    const target = type === "0" ? safeTarget(name) : null;
    if (type === "0" && !target) console.warn(`restore-original-cd: skipping unexpected path ${name}`);
    if (type === "5" && safeTarget(name)) mkdirSync(safeTarget(name), { recursive: true });
    current = { path: target, size, mtime: new Date(octal(header, 136, 12) * 1000), chunks: [], remaining: size };
    if (size === 0) {
      current.remaining = 0;
    }
  }
}

const joined = new PassThrough();
const decompress = createBrotliDecompress();
decompress.on("data", (chunk) => {
  tarHash.update(chunk);
  pending = pending.length ? Buffer.concat([pending, chunk]) : chunk;
  consume();
});

await new Promise((resolve, reject) => {
  decompress.on("end", resolve);
  decompress.on("error", reject);
  joined.pipe(decompress);
  (async () => {
    for (const part of manifest.parts) {
      for await (const chunk of createReadStream(join(archiveRoot, part.name))) joined.write(chunk);
    }
    joined.end();
  })().catch(reject);
});

const sha256 = tarHash.digest("hex");
if (sha256 !== manifest.tarSha256) throw new Error("restore-original-cd: the unpacked archive does not match its manifest");
mkdirSync(dirname(stampPath), { recursive: true });
writeFileSync(stampPath, `${sha256}\n`);
console.log(`restore-original-cd: restored ${files} original files into analysis/setup/app/ and base/`);
