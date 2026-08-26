export type RouteGroup = "menu" | "reference" | "suite" | "mini-game";

export type RouteDefinition = {
  readonly id: string;
  readonly title: string;
  readonly heading: string;
  readonly summary: string;
  readonly group: RouteGroup;
  readonly levelTarget: "_level0" | "_level1";
  readonly mainMenu: boolean;
};

export const routes = [
  {
    id: "overture",
    title: "Overture",
    heading: "Tchaikovsky's Nutcracker: The Music Game",
    summary:
      "Recovered projector-intro representation with the source skip behavior and a promoted flute_intro.swf garden layer.",
    group: "menu",
    levelTarget: "_level0",
    mainMenu: false,
  },
  {
    id: "main-menu",
    title: "Main Menu",
    heading: "Choose an activity",
    summary:
      "The recovered projector playRoom frame with its original 640 x 480 room art, source-coordinate activity hotspots, and nine-key Nutcracker gate.",
    group: "menu",
    levelTarget: "_level0",
    mainMenu: false,
  },
  {
    id: "story",
    title: "Story",
    heading: "The Nutcracker story",
    summary:
      "Four source-labeled spreads with the original eight-page story text, recovered book art, and exact NEXT, PREV, and EXIT controls.",
    group: "reference",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "composer-biography",
    title: "Composer",
    heading: "Tchaikovsky biography",
    summary:
      "Four source-labeled spreads with exact SWF biography prose, recovered images, and exact NEXT, PREV, and EXIT controls.",
    group: "reference",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "ballet-history",
    title: "Ballet",
    heading: "Ballet history",
    summary:
      "Five source-labeled spreads preserving the original ten-page ballet history and its recovered reader controls and imagery.",
    group: "reference",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "music-dictionary",
    title: "Music Dictionary",
    heading: "Instrument encyclopedia",
    summary:
      "Source-sequenced Musictionary entries with exact instrument prose, recovered audio players, and the original NEXT and EXIT progression.",
    group: "reference",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "suite",
    title: "Nutcracker Suite",
    heading: "Listening player",
    summary:
      "The recovered Listening Room gramophone and frame layers with source theme paths, disc labels, and play/pause state behavior.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "nutcracker-chooser",
    title: "Song Doors",
    heading: "Nutcracker song chooser",
    summary:
      "Placeholder for the eight-door chooser. Door visits and completion keys now come from the local progress store instead of helper EXEs.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "song-1",
    title: "Song 1",
    heading: "Nutcracker song game 1",
    summary: "Placeholder for the first song game route loaded from the recovered song1 SWF.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: false,
  },
  {
    id: "song-2",
    title: "Song 2",
    heading: "Nutcracker song game 2",
    summary: "Placeholder for the second song game route loaded from the recovered song2 SWF.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: false,
  },
  {
    id: "song-3",
    title: "Song 3",
    heading: "Nutcracker song game 3",
    summary: "Placeholder for the third song game route loaded from the recovered song3 SWF.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: false,
  },
  {
    id: "song-4",
    title: "Song 4",
    heading: "Nutcracker song game 4",
    summary: "Placeholder for the fourth song game route loaded from the recovered song4 SWF.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: false,
  },
  {
    id: "song-5",
    title: "Song 5",
    heading: "Nutcracker song game 5",
    summary: "Placeholder for the fifth song game route loaded from the recovered song5 SWF.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: false,
  },
  {
    id: "song-6",
    title: "Song 6",
    heading: "Nutcracker song game 6",
    summary: "Placeholder for the sixth song game route loaded from the recovered song6 SWF.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: false,
  },
  {
    id: "song-7",
    title: "Song 7",
    heading: "Nutcracker song game 7",
    summary: "Placeholder for the seventh song game route loaded from the recovered song7 SWF.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: false,
  },
  {
    id: "song-8",
    title: "Song 8",
    heading: "Nutcracker song game 8",
    summary: "Placeholder for the eighth song game route loaded from the recovered song8 SWF.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: false,
  },
  {
    id: "childrens-album",
    title: "Children's Album",
    heading: "Children's Album doors",
    summary:
      "Placeholder for the second eight-door music activity, including saved door visits and album pattern data.",
    group: "suite",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "tree-game",
    title: "Tree Game",
    heading: "Instrument tree game",
    summary:
      "Source-backed three-round listening game using the recovered tree layers, exact hotspots, bundled prompts, and game key 8 path.",
    group: "mini-game",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "flying-instruments",
    title: "Flying Instruments",
    heading: "Flying Instruments",
    summary:
      "Source-backed instrument-family game using the recovered instrument art, embedded sounds, level grid, and game key 3 completion path.",
    group: "mini-game",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "trivia",
    title: "Trivia",
    heading: "Trivia challenge",
    summary:
      "Source-backed 106-question game using the recovered book, exact question/answer placements, embedded feedback sounds, and game key 9 path.",
    group: "mini-game",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "melody",
    title: "Melody",
    heading: "Melody sequence game",
    summary:
      "Source-backed Funky Monkey sequence game using recovered stage art, all four source difficulty sets, exact note audio, and game key 5 path.",
    group: "mini-game",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "memory",
    title: "Memory",
    heading: "Memory game",
    summary:
      "Source-backed MusiCards game using promoted card faces/backs, recovered level and error rules, bundled sounds, and game key 2 path.",
    group: "mini-game",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "puzzles",
    title: "Puzzles",
    heading: "Puzzle games",
    summary:
      "Placeholder for puzzle-style mini-games that can later mount Canvas scenes inside the fixed viewport.",
    group: "mini-game",
    levelTarget: "_level1",
    mainMenu: true,
  },
] as const satisfies readonly RouteDefinition[];

export const mainMenuRoutes = routes.filter((route) => route.mainMenu);

export const routeGroups: readonly { readonly id: RouteGroup; readonly title: string }[] = [
  {
    id: "reference",
    title: "Reference",
  },
  {
    id: "suite",
    title: "Music",
  },
  {
    id: "mini-game",
    title: "Games",
  },
] as const;

export const songRoutes = routes.filter((route) => route.id.startsWith("song-"));

export type RouteId = (typeof routes)[number]["id"];

export function getRouteById(routeId: RouteId) {
  return routes.find((route) => route.id === routeId) ?? routes[0];
}

export function isRouteId(routeId: string): routeId is RouteId {
  return routes.some((route) => route.id === routeId);
}
