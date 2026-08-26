import { describe, expect, it } from "vitest";
import { buildDisplayListTargetProof, parseSwfDisplayList } from "../../scripts/lib/swf-display-list.mjs";

const placementDump = `[HEADER]        File version: 6
[HEADER]        Frame rate: 12.000000
[HEADER]        Frame count: 1
[HEADER]        Movie width: 640.00
[HEADER]        Movie height: 480.00
[020]       273 DEFINESHAPE3 defines id 0038
                 bbox [-219.20, -343.85, 219.25, -4.05]
[024]      1081 DEFINEBITSLOSSLESS2 defines id 0039 image 412x138 (8 bpp)
                 bbox [0.00, 0.00, 0.00, 0.00]
[002]      1506 DEFINESHAPE defines id 0040
                 bbox [-205.00, -26.50, 194.10, 56.40]
[027]         4 DEFINESPRITE defines id 0042
[02d]         4          SOUNDSTREAMHEAD2
[01a]         6          PLACEOBJECT2 places id 0038 at depth 0001
                          | Matrix
                          | 1.000 0.000   0.00
                          | 0.000 1.000   0.00
[01a]        20          PLACEOBJECT2 places id 0040 at depth 0002
                          | Matrix             | CXForm    r    g    b    a
                          | 1.000 0.000   2.80 | mul     0.0  0.0  0.0  1.0
                          | 0.000 1.000 -56.45 | add       0  102  255    0
[02b]         5          FRAMELABEL "home"
[001]         0          SHOWFRAME 1 (00:00:00,000) (label "home")
[000]         0          END
[01a]        19 PLACEOBJECT2 places id 0042 at depth 0082 name "courtain"
                 | Matrix             | Ratio
                 | 1.000 0.000 319.85 | 5
                 | 0.000 1.000   4.90 |
[001]         0 SHOWFRAME 1 (00:00:00,000)
`;

describe("SWF display-list evidence parser", () => {
  it("preserves nested ownership, geometry, transforms, ratios, and frame labels", () => {
    const displayList = parseSwfDisplayList(placementDump, "song1/song.swf");

    expect(displayList.header).toEqual({
      fileVersion: 6,
      frameRate: 12,
      frameCount: 1,
      width: 640,
      height: 480,
    });
    expect(displayList.definitionsById[38].bounds).toEqual([-219.2, -343.85, 219.25, -4.05]);
    expect(displayList.definitionsById[39]).toMatchObject({ kind: "DEFINEBITSLOSSLESS2", width: 412, height: 138 });
    expect(displayList.spritesById[42].frameLabels).toEqual([{ name: "home", frame: 1 }]);
    expect(displayList.spritesById[42].placements).toEqual([
      expect.objectContaining({
        characterId: 38,
        depth: 1,
        matrix: [1, 0, 0, 1, 0, 0],
        ratio: null,
      }),
      expect.objectContaining({
        characterId: 40,
        depth: 2,
        matrix: [1, 0, 0, 1, 2.8, -56.45],
        colorTransform: { multiply: [0, 0, 0, 1], add: [0, 102, 255, 0] },
      }),
    ]);
    expect(displayList.root.placements).toEqual([
      expect.objectContaining({
        characterId: 42,
        depth: 82,
        name: "courtain",
        ratio: 5,
        matrix: [1, 0, 0, 1, 319.85, 4.9],
      }),
    ]);
  });

  it("builds a consumable target proof and reports an exact blocker for missing symbols", () => {
    const displayList = parseSwfDisplayList(placementDump, "song1/song.swf");
    const curtain = buildDisplayListTargetProof(displayList, {
      key: "songCurtain",
      label: "Song curtain",
      symbolId: 42,
      preferredOwnerSpriteId: null,
      preferredFrame: 1,
      preferredDepth: 82,
      preferredName: "courtain",
      requiredChildCharacterIds: [38, 40],
      requiredFrameCharacterIds: [42],
      promotedAssets: ["src/assets/nutcracker-source/song-curtain-fill.png"],
    });
    const missing = buildDisplayListTargetProof(displayList, {
      key: "songHelp",
      label: "Song help",
      symbolId: 333,
      promotedAssets: [],
    });

    expect(curtain).toMatchObject({
      key: "songCurtain",
      status: "recovered",
      symbolId: 42,
      rootPlacement: { depth: 82, name: "courtain" },
      childPlacementCount: 2,
    });
    expect(curtain.blockers).toEqual([]);
    expect(curtain.compositionPlacements).toEqual([
      expect.objectContaining({ ownerSpriteId: null, frame: 1, characterId: 42, depth: 82 }),
    ]);
    expect(missing.status).toBe("blocked");
    expect(missing.blockers).toEqual(["song1/song.swf does not define requested sprite id 0333"]);
  });

  it("blocks mismatched target placements and incomplete child/frame compositions", () => {
    const displayList = parseSwfDisplayList(placementDump, "song1/song.swf");
    const target = buildDisplayListTargetProof(displayList, {
      key: "songCurtain",
      label: "Song curtain",
      symbolId: 42,
      preferredOwnerSpriteId: null,
      preferredFrame: 1,
      preferredDepth: 81,
      preferredName: "courtain",
      requiredChildCharacterIds: [38, 99],
      requiredFrameCharacterIds: [42, 100],
      promotedAssets: [],
    });

    expect(target.status).toBe("blocked");
    expect(target.rootPlacement).toBeNull();
    expect(target.blockers).toEqual([
      'song1/song.swf defines sprite id 0042 but no placement matches owner root, frame 1, depth 0081, name "courtain"',
      "song1/song.swf sprite id 0042 is missing required child placement ids 0099",
    ]);

    const incompleteFrame = buildDisplayListTargetProof(displayList, {
      key: "songCurtain",
      label: "Song curtain",
      symbolId: 42,
      preferredOwnerSpriteId: null,
      preferredFrame: 1,
      preferredDepth: 82,
      requiredFrameCharacterIds: [42, 100],
      promotedAssets: [],
    });
    expect(incompleteFrame.blockers).toEqual([
      "song1/song.swf root frame 1 is missing required composition placement ids 0100",
    ]);
  });
});
