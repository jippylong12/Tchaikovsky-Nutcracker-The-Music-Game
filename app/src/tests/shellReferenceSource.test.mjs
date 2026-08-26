import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { describe, expect, it } from "vitest";
import { dictionaryInstruments, readingActivities } from "../data/referenceContent";
import { routes } from "../routes";

const sourceSceneRoot = path.resolve(process.cwd(), "src/assets/source-scenes");

function sha256(fileName) {
  return createHash("sha256").update(readFileSync(path.join(sourceSceneRoot, fileName))).digest("hex");
}

describe("shell and reference source reconstruction", () => {
  it("locks the promoted projector, intro, and Listening Room children", () => {
    expect(sha256("main-playroom-background.jpg")).toBe(
      "c0b4eb8a1b3a1fbf196bbc05a301d2b615de69e119d15bd09e694b7de796eddc",
    );
    expect(sha256("flute-intro-garden.jpg")).toBe(
      "90185364eb26cb2b295084db962c23aeab64090d268ae09c89add44489d27e7d",
    );
    expect(sha256("listening-room-gramophone.png")).toBe(
      "e194eaf7018eedd3b980af3deadea6f70514cd99fbfa896145e364538981609d",
    );
    expect(sha256("listening-room-frame.png")).toBe(
      "2a7b7bcb2a30b9e5e9fb5b5a82919e7b14605729e4f3c75e12a83928f0fa5261",
    );
    expect(sha256("listening-room-record-lp1.png")).toBe(
      "03ed65051b2f611b749ebfb1f527c77af5eed772d54cffc523da5dfb3e6de16a",
    );
    expect(sha256("listening-room-record-lp5.png")).toBe(
      "8fc9a896ea6b361be3ada8028b87cff8142ea707eb953924064bab0df29ba01a",
    );
    expect(sha256("story-reader-book.png")).toBe(
      "e6257fedfea3a714382c52f764f8022fbed5b2e47d1f2d6d5b3933b9ada650b2",
    );
    expect(sha256("biography-reader-book.png")).toBe(
      "6397fe3b7b90768c0136c7c203234fe41d8eca6e2aff680c084071b6b623ff51",
    );
    expect(sha256("ballet-reader-book.png")).toBe(
      "4ad48b9beb2c2cb7b21070afe575df1f241b7ff89de126b6f4079bd8837044e8",
    );
  });

  it("keeps exact reader spread counts and numbered source locators", () => {
    const story = readingActivities.find((activity) => activity.routeId === "story");
    const biography = readingActivities.find((activity) => activity.routeId === "composer-biography");
    const ballet = readingActivities.find((activity) => activity.routeId === "ballet-history");

    expect(story?.pages).toHaveLength(4);
    expect(biography?.pages).toHaveLength(4);
    expect(ballet?.pages).toHaveLength(5);
    expect(readingActivities.map((activity) => activity.bookImagePath)).toEqual([
      expect.stringContaining("story-reader-book"),
      expect.stringContaining("biography-reader-book"),
      expect.stringContaining("ballet-reader-book"),
    ]);
    expect(biography?.pages[1].columns[0].body).toContain("drumming his fingers on windowpanes");
    expect(biography?.pages[1].columns.map((column) => column.sourceTextIds)).toEqual([[36], [37]]);
    expect(biography?.pages[2].columns[1].sourceImageIds).toEqual([45, 46]);
    expect(biography?.pages[2].columns[1].imagePaths).toHaveLength(2);
    expect(ballet?.pages[4].columns[1].body).toContain("George Balanchine");
    expect(ballet?.pages[4].columns.map((column) => column.sourceTextIds)).toEqual([[], [54]]);
    expect(readingActivities.every((activity) => activity.pages.every((page) => page.sourceFrameLabel.length > 0))).toBe(true);
  });

  it("maps Musictionary prose to exact source player and text ids", () => {
    const timpani = dictionaryInstruments.find((instrument) => instrument.id === "timpani");
    const tuba = dictionaryInstruments.find((instrument) => instrument.id === "tuba");

    expect(timpani).toMatchObject({ sourceAssetId: 527, sourceTextId: 528 });
    expect(timpani?.summary).toContain("set of four huge metal bowls");
    expect(tuba).toMatchObject({ sourceAssetId: 854, sourceTextId: 855 });
    expect(dictionaryInstruments.every((instrument) => instrument.summary.length > 150)).toBe(true);
    expect(dictionaryInstruments.map((instrument) => instrument.id)).toEqual([
      "flute",
      "oboe",
      "clarinet",
      "bassoon",
      "saxophone",
      "harp",
      "piano",
      "vibraphone",
      "timpani",
      "cymbals",
      "double-bass",
      "cello",
      "violin",
      "viola",
      "trumpet",
      "trombone",
      "french-horn",
      "tuba",
    ]);
  });

  it("removes placeholder claims from every retrofitted route", () => {
    const retrofittedRouteIds = new Set([
      "overture",
      "main-menu",
      "story",
      "composer-biography",
      "ballet-history",
      "music-dictionary",
      "suite",
    ]);
    const retrofitted = routes.filter((route) => retrofittedRouteIds.has(route.id));

    expect(retrofitted).toHaveLength(retrofittedRouteIds.size);
    expect(retrofitted.every((route) => !/placeholder/i.test(route.summary))).toBe(true);
  });
});
