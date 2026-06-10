import { execFileSync } from "node:child_process";
import { Buffer } from "node:buffer";
import console from "node:console";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { inflateSync } from "node:zlib";

const sourceFiles = [
  "../analysis/setup/app/games/nutcrackergame/nutchooser.swf",
  ...Array.from({ length: 8 }, (_item, index) => `../analysis/setup/app/games/nutcrackergame/song${index + 1}/song.swf`),
];
const outputRoot = "generated/nutcracker-source-extract/direct-image-tags";

function readBits(buffer, bitOffset, bitCount) {
  let value = 0;
  for (let index = 0; index < bitCount; index += 1) {
    const absolute = bitOffset + index;
    const byte = buffer[Math.floor(absolute / 8)];
    const bit = (byte >> (7 - (absolute % 8))) & 1;
    value = (value << 1) | bit;
  }
  return value;
}

function readSwf(filePath) {
  const raw = readFileSync(filePath);
  const signature = raw.subarray(0, 3).toString("ascii");
  const body = signature === "CWS" ? Buffer.concat([raw.subarray(0, 8), inflateSync(raw.subarray(8))]) : raw;
  if (signature !== "CWS" && signature !== "FWS") {
    throw new Error(`Unsupported SWF signature ${signature} in ${filePath}`);
  }
  const rectBitCount = readBits(body, 64, 5);
  const rectBytes = Math.ceil((5 + 4 * rectBitCount) / 8);
  return { body, tagStart: 8 + rectBytes + 4 };
}

function readTags(buffer, start = 0) {
  const tags = [];
  let offset = start;
  while (offset + 2 <= buffer.length) {
    const header = buffer.readUInt16LE(offset);
    offset += 2;
    const code = header >> 6;
    let length = header & 0x3f;
    if (length === 0x3f) {
      length = buffer.readUInt32LE(offset);
      offset += 4;
    }
    tags.push({ code, data: buffer.subarray(offset, offset + length) });
    offset += length;
    if (code === 0) {
      break;
    }
  }
  return tags;
}

function repairSwfJpegMarkers(buffer) {
  const markerPair = Buffer.from([0xff, 0xd9, 0xff, 0xd8]);
  const chunks = [];
  let rest = buffer;
  let markerIndex = rest.indexOf(markerPair);
  while (markerIndex !== -1) {
    chunks.push(rest.subarray(0, markerIndex));
    rest = rest.subarray(markerIndex + markerPair.length);
    markerIndex = rest.indexOf(markerPair);
  }
  chunks.push(rest);
  return Buffer.concat(chunks);
}

function readJpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      throw new Error("Invalid JPEG marker stream");
    }
    while (buffer[offset] === 0xff) {
      offset += 1;
    }
    const marker = buffer[offset];
    offset += 1;
    if (marker === 0xd9 || marker === 0xda) {
      break;
    }
    const length = buffer.readUInt16BE(offset);
    if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7)) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      };
    }
    offset += length;
  }
  throw new Error("JPEG dimensions not found");
}

function outputFolderFor(filePath) {
  if (filePath.includes("/nutchooser.swf")) {
    return "nutchooser";
  }
  return basename(dirname(filePath)).replace(/\s+/g, "-");
}

mkdirSync(outputRoot, { recursive: true });
const inventory = [];

for (const filePath of sourceFiles) {
  if (!existsSync(filePath)) {
    continue;
  }
  const { body, tagStart } = readSwf(filePath);
  const outputFolder = join(outputRoot, outputFolderFor(filePath));
  mkdirSync(outputFolder, { recursive: true });

  for (const tag of readTags(body, tagStart)) {
    if (tag.code !== 35) {
      continue;
    }

    const id = tag.data.readUInt16LE(0);
    const alphaOffset = tag.data.readUInt32LE(2);
    const jpeg = repairSwfJpegMarkers(tag.data.subarray(6, 6 + alphaOffset));
    const alpha = inflateSync(tag.data.subarray(6 + alphaOffset));
    const dimensions = readJpegDimensions(jpeg);
    if (alpha.length !== dimensions.width * dimensions.height) {
      throw new Error(`Alpha size mismatch for ${filePath} JPEG3 ${id}`);
    }

    const basePath = join(outputFolder, `jpeg3-${id}`);
    const jpgPath = `${basePath}.repaired.jpg`;
    const pgmPath = `${basePath}.alpha.pgm`;
    const pngPath = `${basePath}.rgba.png`;
    writeFileSync(jpgPath, jpeg);
    writeFileSync(pgmPath, Buffer.concat([Buffer.from(`P5\n${dimensions.width} ${dimensions.height}\n255\n`, "ascii"), alpha]));
    execFileSync("magick", [jpgPath, pgmPath, "-alpha", "off", "-compose", "CopyOpacity", "-composite", pngPath]);
    inventory.push(`${filePath}\tJPEG3 ${id}\t${dimensions.width}x${dimensions.height}\t${pngPath}`);
  }
}

writeFileSync(join(outputRoot, "jpeg3-inventory.tsv"), `${inventory.join("\n")}\n`);
console.log(inventory.join("\n"));
