import { describe, expect, it } from "vitest";
import { nutcrackerDisplayListTargets } from "../data/generated/nutcrackerDisplayListCatalog";

describe("generated Nutcracker display-list catalog", () => {
  it("covers every required chooser and song composition target without hidden blockers", () => {
    expect(nutcrackerDisplayListTargets.map((target) => target.key)).toEqual([
      "chooserHallway",
      "chooserFrame",
      "chooserInstruments",
      "songCurtain",
      "songHelp",
      "songWarning",
    ]);
    nutcrackerDisplayListTargets.forEach((target) => {
      expect(target.status).toBe("recovered");
      expect(target.blockers).toEqual([]);
      expect(target.rootPlacement).not.toBeNull();
      expect(target.promotedAssets.length).toBeGreaterThan(0);
    });
  });

  it("retains the source curtain timeline and nested help/warning placement records", () => {
    const curtain = nutcrackerDisplayListTargets.find((target) => target.key === "songCurtain");
    const help = nutcrackerDisplayListTargets.find((target) => target.key === "songHelp");
    const warning = nutcrackerDisplayListTargets.find((target) => target.key === "songWarning");

    expect(curtain?.frameLabels).toEqual([
      { name: "home", frame: 1 },
      { name: "alert", frame: 2 },
      { name: "bye", frame: 6 },
      { name: "giveHint", frame: 11 },
      { name: "quitNow", frame: 16 },
    ]);
    expect(help?.rootPlacement).toMatchObject({ ownerSpriteId: 359, depth: 1, ratio: 27 });
    expect(warning?.rootPlacement).toMatchObject({ ownerSpriteId: 359, depth: 1, ratio: 29 });
    expect(help?.compositionPlacements.map((placement) => placement.characterId)).toEqual([333, 334]);
    expect(warning?.compositionPlacements.map((placement) => placement.characterId)).toEqual([340, 341, 346, 351, 352]);
  });
});
