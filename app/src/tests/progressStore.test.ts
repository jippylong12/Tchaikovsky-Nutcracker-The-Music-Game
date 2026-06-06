import { describe, expect, it } from "vitest";
import { countCompletedGames, createDefaultProgressStore, createProgressStore, progressStorageKey, type ProgressPersistence } from "../state/progressStore";

function createMemoryPersistence(initialValue?: string): ProgressPersistence {
  const values = new Map<string, string>();
  if (initialValue) {
    values.set(progressStorageKey, initialValue);
  }

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

describe("progress store foundation", () => {
  it("models the recovered key and door groups", () => {
    const store = createDefaultProgressStore();

    expect(Object.keys(store.gameKeys)).toHaveLength(9);
    expect(Object.keys(store.nutDoors)).toHaveLength(8);
    expect(Object.keys(store.childrensDoors)).toHaveLength(8);
    expect(store.nutHouse.openDoor).toBe(0);
    expect(store.completedGameCount).toBe(0);
  });

  it("counts completed game keys", () => {
    const store = createDefaultProgressStore();
    store.gameKeys[1] = true;
    store.gameKeys[8] = true;

    expect(countCompletedGames(store)).toBe(2);
  });

  it("persists game keys, door unlocks, and nut house state", () => {
    const storage = createMemoryPersistence();
    const store = createProgressStore(storage);

    store.markGameKey(8);
    store.markNutDoor(2);
    store.markChildrensDoor(3);
    store.setNutHouseOpenDoor(4);

    const reloaded = createProgressStore(storage).getSnapshot();
    expect(reloaded.gameKeys[8]).toBe(true);
    expect(reloaded.nutDoors[2]).toBe(true);
    expect(reloaded.childrensDoors[3]).toBe(true);
    expect(reloaded.nutHouse.openDoor).toBe(4);
    expect(reloaded.completedGameCount).toBe(1);
    expect(reloaded.openedNutDoorCount).toBe(1);
    expect(reloaded.openedChildrensDoorCount).toBe(1);
  });

  it("resets progress groups like the old helper executables", () => {
    const storage = createMemoryPersistence();
    const store = createProgressStore(storage);

    store.markGameKey(1);
    store.markNutDoor(1);
    store.markChildrensDoor(1);
    store.setNutHouseOpenDoor(8);
    store.resetGameKeys();
    store.resetNutDoors();
    store.resetChildrensDoors();
    store.resetNutHouseRooms();

    expect(store.getSnapshot().completedGameCount).toBe(0);
    expect(store.getSnapshot().openedNutDoorCount).toBe(0);
    expect(store.getSnapshot().openedChildrensDoorCount).toBe(0);
    expect(store.getSnapshot().nutHouse.openDoor).toBe(0);
  });

  it("normalizes malformed saved data back to safe defaults", () => {
    const storage = createMemoryPersistence(
      JSON.stringify({
        version: 1,
        gameKeys: { "1": true, "2": "yes" },
        nutDoors: { "9": true },
        childrensDoors: null,
        nutHouse: { openDoor: 12 },
      }),
    );

    const snapshot = createProgressStore(storage).getSnapshot();
    expect(snapshot.gameKeys[1]).toBe(true);
    expect(snapshot.gameKeys[2]).toBe(false);
    expect(snapshot.openedNutDoorCount).toBe(0);
    expect(snapshot.openedChildrensDoorCount).toBe(0);
    expect(snapshot.nutHouse.openDoor).toBe(8);
  });
});
