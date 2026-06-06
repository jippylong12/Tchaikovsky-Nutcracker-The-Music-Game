export type GameKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type DoorKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ProgressStore = {
  version: 1;
  gameKeys: Record<GameKey, boolean>;
  nutDoors: Record<DoorKey, boolean>;
  childrensDoors: Record<DoorKey, boolean>;
  nutHouse: {
    openDoor: number;
  };
};

export type ProgressStoreSnapshot = ProgressStore & {
  completedGameCount: number;
  openedNutDoorCount: number;
  openedChildrensDoorCount: number;
};

const gameKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const doorKeys = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const maxNutHouseDoor = 8;

export const progressStorageKey = "nutcracker-progress-v1";

export type ProgressPersistence = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export type ProgressListener = (snapshot: ProgressStoreSnapshot) => void;

export type ProgressStoreController = {
  getSnapshot: () => ProgressStoreSnapshot;
  subscribe: (listener: ProgressListener) => () => void;
  markGameKey: (key: GameKey) => ProgressStoreSnapshot;
  markNutDoor: (door: DoorKey) => ProgressStoreSnapshot;
  markChildrensDoor: (door: DoorKey) => ProgressStoreSnapshot;
  setNutHouseOpenDoor: (door: number) => ProgressStoreSnapshot;
  resetGameKeys: () => ProgressStoreSnapshot;
  resetNutDoors: () => ProgressStoreSnapshot;
  resetChildrensDoors: () => ProgressStoreSnapshot;
  resetNutHouseRooms: () => ProgressStoreSnapshot;
  resetAll: () => ProgressStoreSnapshot;
};

function keyedBooleans<T extends readonly number[]>(keys: T): Record<T[number], boolean> {
  return Object.fromEntries(keys.map((key) => [key, false])) as Record<T[number], boolean>;
}

function createEmptyProgressStore(): ProgressStore {
  return {
    version: 1,
    gameKeys: keyedBooleans(gameKeys),
    nutDoors: keyedBooleans(doorKeys),
    childrensDoors: keyedBooleans(doorKeys),
    nutHouse: {
      openDoor: 0,
    },
  };
}

export function createDefaultProgressStore(): ProgressStoreSnapshot {
  return toSnapshot(createEmptyProgressStore());
}

export function createProgressStore(storage = getDefaultPersistence()): ProgressStoreController {
  let store = loadProgress(storage);
  const listeners = new Set<ProgressListener>();

  const commit = (nextStore: ProgressStore): ProgressStoreSnapshot => {
    store = nextStore;
    persistProgress(storage, store);
    const snapshot = toSnapshot(store);
    listeners.forEach((listener) => listener(snapshot));
    return snapshot;
  };

  return {
    getSnapshot: () => toSnapshot(store),
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    markGameKey: (key) =>
      commit({
        ...store,
        gameKeys: {
          ...store.gameKeys,
          [key]: true,
        },
      }),
    markNutDoor: (door) =>
      commit({
        ...store,
        nutDoors: {
          ...store.nutDoors,
          [door]: true,
        },
      }),
    markChildrensDoor: (door) =>
      commit({
        ...store,
        childrensDoors: {
          ...store.childrensDoors,
          [door]: true,
        },
      }),
    setNutHouseOpenDoor: (door) =>
      commit({
        ...store,
        nutHouse: {
          openDoor: clampNutHouseDoor(door),
        },
      }),
    resetGameKeys: () =>
      commit({
        ...store,
        gameKeys: keyedBooleans(gameKeys),
      }),
    resetNutDoors: () =>
      commit({
        ...store,
        nutDoors: keyedBooleans(doorKeys),
      }),
    resetChildrensDoors: () =>
      commit({
        ...store,
        childrensDoors: keyedBooleans(doorKeys),
      }),
    resetNutHouseRooms: () =>
      commit({
        ...store,
        nutHouse: {
          openDoor: 0,
        },
      }),
    resetAll: () => {
      storage.removeItem(progressStorageKey);
      return commit(createEmptyProgressStore());
    },
  };
}

export function countCompletedGames(store: ProgressStore): number {
  return Object.values(store.gameKeys).filter(Boolean).length;
}

export function countOpenedDoors(doors: Record<DoorKey, boolean>): number {
  return Object.values(doors).filter(Boolean).length;
}

function toSnapshot(store: ProgressStore): ProgressStoreSnapshot {
  return {
    ...store,
    gameKeys: { ...store.gameKeys },
    nutDoors: { ...store.nutDoors },
    childrensDoors: { ...store.childrensDoors },
    nutHouse: { ...store.nutHouse },
    completedGameCount: countCompletedGames(store),
    openedNutDoorCount: countOpenedDoors(store.nutDoors),
    openedChildrensDoorCount: countOpenedDoors(store.childrensDoors),
  };
}

function loadProgress(storage: ProgressPersistence): ProgressStore {
  const stored = storage.getItem(progressStorageKey);
  if (!stored) {
    return createEmptyProgressStore();
  }

  try {
    return normalizeProgress(JSON.parse(stored));
  } catch {
    return createEmptyProgressStore();
  }
}

function persistProgress(storage: ProgressPersistence, store: ProgressStore): void {
  storage.setItem(progressStorageKey, JSON.stringify(store));
}

function normalizeProgress(candidate: unknown): ProgressStore {
  if (!isRecord(candidate) || candidate.version !== 1) {
    return createEmptyProgressStore();
  }

  return {
    version: 1,
    gameKeys: normalizeBooleanRecord(candidate.gameKeys, gameKeys),
    nutDoors: normalizeBooleanRecord(candidate.nutDoors, doorKeys),
    childrensDoors: normalizeBooleanRecord(candidate.childrensDoors, doorKeys),
    nutHouse: {
      openDoor: normalizeNutHouseDoor(candidate.nutHouse),
    },
  };
}

function normalizeBooleanRecord<T extends readonly number[]>(candidate: unknown, keys: T): Record<T[number], boolean> {
  const source = isRecord(candidate) ? candidate : {};
  return Object.fromEntries(keys.map((key) => [key, source[String(key)] === true])) as Record<T[number], boolean>;
}

function normalizeNutHouseDoor(candidate: unknown): number {
  if (!isRecord(candidate)) {
    return 0;
  }

  return clampNutHouseDoor(Number(candidate.openDoor));
}

function clampNutHouseDoor(door: number): number {
  if (!Number.isInteger(door)) {
    return 0;
  }

  return Math.min(Math.max(door, 0), maxNutHouseDoor);
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === "object" && candidate !== null;
}

function getDefaultPersistence(): ProgressPersistence {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }

  const fallback = new Map<string, string>();
  return {
    getItem: (key) => fallback.get(key) ?? null,
    setItem: (key, value) => {
      fallback.set(key, value);
    },
    removeItem: (key) => {
      fallback.delete(key);
    },
  };
}
