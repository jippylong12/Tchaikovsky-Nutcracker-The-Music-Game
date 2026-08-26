import { Buffer } from "node:buffer";
import { deflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { extractEmbeddedSwf } from "../../scripts/lib/flash-projector.mjs";

function makeMinimalSwfBody(extraTags = Buffer.alloc(0)) {
  return Buffer.concat([
    Buffer.from([0x08, 0x00]), // RECT with one-bit zero coordinates.
    Buffer.from([0x00, 0x0f]), // 15 fps FIXED8.
    Buffer.from([0x01, 0x00]), // One frame.
    extraTags,
    Buffer.from([0x00, 0x00]), // END tag.
  ]);
}

function makeCompressedSwf(body = makeMinimalSwfBody(), version = 6, declaredLength = body.length + 8) {
  const header = Buffer.alloc(8);
  header.write("CWS", 0, "ascii");
  header[3] = version;
  header.writeUInt32LE(declaredLength, 4);
  return Buffer.concat([header, deflateSync(body)]);
}

function makeUncompressedSwf(body = makeMinimalSwfBody(), version = 6) {
  const header = Buffer.alloc(8);
  header.write("FWS", 0, "ascii");
  header[3] = version;
  header.writeUInt32LE(body.length + 8, 4);
  return Buffer.concat([header, body]);
}

describe("Flash projector source extraction", () => {
  it("ignores decoy signatures and recovers the appended compressed SWF", () => {
    const body = makeMinimalSwfBody(Buffer.from([0x40, 0x00])); // SHOWFRAME tag.
    const swf = makeCompressedSwf(body);
    const projector = Buffer.concat([
      Buffer.from("MZ-decoy-CWS-not-a-real-stream", "utf8"),
      Buffer.alloc(24, 0xaa),
      swf,
    ]);

    const extracted = extractEmbeddedSwf(projector, "n_certificate.exe");

    expect(extracted.sourceFile).toBe("n_certificate.exe");
    expect(extracted.signature).toBe("CWS");
    expect(extracted.version).toBe(6);
    expect(extracted.declaredLength).toBe(body.length + 8);
    expect(extracted.offset).toBe(projector.length - swf.length);
    expect(extracted.swf.subarray(0, 3).toString("ascii")).toBe("FWS");
    expect(extracted.swf.subarray(8)).toEqual(body);
  });

  it("recovers an appended uncompressed SWF", () => {
    const swf = makeUncompressedSwf();
    const projector = Buffer.concat([Buffer.from("MZ-launcher", "utf8"), swf]);

    const extracted = extractEmbeddedSwf(projector, "certificate.exe");

    expect(extracted.signature).toBe("FWS");
    expect(extracted.offset).toBe(projector.length - swf.length);
    expect(extracted.swf).toEqual(swf);
  });

  it("ignores a later zlib-valid candidate that is not a structurally valid SWF", () => {
    const validSwf = makeCompressedSwf();
    const invalidSwf = makeCompressedSwf(Buffer.from("not-a-swf-movie", "utf8"));
    const projector = Buffer.concat([Buffer.from("MZ-launcher", "utf8"), validSwf, invalidSwf]);

    const extracted = extractEmbeddedSwf(projector, "certificate.exe");

    expect(extracted.offset).toBe(Buffer.byteLength("MZ-launcher"));
    expect(extracted.swf.subarray(8)).toEqual(makeMinimalSwfBody());
  });

  it("rejects compressed data that expands beyond its declared SWF length", () => {
    const oversized = makeCompressedSwf(makeMinimalSwfBody(Buffer.alloc(256, 0x40)), 6, 16);

    expect(() => extractEmbeddedSwf(oversized, "oversized.exe")).toThrow(
      "oversized.exe does not contain a valid appended FWS/CWS payload",
    );
  });

  it("fails with a precise blocker when no valid embedded SWF exists", () => {
    expect(() => extractEmbeddedSwf(Buffer.from("MZ without payload"), "broken.exe")).toThrow(
      "broken.exe does not contain a valid appended FWS/CWS payload",
    );
  });
});
