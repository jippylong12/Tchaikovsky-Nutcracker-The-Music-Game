import { Buffer } from "node:buffer";
import { inflateSync } from "node:zlib";

const signatures = ["FWS", "CWS"];
const maximumSwfLength = 100 * 1024 * 1024;

export function extractEmbeddedSwf(projector, sourceFile) {
  const candidates = signatures.flatMap((signature) => findSignatureOffsets(projector, signature));
  const validCandidates = candidates
    .sort((left, right) => left.offset - right.offset)
    .map((candidate) => validateCandidate(projector, candidate, sourceFile))
    .filter((candidate) => candidate !== null);
  const extracted = validCandidates.at(-1);

  if (!extracted) {
    throw new Error(`${sourceFile} does not contain a valid appended FWS/CWS payload`);
  }
  return extracted;
}

function findSignatureOffsets(projector, signature) {
  const offsets = [];
  let offset = projector.indexOf(signature, 0, "ascii");
  while (offset >= 0) {
    offsets.push({ signature, offset });
    offset = projector.indexOf(signature, offset + 1, "ascii");
  }
  return offsets;
}

function validateCandidate(projector, candidate, sourceFile) {
  if (candidate.offset + 8 > projector.length) {
    return null;
  }
  const version = projector[candidate.offset + 3];
  const declaredLength = projector.readUInt32LE(candidate.offset + 4);
  if (version < 1 || version > 50 || declaredLength < 8 || declaredLength > maximumSwfLength) {
    return null;
  }

  try {
    const swf = candidate.signature === "FWS"
      ? readUncompressedSwf(projector, candidate.offset, declaredLength)
      : readCompressedSwf(projector, candidate.offset, declaredLength);
    if (!swf || !hasValidSwfStructure(swf)) {
      return null;
    }
    return {
      sourceFile,
      signature: candidate.signature,
      offset: candidate.offset,
      version,
      declaredLength,
      swf,
    };
  } catch {
    return null;
  }
}

function readUncompressedSwf(projector, offset, declaredLength) {
  if (offset + declaredLength > projector.length) {
    return null;
  }
  return Buffer.from(projector.subarray(offset, offset + declaredLength));
}

function readCompressedSwf(projector, offset, declaredLength) {
  const expectedBodyLength = declaredLength - 8;
  const body = inflateSync(projector.subarray(offset + 8), {
    maxOutputLength: Math.max(expectedBodyLength, 1),
  });
  if (body.length !== expectedBodyLength) {
    return null;
  }
  const header = Buffer.from(projector.subarray(offset, offset + 8));
  header.write("FWS", 0, "ascii");
  return Buffer.concat([header, body]);
}

function hasValidSwfStructure(swf) {
  if (swf.length < 16 || swf.subarray(0, 3).toString("ascii") !== "FWS") {
    return false;
  }

  const rectCoordinateBits = swf[8] >> 3;
  if (rectCoordinateBits === 0) {
    return false;
  }
  const rectByteLength = Math.ceil((5 + rectCoordinateBits * 4) / 8);
  let offset = 8 + rectByteLength + 4;
  if (offset + 2 > swf.length) {
    return false;
  }

  while (offset + 2 <= swf.length) {
    const tagHeader = swf.readUInt16LE(offset);
    offset += 2;
    const tagCode = tagHeader >> 6;
    let tagLength = tagHeader & 0x3f;
    if (tagLength === 0x3f) {
      if (offset + 4 > swf.length) {
        return false;
      }
      tagLength = swf.readUInt32LE(offset);
      offset += 4;
    }
    if (offset + tagLength > swf.length) {
      return false;
    }
    offset += tagLength;
    if (tagCode === 0) {
      return tagLength === 0 && offset === swf.length;
    }
  }

  return false;
}
