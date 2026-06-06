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
      "A desktop-first remake shell for restoring the original Flash activities, music games, progress keys, and local asset playback.",
    group: "menu",
    levelTarget: "_level0",
    mainMenu: false,
  },
  {
    id: "main-menu",
    title: "Main Menu",
    heading: "Choose an activity",
    summary:
      "The original projector loaded movies into Flash levels. This remake keeps the desktop frame stable and swaps typed scene routes inside the 640 x 480 viewport.",
    group: "menu",
    levelTarget: "_level0",
    mainMenu: false,
  },
  {
    id: "story",
    title: "Story",
    heading: "The Nutcracker story",
    summary:
      "Placeholder for the narrated story pages and scene artwork recovered from the activity SWFs.",
    group: "reference",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "composer-biography",
    title: "Composer",
    heading: "Tchaikovsky biography",
    summary:
      "Placeholder for the composer biography reader with local text, images, and voice/audio cues.",
    group: "reference",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "ballet-history",
    title: "Ballet",
    heading: "Ballet history",
    summary:
      "Placeholder for the educational ballet-history activity and page-level navigation.",
    group: "reference",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "music-dictionary",
    title: "Music Dictionary",
    heading: "Instrument encyclopedia",
    summary:
      "Placeholder for the dictionary browser and local instrument audio examples.",
    group: "reference",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "suite",
    title: "Nutcracker Suite",
    heading: "Listening player",
    summary:
      "Placeholder for the gramophone-style listening player backed by bundled MP3/WAV assets.",
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
      "Placeholder for the recovered tree activity. Completion will unlock game key 8 through the local progress API.",
    group: "mini-game",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "trivia",
    title: "Trivia",
    heading: "Trivia challenge",
    summary:
      "Placeholder for the question-bank game. Completion will unlock game key 9 without invoking Windows helper programs.",
    group: "mini-game",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "melody",
    title: "Melody",
    heading: "Melody sequence game",
    summary:
      "Placeholder for sequence playback and answer checking using parsed melody text data.",
    group: "mini-game",
    levelTarget: "_level1",
    mainMenu: true,
  },
  {
    id: "memory",
    title: "Memory",
    heading: "Memory game",
    summary:
      "Placeholder for matching-card gameplay and shared audio feedback.",
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
