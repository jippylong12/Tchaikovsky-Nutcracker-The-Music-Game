import nutChooserFrameUrl from "./assets/nutcracker-source/nutchooser-frame-source.png";
import nutChooserSourceNormalUrl from "./assets/nutcracker-source/nutchooser-source-normal.png";
import chooserOpenDoorUrl from "./assets/nutcracker-source/chooser-open-door.png";
import chooserHelpframeTalkerUrl from "./assets/nutcracker-source/chooser-helpframe-talker.png";
import chooserMagicKeyUrl from "./assets/nutcracker-source/chooser-magic-key.png";
import chooserWarningNoBodyUrl from "./assets/nutcracker-source/chooser-warning-no-body.png";
import chooserWarningNoLabelUrl from "./assets/nutcracker-source/chooser-warning-no-label.png";
import chooserWarningYesBodyUrl from "./assets/nutcracker-source/chooser-warning-yes-body.png";
import chooserWarningYesLabelUrl from "./assets/nutcracker-source/chooser-warning-yes-label.png";
import chooserWarningframeTalkerUrl from "./assets/nutcracker-source/chooser-warningframe-talker.png";
import song1SourceInteractiveUrl from "./assets/nutcracker-source/song1-source-interactive.png";
import song2SourceInteractiveUrl from "./assets/nutcracker-source/song2-source-interactive.png";
import song3SourceInteractiveUrl from "./assets/nutcracker-source/song3-source-interactive.png";
import song4SourceInteractiveUrl from "./assets/nutcracker-source/song4-source-interactive.png";
import song5SourceInteractiveUrl from "./assets/nutcracker-source/song5-source-interactive.png";
import song6SourceInteractiveUrl from "./assets/nutcracker-source/song6-source-interactive.png";
import song7SourceInteractiveUrl from "./assets/nutcracker-source/song7-source-interactive.png";
import song8SourceInteractiveUrl from "./assets/nutcracker-source/song8-source-interactive.png";
import songControlButtonBodyUrl from "./assets/nutcracker-source/song-control-button-body.png";
import songCurtainCurveCxformUrl from "./assets/nutcracker-source/song-curtain-curve-cxform.png";
import songCurtainFillUrl from "./assets/nutcracker-source/song-curtain-fill.png";
import songCurtainStarsUrl from "./assets/nutcracker-source/song-curtain-stars.png";
import songHelpArtUrl from "./assets/nutcracker-source/song-help-art.png";
import songHelpframeTalkerUrl from "./assets/nutcracker-source/song-helpframe-talker.png";
import songKeyFrameTalkerUrl from "./assets/nutcracker-source/song-keyframe-talker.png";
import nutcrackerClubCertificateUrl from "./assets/nutcracker-source/nutcracker-club-certificate.png";
import songNoLabelUrl from "./assets/nutcracker-source/song-no-label.png";
import songPlayAgainButtonBodyUrl from "./assets/nutcracker-source/song-play-again-button-body.png";
import songPlayAgainLabelUrl from "./assets/nutcracker-source/song-play-again-label.png";
import songStopLabelUrl from "./assets/nutcracker-source/song-stop-label-blue.png";
import songWarningNoBodyUrl from "./assets/nutcracker-source/song-warning-no-body.png";
import songWarningNoLabelUrl from "./assets/nutcracker-source/song-warning-no-label.png";
import songWarningYesBodyUrl from "./assets/nutcracker-source/song-warning-yes-body.png";
import songWarningYesLabelUrl from "./assets/nutcracker-source/song-warning-yes-label.png";
import songWarningframeTalkerUrl from "./assets/nutcracker-source/song-warningframe-talker.png";
import songYesLabelUrl from "./assets/nutcracker-source/song-yes-label.png";
import fluteIntroGardenUrl from "./assets/source-scenes/flute-intro-garden.jpg";
import listeningRoomSourceUrl from "./assets/source-scenes/listening-room-source.png";
import mainPlayRoomCompositeUrl from "./assets/source-scenes/main-playroom-source-composite.png";
import musictionaryHelpFishUrl from "./assets/source-scenes/musictionary-help-fish.png";
import musictionaryHelpUrl from "./assets/source-scenes/musictionary-help.png";
import projectorChooseSourceUrl from "./assets/source-scenes/projector-choose-source.png";
import readerControlExitHoverBalletUrl from "./assets/source-scenes/reader-control-exit-hover-ballet.png";
import readerControlExitHoverUrl from "./assets/source-scenes/reader-control-exit-hover.png";
import readerControlNextHoverUrl from "./assets/source-scenes/reader-control-next-hover.png";
import readerControlPrevHoverUrl from "./assets/source-scenes/reader-control-prev-hover.png";
import stageMarkUrl from "./assets/stage-mark.svg";
import { createAudioService, type AudioService } from "./audio/audioService";
import {
  dictionaryInstruments,
  getDictionaryInstrument,
  getReadingActivity,
  getSuiteTrack,
  isReadingRouteId,
  suiteTracks,
  type DictionaryInstrument,
  type ReadingRouteId,
  type SuiteTrack,
} from "./data/referenceContent";
import {
  getCorrectNutcrackerTrackNumbers,
  getNutcrackerSongGameByRoute,
  getNutcrackerTrackStartSeconds,
  isCorrectNutcrackerSelection,
  isNutcrackerSongId,
  isNutcrackerTrackNumber,
  nutcrackerSongGames,
  type NutcrackerSongGame,
  type NutcrackerSongId,
  type NutcrackerTrack,
  type NutcrackerTrackNumber,
} from "./data/nutcrackerSongGames";
import {
  createMemoryDeck,
  createTreeRounds,
  getFlyingInstrumentById,
  getFlyingInstrumentSequence,
  getM07Asset,
  getMelodyNoteAudio,
  getMelodySequences,
  getTriviaQuestion,
  isMelodyDifficulty,
  memoryErrorsForPairs,
  memoryPairsForLevel,
  type MelodyDifficulty,
  type MemoryCard,
} from "./data/m07Games";
import {
  alicePuzzleIds,
  alicePuzzleIsCorrect,
  chooseOrchestraPrompt,
  childrensAlbumInstrumentLabels,
  childrensAlbumSongs,
  getNutHouseSoundMap,
  isChildrensAlbumSelectionCorrect,
  isLoopySelectionCorrect,
  loopyTrackSoundId,
  loopyTunes,
  nutHouseCorrectMirror,
  nutHouseMirrorSoundId,
  orchestraBadSoundId,
  orchestraInstrumentSoundId,
  orchestraInstruments,
  orchestraWinSoundId,
  toySoldierCorrectNotes,
  toySoldierInitialNotes,
  toySoldierSoundId,
  toySoldiersAreCorrect,
} from "./data/m08Games";
import { getRouteById, isRouteId, routes, type RouteDefinition, type RouteId } from "./routes";
import { createProgressStore, type DoorKey, type GameKey, type ProgressStoreController } from "./state/progressStore";

const nutcrackerSongSourceFrameUrls: Readonly<Record<NutcrackerSongId, string>> = {
  1: song1SourceInteractiveUrl,
  2: song2SourceInteractiveUrl,
  3: song3SourceInteractiveUrl,
  4: song4SourceInteractiveUrl,
  5: song5SourceInteractiveUrl,
  6: song6SourceInteractiveUrl,
  7: song7SourceInteractiveUrl,
  8: song8SourceInteractiveUrl,
};

type ShellState = {
  routeId: RouteId;
  routeStack: RouteId[];
  overturePhase: "intro" | "launcher";
  helpOpen: boolean;
  nutcrackerChooserWarningOpen: boolean;
  activeAudioId: string | null;
  pendingNutcrackerSongChange: NutcrackerSongId | null;
  pendingNutcrackerSongExit: NutcrackerSongId | null;
  readingPages: Record<ReadingRouteId, number>;
  activeDictionaryInstrumentId: string;
  musictionaryHelpOpen: boolean;
  musictionaryHelpFishVisible: boolean;
  activeSuiteTrackId: string | null;
  nutcrackerSelections: Record<NutcrackerSongId, NutcrackerTrackNumber[]>;
  nutcrackerFeedback: Record<NutcrackerSongId, string | null>;
  triviaQuestionIndex: number;
  triviaCorrectCount: number;
  triviaWrongCount: number;
  triviaFeedback: "correct" | "wrong" | null;
  melodyDifficulty: MelodyDifficulty;
  melodyStarted: boolean;
  melodyInputEnabled: boolean;
  melodySequenceIndex: number;
  melodyInput: number[];
  melodyFeedback: "correct" | null;
  melodyInputMistake: boolean;
  melodyDemoPlaying: boolean;
  memoryLevel: number;
  memoryDeck: readonly MemoryCard[];
  memoryRevealed: number[];
  memoryMatchedPairs: number[];
  memoryErrorsLeft: number;
  memoryFeedback: "match" | "miss" | "loss" | "level-complete" | "win" | null;
  treeVariant: 1 | 2 | 3;
  treeRoundIndex: number;
  treeCorrectCount: number;
  treePhase: "ready" | "prompting" | "choosing" | "answering" | "level-complete" | "complete";
  treeSelectedOption: number | null;
  treeFeedback: "correct" | "wrong" | "win" | null;
  flyingLevel: 1 | 2 | 3;
  flyingPhase: "choosing" | "ready" | "playing" | "paused" | "matching" | "blocked" | "complete";
  flyingInstrumentIndex: number;
  flyingCorrectCount: number;
  flyingScore: number;
  flyingColumn: 1 | 2 | 3 | 4;
  flyingRow: number;
  flyingGrid: (number | null)[];
  flyingFeedback: "match" | "blocked" | "round-complete" | "win" | null;
  childrensAlbumSong: DoorKey;
  childrensAlbumSelections: number[];
  childrensAlbumFeedback: "correct" | "wrong" | "win" | null;
  loopyTune: DoorKey;
  loopySelections: number[];
  loopyCompleted: number[];
  loopyFeedback: "correct" | "wrong" | "win" | null;
  orchestraPromptId: number | null;
  orchestraCorrectIds: number[];
  orchestraFeedback: "correct" | "wrong" | "win" | null;
  toySoldierNotes: number[];
  toyFeedback: "correct" | "wrong" | null;
  toyMarchIndex: number | null;
  toyPlaybackKind: "check" | "demo" | null;
  aliceChooserOpen: boolean;
  alicePuzzle: number;
  aliceDialValues: [number, number, number];
  aliceFeedback: "correct" | "wrong" | null;
  nutHouseRoom: number;
  nutHousePhase: "tutorial" | "prompt" | "playing" | "help" | "exit";
  nutHouseFeedback: "correct" | "wrong" | "win" | null;
};

type MainRoomHotspot = {
  readonly sourceButtonId: number;
  readonly depth: number;
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly sourcePath: string;
  readonly routeId?: RouteId;
};

type SuiteRecordPlacement = {
  readonly trackNumber: number;
  readonly sourceSpriteId: number;
  readonly sourceInstance: string;
  readonly depth: number;
  readonly x: number;
  readonly y: number;
  readonly matrix: readonly [number, number, number, number];
  readonly hitX?: number;
  readonly hitY?: number;
  readonly hitWidth?: number;
};

const mainRoomHotspots: readonly MainRoomHotspot[] = [
  { sourceButtonId: 625, depth: 5, x: 604.6, y: 131.8, label: "The NutHouse", sourcePath: "games/nuthouse/room11.swf", routeId: "nut-house" },
  { sourceButtonId: 631, depth: 7, x: 214.55, y: 293.15, label: "Children's Album Game", sourcePath: "games/childrensalbum/childrensalbum.swf", routeId: "childrens-album" },
  { sourceButtonId: 632, depth: 12, x: 332.85, y: 377.05, label: "MusiCards", sourcePath: "games/memorygame/memory.swf", routeId: "memory" },
  { sourceButtonId: 634, depth: 19, x: 357.9, y: 429.25, label: "Flying Instruments", sourcePath: "games/flyinginstruments/flyinginstruments.swf", routeId: "flying-instruments" },
  { sourceButtonId: 635, depth: 23, x: 203.55, y: 427.85, label: "Musical Encyclopedia", sourcePath: "activities/musictionary/musictionary.swf", routeId: "music-dictionary" },
  { sourceButtonId: 636, depth: 29, x: 446.55, y: 347.8, label: "Music Trivia", sourcePath: "games/trivia/trivia.swf", routeId: "trivia" },
  { sourceButtonId: 638, depth: 35, x: 562.5, y: 361.55, label: "The Funky Monkey Game", sourcePath: "games/melody/melody.swf", routeId: "melody" },
  { sourceButtonId: 639, depth: 39, x: 59.85, y: 435.45, label: "The Listening Room", sourcePath: "activities/originals/gramophone.swf", routeId: "suite" },
  { sourceButtonId: 640, depth: 50, x: 99.25, y: 143.85, label: "The Nutcracker Story", sourcePath: "activities/story/story.swf", routeId: "story" },
  { sourceButtonId: 642, depth: 58, x: 493.45, y: 169.45, label: "Find Me On The Tree", sourcePath: "games/tree/tree.swf", routeId: "tree-game" },
  { sourceButtonId: 643, depth: 65, x: 441.3, y: 246.65, label: "The Orchestra Game", sourcePath: "games/orchestragame/orchestra.swf", routeId: "orchestra" },
  { sourceButtonId: 644, depth: 87, x: 187.5, y: 130.25, label: "The Nutcracker Ballet", sourcePath: "activities/ballet/ballet.swf", routeId: "ballet-history" },
  { sourceButtonId: 646, depth: 93, x: 474.95, y: 105.7, label: "Tchaikovsky's Biography", sourcePath: "activities/biography/biography.swf", routeId: "composer-biography" },
];

const suiteRecordPlacements: readonly SuiteRecordPlacement[] = [
  { trackNumber: 1, sourceSpriteId: 63, sourceInstance: "lp1", depth: 43, x: 450.55, y: 384.2, matrix: [1.243, 0, 0, 0.562] },
  { trackNumber: 2, sourceSpriteId: 70, sourceInstance: "lp2", depth: 61, x: 559.65, y: 439.85, matrix: [1.243, 0.012, 0, 0.562] },
  { trackNumber: 3, sourceSpriteId: 72, sourceInstance: "lp3", depth: 79, x: 548.9, y: 393.1, matrix: [1.347, 0, 0, 0.272] },
  { trackNumber: 4, sourceSpriteId: 66, sourceInstance: "lp4", depth: 52, x: 327.75, y: 445.45, matrix: [1.134, 0, 0, 0.5] },
  { trackNumber: 5, sourceSpriteId: 59, sourceInstance: "lp5", depth: 32, x: 548.9, y: 333.25, matrix: [1.254, 0, 0, 0.575] },
  { trackNumber: 6, sourceSpriteId: 70, sourceInstance: "lp6", depth: 88, x: 349.3, y: 389.25, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 7, sourceSpriteId: 72, sourceInstance: "lp7", depth: 70, x: 444.95, y: 449.9, matrix: [1.41, 0, 0, 0.262] },
  { trackNumber: 8, sourceSpriteId: 70, sourceInstance: "lp8", depth: 97, x: 453.65, y: 335.85, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 9, sourceSpriteId: 76, sourceInstance: "lp9", depth: 106, x: 453.65, y: 132.85, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 10, sourceSpriteId: 76, sourceInstance: "lp10", depth: 115, x: 557.6, y: 133.25, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 11, sourceSpriteId: 76, sourceInstance: "lp11", depth: 124, x: 453.65, y: 175.65, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 12, sourceSpriteId: 76, sourceInstance: "lp12", depth: 133, x: 557.6, y: 226.05, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 13, sourceSpriteId: 76, sourceInstance: "lp13", depth: 142, x: 557.6, y: 179.45, matrix: [1.005, 0, 0, 0.478], hitX: 532, hitY: 179.45, hitWidth: 34 },
  { trackNumber: 14, sourceSpriteId: 76, sourceInstance: "lp14", depth: 151, x: 453.65, y: 225.85, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 15, sourceSpriteId: 38, sourceInstance: "lp15", depth: 1, x: 547.15, y: 173.25, matrix: [1.005, 0, 0, 0.478], hitX: 575, hitY: 179.45, hitWidth: 34 },
  { trackNumber: 16, sourceSpriteId: 76, sourceInstance: "lp16", depth: 160, x: 557.6, y: 277.65, matrix: [1.005, 0, 0, 0.478] },
];

const m08Assets = {
  ...import.meta.glob<string>("./assets/m08-source/*.png", { eager: true, query: "?url", import: "default" }),
  ...import.meta.glob<string>([
    "./assets/m08-source/audio/childrens-album/**/*.mp3",
    "./assets/m08-source/audio/embedded/loopy-*/sound-*.mp3",
    "./assets/m08-source/audio/embedded/orchestra/sound-*.mp3",
    "./assets/m08-source/audio/embedded/toy-soldiers/sound-*.mp3",
    "./assets/m08-source/audio/embedded/nut-house-*/sound-*.mp3",
  ], { eager: true, query: "?url", import: "default" }),
  ...import.meta.glob<string>("./assets/m08-source/audio/waltz/MP3Wedding3.wav", {
    eager: true,
    query: "?url",
    import: "default",
  }),
};

const aliceChooserButtonPositions = [
  { puzzle: 1, x: 436, y: 47 },
  { puzzle: 2, x: 515, y: 129 },
  { puzzle: 3, x: 542, y: 240 },
  { puzzle: 4, x: 506, y: 352 },
  { puzzle: 5, x: 431, y: 433 },
  { puzzle: 6, x: 320, y: 465 },
  { puzzle: 7, x: 209, y: 433 },
  { puzzle: 8, x: 130, y: 350 },
  { puzzle: 9, x: 98, y: 240 },
  { puzzle: 10, x: 128, y: 128 },
  { puzzle: 11, x: 210, y: 46 },
  { puzzle: 12, x: 320, y: 17 },
] as const;

type NutHouseMirrorHitRegion = {
  readonly mirror: number;
  readonly sourceSpriteId: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly shape: string;
};

const nutHouseMirrorHitRegions: Readonly<Record<number, readonly NutHouseMirrorHitRegion[]>> = {
  11: [
    { mirror: 1, sourceSpriteId: 138, x: 48, y: 34, width: 316, height: 105, shape: "ellipse(50% 46% at 50% 50%)" },
    { mirror: 2, sourceSpriteId: 144, x: 83, y: 180, width: 44, height: 43, shape: "circle(48% at 50% 50%)" },
    { mirror: 3, sourceSpriteId: 151, x: 145, y: 178, width: 77, height: 118, shape: "polygon(8% 2%,92% 2%,92% 98%,8% 98%)" },
    { mirror: 4, sourceSpriteId: 161, x: 331, y: 115, width: 111, height: 245, shape: "polygon(23% 4%,89% 0,100% 100%,0 91%)" },
    { mirror: 5, sourceSpriteId: 167, x: 70, y: 322, width: 341, height: 97, shape: "polygon(4% 2%,73% 31%,100% 98%,0 98%)" },
    { mirror: 6, sourceSpriteId: 182, x: 73, y: 239, width: 63, height: 57, shape: "circle(48% at 50% 50%)" },
    { mirror: 7, sourceSpriteId: 189, x: 246, y: 144, width: 75, height: 191, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 8, sourceSpriteId: 197, x: 464, y: 51, width: 135, height: 367, shape: "polygon(26% 4%,100% 0,82% 100%,0 92%)" },
  ],
  12: [
    { mirror: 1, sourceSpriteId: 84, x: 246, y: 79, width: 333, height: 45, shape: "polygon(0 3%,100% 3%,95% 97%,10% 97%)" },
    { mirror: 2, sourceSpriteId: 92, x: 20, y: 50, width: 124, height: 168, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 3, sourceSpriteId: 101, x: 432, y: 194, width: 96, height: 90, shape: "polygon(5% 4%,95% 4%,95% 96%,5% 96%)" },
    { mirror: 4, sourceSpriteId: 112, x: 303, y: 154, width: 72, height: 160, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 5, sourceSpriteId: 123, x: 199, y: 376, width: 396, height: 47, shape: "polygon(6% 4%,100% 4%,94% 96%,0 96%)" },
    { mirror: 6, sourceSpriteId: 132, x: 345, y: 319, width: 207, height: 34, shape: "polygon(8% 3%,100% 3%,91% 97%,0 97%)" },
    { mirror: 7, sourceSpriteId: 143, x: 75, y: 222, width: 123, height: 165, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 8, sourceSpriteId: 151, x: 209, y: 142, width: 83, height: 184, shape: "ellipse(48% 50% at 50% 50%)" },
  ],
  13: [
    { mirror: 1, sourceSpriteId: 83, x: 500, y: 95, width: 101, height: 266, shape: "polygon(2% 7%,82% 0,100% 100%,20% 91%)" },
    { mirror: 2, sourceSpriteId: 90, x: 279, y: 165, width: 60, height: 179, shape: "polygon(0 0,100% 0,83% 100%,17% 100%)" },
    { mirror: 3, sourceSpriteId: 99, x: 322, y: 163, width: 137, height: 116, shape: "polygon(0 0,100% 0,100% 100%,0 100%)" },
    { mirror: 4, sourceSpriteId: 107, x: 41, y: 79, width: 133, height: 139, shape: "polygon(0 0,100% 34%,100% 100%,0 72%)" },
    { mirror: 5, sourceSpriteId: 117, x: 40, y: 303, width: 133, height: 131, shape: "polygon(0 0,100% 0,100% 67%,0 100%)" },
    { mirror: 6, sourceSpriteId: 125, x: 213, y: 165, width: 64, height: 179, shape: "polygon(0 0,100% 0,83% 100%,17% 100%)" },
    { mirror: 7, sourceSpriteId: 133, x: 41, y: 186, width: 133, height: 117, shape: "polygon(0 0,100% 0,100% 100%,0 100%)" },
    { mirror: 8, sourceSpriteId: 143, x: 344, y: 247, width: 96, height: 98, shape: "circle(48% at 50% 50%)" },
  ],
  14: [
    { mirror: 1, sourceSpriteId: 84, x: 287, y: 145, width: 68, height: 147, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 2, sourceSpriteId: 92, x: 404, y: 109, width: 207, height: 48, shape: "polygon(0 2%,100% 2%,96% 98%,12% 98%)" },
    { mirror: 3, sourceSpriteId: 101, x: 30, y: 124, width: 123, height: 252, shape: "polygon(0 0,100% 15%,100% 85%,0 100%)" },
    { mirror: 4, sourceSpriteId: 156, x: 360, y: 252, width: 96, height: 96, shape: "circle(48% at 50% 50%)" },
    { mirror: 5, sourceSpriteId: 117, x: 339, y: 348, width: 261, height: 84, shape: "polygon(0 0,100% 0,94% 100%,9% 100%)" },
    { mirror: 6, sourceSpriteId: 124, x: 499, y: 212, width: 109, height: 94, shape: "circle(48% at 50% 50%)" },
    { mirror: 7, sourceSpriteId: 134, x: 225, y: 20, width: 384, height: 78, shape: "polygon(0 0,100% 0,94% 100%,18% 100%)" },
    { mirror: 8, sourceSpriteId: 144, x: 172, y: 85, width: 99, height: 325, shape: "polygon(18% 0,100% 3%,83% 100%,0 97%)" },
  ],
  15: [
    { mirror: 1, sourceSpriteId: 90, x: 482, y: 291, width: 47, height: 76, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 2, sourceSpriteId: 98, x: 149, y: 52, width: 344, height: 82, shape: "polygon(0 0,100% 0,87% 100%,14% 100%)" },
    { mirror: 3, sourceSpriteId: 106, x: 548, y: 302, width: 53, height: 108, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 4, sourceSpriteId: 117, x: 482, y: 82, width: 124, height: 137, shape: "polygon(0 0,100% 13%,100% 100%,0 89%)" },
    { mirror: 5, sourceSpriteId: 124, x: 229, y: 211, width: 90, height: 91, shape: "circle(48% at 50% 50%)" },
    { mirror: 6, sourceSpriteId: 132, x: 483, y: 188, width: 124, height: 105, shape: "circle(48% at 50% 50%)" },
    { mirror: 7, sourceSpriteId: 140, x: 30, y: 115, width: 165, height: 275, shape: "polygon(0 0,100% 12%,100% 88%,0 100%)" },
    { mirror: 8, sourceSpriteId: 148, x: 341, y: 211, width: 83, height: 93, shape: "circle(48% at 50% 50%)" },
  ],
  16: [
    { mirror: 1, sourceSpriteId: 86, x: 510, y: 79, width: 94, height: 146, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 2, sourceSpriteId: 94, x: 285, y: 145, width: 46, height: 79, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 3, sourceSpriteId: 103, x: 360, y: 116, width: 128, height: 262, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 4, sourceSpriteId: 112, x: 277, y: 248, width: 68, height: 107, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 5, sourceSpriteId: 127, x: 20, y: 163, width: 89, height: 136, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 6, sourceSpriteId: 135, x: 130, y: 138, width: 108, height: 93, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 7, sourceSpriteId: 145, x: 109, y: 254, width: 145, height: 93, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 8, sourceSpriteId: 153, x: 500, y: 263, width: 103, height: 139, shape: "ellipse(48% 50% at 50% 50%)" },
  ],
  17: [
    { mirror: 1, sourceSpriteId: 83, x: 124, y: 334, width: 367, height: 91, shape: "ellipse(50% 48% at 50% 50%)" },
    { mirror: 2, sourceSpriteId: 91, x: 222, y: 166, width: 44, height: 42, shape: "polygon(3% 3%,97% 3%,97% 97%,3% 97%)" },
    { mirror: 3, sourceSpriteId: 99, x: 285, y: 165, width: 41, height: 42, shape: "polygon(3% 3%,97% 3%,97% 97%,3% 97%)" },
    { mirror: 4, sourceSpriteId: 108, x: 434, y: 58, width: 164, height: 307, shape: "polygon(0 0,100% 10%,100% 90%,0 100%)" },
    { mirror: 5, sourceSpriteId: 116, x: 342, y: 167, width: 43, height: 41, shape: "polygon(3% 3%,97% 3%,97% 97%,3% 97%)" },
    { mirror: 6, sourceSpriteId: 126, x: 272, y: 82, width: 67, height: 60, shape: "circle(48% at 50% 50%)" },
    { mirror: 7, sourceSpriteId: 136, x: 198, y: 252, width: 219, height: 52, shape: "ellipse(50% 48% at 50% 50%)" },
    { mirror: 8, sourceSpriteId: 147, x: 30, y: 58, width: 145, height: 307, shape: "polygon(0 10%,100% 0,100% 100%,0 90%)" },
  ],
  18: [
    { mirror: 1, sourceSpriteId: 82, x: 24, y: 153, width: 74, height: 215, shape: "polygon(0 0,100% 15%,100% 85%,0 100%)" },
    { mirror: 2, sourceSpriteId: 93, x: 83, y: 34, width: 374, height: 47, shape: "ellipse(50% 48% at 50% 50%)" },
    { mirror: 3, sourceSpriteId: 101, x: 331, y: 170, width: 65, height: 151, shape: "polygon(9% 0,100% 7%,91% 100%,0 92%)" },
    { mirror: 4, sourceSpriteId: 110, x: 133, y: 183, width: 156, height: 131, shape: "polygon(0 0,100% 10%,100% 90%,0 100%)" },
    { mirror: 5, sourceSpriteId: 117, x: 404, y: 161, width: 98, height: 174, shape: "polygon(4% 0,100% 7%,96% 100%,0 93%)" },
    { mirror: 6, sourceSpriteId: 127, x: 518, y: 94, width: 90, height: 162, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 7, sourceSpriteId: 135, x: 515, y: 280, width: 91, height: 124, shape: "ellipse(48% 50% at 50% 50%)" },
    { mirror: 8, sourceSpriteId: 143, x: 90, y: 98, width: 279, height: 56, shape: "ellipse(50% 48% at 50% 50%)" },
  ],
};

function getM08Asset(path: string): string {
  return m08Assets[`./assets/m08-source${path}`] ?? "";
}

export type AppShellOptions = {
  progress?: ProgressStoreController;
  audio?: AudioService;
  previewAudioPath?: string;
  printCertificate?: () => void;
  random?: () => number;
  showDeveloperPanel?: boolean;
  openExternal?: (url: string) => void;
  exitApp?: () => void;
};

const defaultPreviewAudioPath = suiteTracks.find((track) => track.audioPath)?.audioPath ?? "";
const sourceReaderPreviousButtonIds: Record<ReadingRouteId, readonly (number | null)[]> = {
  story: [null, 34, 39, 44],
  "composer-biography": [null, 35, 43, 50],
  "ballet-history": [null, 36, 42, 47, 53],
};
const sourceReaderNextButtonIds: Record<ReadingRouteId, readonly (number | null)[]> = {
  story: [14, 14, 14, null],
  "composer-biography": [14, 14, 14, null],
  "ballet-history": [14, 14, 14, 48, null],
};
const sourceReaderExitButtonIds: Record<ReadingRouteId, number> = {
  story: 28,
  "composer-biography": 31,
  "ballet-history": 32,
};

function isDeveloperPanelRequested(): boolean {
  if (import.meta.env.VITE_DEV_PANEL === "1") return true;
  try {
    return new URLSearchParams(window.location.search).get("devpanel") === "1";
  } catch {
    return false;
  }
}

/** Height of the band reserved under the stage for the external certificate action, so it never overlaps the 640 x 480 source viewport. */
const releaseCertificateBandHeight = 56;

function fitStageToWindow(mount: HTMLElement): () => void {
  const apply = () => {
    const reservedHeight = mount.querySelector(".release-certificate-actions") ? releaseCertificateBandHeight : 0;
    const scale = Math.min(window.innerWidth / 640, (window.innerHeight - reservedHeight) / 480);
    mount.style.setProperty("--stage-scale", String(Math.max(scale, 0.25)));
  };
  apply();
  window.addEventListener("resize", apply);
  return apply;
}

export function createAppShell(mount: HTMLElement, options: AppShellOptions = {}): void {
  const progress = options.progress ?? createProgressStore();
  const audio = options.audio ?? createAudioService();
  const previewAudioPath = options.previewAudioPath ?? defaultPreviewAudioPath;
  const printCertificate = options.printCertificate ?? (() => window.print());
  const random = options.random ?? Math.random;
  const showDeveloperPanel = options.showDeveloperPanel ?? isDeveloperPanelRequested();
  const openExternal = options.openExternal ?? ((url: string) => {
    if ("__TAURI_INTERNALS__" in window) {
      void import("@tauri-apps/plugin-opener").then(({ openUrl }) => openUrl(url));
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  });
  const exitApp = options.exitApp ?? (() => {
    if ("__TAURI_INTERNALS__" in window) {
      void import("@tauri-apps/api/window").then(({ getCurrentWindow }) => getCurrentWindow().close());
      return;
    }
    window.close();
  });
  const shellState: ShellState = {
    routeId: "overture",
    routeStack: [],
    overturePhase: "intro",
    helpOpen: false,
    nutcrackerChooserWarningOpen: false,
    activeAudioId: null,
    pendingNutcrackerSongChange: null,
    pendingNutcrackerSongExit: null,
    readingPages: {
      story: 0,
      "composer-biography": 0,
      "ballet-history": 0,
    },
    activeDictionaryInstrumentId: dictionaryInstruments[0].id,
    musictionaryHelpOpen: false,
    musictionaryHelpFishVisible: false,
    activeSuiteTrackId: null,
    nutcrackerSelections: createNutcrackerSelectionState(),
    nutcrackerFeedback: createNutcrackerFeedbackState(),
    triviaQuestionIndex: 0,
    triviaCorrectCount: 0,
    triviaWrongCount: 0,
    triviaFeedback: null,
    melodyDifficulty: "beg",
    melodyStarted: false,
    melodyInputEnabled: false,
    melodySequenceIndex: 0,
    melodyInput: [],
    melodyFeedback: null,
    melodyInputMistake: false,
    melodyDemoPlaying: false,
    memoryLevel: 1,
    memoryDeck: createMemoryDeck(memoryPairsForLevel(1)),
    memoryRevealed: [],
    memoryMatchedPairs: [],
    memoryErrorsLeft: memoryErrorsForPairs(memoryPairsForLevel(1)),
    memoryFeedback: null,
    treeVariant: 1,
    treeRoundIndex: 0,
    treeCorrectCount: 0,
    treePhase: "ready",
    treeSelectedOption: null,
    treeFeedback: null,
    flyingLevel: 1,
    flyingPhase: "choosing",
    flyingInstrumentIndex: 0,
    flyingCorrectCount: 0,
    flyingScore: 0,
    flyingColumn: 2,
    flyingRow: 0,
    flyingGrid: Array<number | null>(28).fill(null),
    flyingFeedback: null,
    childrensAlbumSong: 1,
    childrensAlbumSelections: [],
    childrensAlbumFeedback: null,
    loopyTune: 1,
    loopySelections: [],
    loopyCompleted: [],
    loopyFeedback: null,
    orchestraPromptId: null,
    orchestraCorrectIds: [],
    orchestraFeedback: null,
    toySoldierNotes: [...toySoldierInitialNotes],
    toyFeedback: null,
    toyMarchIndex: null,
    toyPlaybackKind: null,
    aliceChooserOpen: true,
    alicePuzzle: 1,
    aliceDialValues: [4, 4, 4],
    aliceFeedback: null,
    nutHouseRoom: 11 + Math.min(progress.getSnapshot().nutHouse.openDoor, 7),
    nutHousePhase: progress.getSnapshot().nutHouse.openDoor === 0 ? "tutorial" : "prompt",
    nutHouseFeedback: null,
  };
  const melodyTimerIds = new Set<number>();
  const treeTimerIds = new Set<number>();
  const flyingTimerIds = new Set<number>();
  const toyTimerIds = new Set<number>();
  let suppressNextNutHouseFocusPreview = false;
  let readerExitTimerId: number | null = null;

  const stopMelodyPlayback = () => {
    melodyTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    melodyTimerIds.clear();
    shellState.melodyDemoPlaying = false;
  };

  const stopTreePlayback = () => {
    treeTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    treeTimerIds.clear();
  };

  const stopFlyingPlayback = () => {
    flyingTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    flyingTimerIds.clear();
  };

  const stopToyMarchPlayback = () => {
    toyTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    toyTimerIds.clear();
    shellState.toyMarchIndex = null;
    shellState.toyPlaybackKind = null;
  };

  let refitStage: (() => void) | null = null;

  const render = (focusSelector?: string, fallbackFocusSelector?: string) => {
    const route = getRouteById(shellState.routeId);
    const progressSnapshot = progress.getSnapshot();
    const audioState = audio.getState();
    const sourceFrameRoute = isSourceFrameRoute(route.id);
    mount.innerHTML = `
      <section class="app-shell${showDeveloperPanel ? "" : " release-shell"}" aria-label="Desktop app shell">
        <div class="desktop-frame">
          <section class="game-viewport${sourceFrameRoute ? " source-frame-viewport" : ""}" aria-label="Fixed 640 by 480 game viewport">
            ${
              sourceFrameRoute
                ? ""
                : `<header class="scene-header">
                    <div>
                      <p class="kicker">Private local remake</p>
                      <p class="scene-title">${route.title}</p>
                    </div>
                    <p class="status-label">${progressSnapshot.completedGameCount} of 9 keys</p>
                  </header>`
            }
            ${renderScene(route, progressSnapshot, shellState)}
            ${
              sourceFrameRoute
                ? ""
                : `<footer class="scene-footer">
                  <div class="scene-actions">
                    ${renderPrimaryActions(route)}
                  </div>
                  <p class="status-label">640 x 480</p>
                </footer>`
            }
            ${shellState.helpOpen ? renderHelp(route) : ""}
            ${shellState.nutcrackerChooserWarningOpen && route.id === "nutcracker-chooser" ? renderChooserWarningFrame() : ""}
          </section>
          ${
            showDeveloperPanel
              ? `<nav class="route-panel" aria-label="Recovered game routes">
            <h2>Route Map</h2>
            <ol class="route-list">
              ${routes
                .map(
                  (item) => `
                    <li>
                      <button
                        class="route-button"
                        type="button"
                        data-route="${item.id}"
                        aria-current="${item.id === shellState.routeId ? "page" : "false"}"
                      >
                        ${item.title}
                      </button>
                    </li>
                  `,
                )
                .join("")}
            </ol>
            <section class="progress-panel" aria-label="Progress debug controls">
              <h2>Progress</h2>
              <div class="meter-row"><span>Game keys</span><strong>${progressSnapshot.completedGameCount}/9</strong></div>
              <div class="meter-row"><span>Song doors</span><strong>${progressSnapshot.openedNutDoorCount}/8</strong></div>
              <div class="meter-row"><span>Album doors</span><strong>${progressSnapshot.openedChildrensDoorCount}/8</strong></div>
              <div class="meter-row"><span>Nut House</span><strong>${progressSnapshot.nutHouse.openDoor}</strong></div>
              <div class="debug-grid">
                <button class="panel-button" type="button" data-progress="key" data-key="1">Key 1</button>
                <button class="panel-button" type="button" data-progress="nut-door" data-door="1">Door 1</button>
                <button class="panel-button" type="button" data-progress="children-door" data-door="1">Album 1</button>
                <button class="panel-button" type="button" data-progress="nut-house" data-door="1">Room 1</button>
              </div>
              ${
                progressSnapshot.gameKeys[1]
                  ? renderNutcrackerCertificatePrintAction("panel-button certificate-print-button")
                  : ""
              }
              <button class="panel-button danger" type="button" data-action="reset-progress">Reset progress</button>
            </section>
            <section class="progress-panel" aria-label="Audio controls">
              <h2>Audio</h2>
              <div class="meter-row"><span>Active</span><strong>${audioState.activeTrackCount}</strong></div>
              <label class="volume-control">
                <span>Volume</span>
                <input type="range" min="0" max="100" value="${Math.round(audioState.volume * 100)}" data-action="volume" />
              </label>
              <div class="debug-grid two-up">
                <button class="panel-button" type="button" data-action="audio-preview">${shellState.activeAudioId ? "Restart" : "Preview"}</button>
                <button class="panel-button" type="button" data-action="audio-stop">Stop</button>
                <button class="panel-button" type="button" data-action="mute">${audioState.muted ? "Unmute" : "Mute"}</button>
              </div>
              <p class="diagnostic">${audioState.diagnostics.slice(-1)[0]?.message ?? "Audio diagnostics will appear here."}</p>
            </section>
            <p class="build-note">Local desktop package only. Recovered media stays bundled locally under the app shell.</p>
          </nav>`
              : ""
          }
        </div>
        ${
          !showDeveloperPanel && progressSnapshot.gameKeys[1]
            ? `<section class="release-certificate-actions" aria-label="Nutcracker certificate action">
                ${renderNutcrackerCertificatePrintAction("certificate-print-button")}
              </section>`
            : ""
        }
        ${progressSnapshot.gameKeys[1] ? renderNutcrackerCertificatePrintSurface() : ""}
      </section>
    `;
    refitStage?.();

    mount.querySelectorAll<HTMLButtonElement>("[data-route]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextRoute = button.dataset.route;
        if (nextRoute && isRouteId(nextRoute)) {
          navigate(nextRoute);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-scene-route]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextRoute = button.dataset.sceneRoute;
        if (nextRoute && isRouteId(nextRoute)) {
          navigate(nextRoute);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-progress]").forEach((button) => {
      button.addEventListener("click", () => {
        updateProgress(button, progress);
        render();
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const activeSong = getNutcrackerSongGameByRoute(shellState.routeId);
        if (
          activeSong &&
          isNutcrackerSongInteractionBlocked(activeSong.id) &&
          button.dataset.modalDismiss !== "true"
        ) {
          return;
        }
        handleAction(button.dataset.action);
      });
    });

    mount.querySelector<HTMLInputElement>('[data-action="volume"]')?.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      audio.setVolume(Number(target.value) / 100);
      render();
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-reading-audio]").forEach((button) => {
      button.addEventListener("click", () => {
        const audioPath = button.dataset.readingAudio;
        if (audioPath) {
          playSceneAudio(audioPath, false);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-reading-page]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const routeId = button.dataset.readingRoute;
        const pageIndex = Number(button.dataset.readingPage);
        if (routeId && isRouteId(routeId) && isReadingRouteId(routeId) && Number.isInteger(pageIndex)) {
          const activity = getReadingActivity(routeId);
          shellState.readingPages[routeId] = Math.min(Math.max(pageIndex, 0), activity.pages.length - 1);
          if (event.detail === 0) {
            render(
              `[data-reading-direction="${button.dataset.readingDirection ?? "next"}"]`,
              "[data-source-reader-heading]",
            );
          } else {
            render();
          }
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-dictionary-entry]").forEach((button) => {
      button.addEventListener("click", () => {
        const instrumentId = button.dataset.dictionaryEntry;
        if (instrumentId) {
          const instrument = getDictionaryInstrument(instrumentId);
          shellState.activeDictionaryInstrumentId = instrument.id;
          audio.stopSceneAudio();
          shellState.activeAudioId = audio.playOneShot(instrument.audioPath).id;
          render();
        }
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-dictionary-next]")?.addEventListener("click", (event) => {
      const activeIndex = dictionaryInstruments.findIndex((instrument) => instrument.id === shellState.activeDictionaryInstrumentId);
      const nextIndex = (Math.max(activeIndex, 0) + 1) % dictionaryInstruments.length;
      const nextInstrument = dictionaryInstruments[nextIndex];
      shellState.activeDictionaryInstrumentId = nextInstrument.id;
      audio.stopSceneAudio();
      shellState.activeAudioId = audio.playOneShot(nextInstrument.audioPath).id;
      if (event.detail === 0) {
        render("[data-dictionary-next]", "[data-source-musictionary-heading]");
      } else {
        render();
      }
    });

    mount.querySelector<HTMLButtonElement>("[data-dictionary-help]")?.addEventListener("click", (event) => {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.musictionaryHelpOpen = true;
      shellState.musictionaryHelpFishVisible = false;
      if (event.detail === 0) {
        render("[data-dictionary-help-fish]", "[data-source-musictionary-heading]");
      } else {
        render();
      }
    });

    mount.querySelector<HTMLButtonElement>("[data-dictionary-help-fish]")?.addEventListener("click", (event) => {
      shellState.musictionaryHelpFishVisible = !shellState.musictionaryHelpFishVisible;
      if (event.detail === 0) {
        render("[data-dictionary-help-fish]", "[data-source-musictionary-heading]");
      } else {
        render();
      }
    });

    mount.querySelector<HTMLButtonElement>("[data-dictionary-help-close]")?.addEventListener("click", (event) => {
      shellState.musictionaryHelpOpen = false;
      shellState.musictionaryHelpFishVisible = false;
      if (event.detail === 0) {
        render("[data-dictionary-help]", "[data-source-musictionary-heading]");
      } else {
        render();
      }
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-suite-track]").forEach((button) => {
      button.addEventListener("click", () => {
        const trackId = button.dataset.suiteTrack;
        if (trackId) {
          selectSuiteTrack(trackId);
        }
      });
      button.addEventListener("dragstart", (event) => {
        const trackId = button.dataset.suiteTrack;
        if (trackId) {
          event.dataTransfer?.setData("text/plain", trackId);
          event.dataTransfer?.setData("application/x-listening-room-record", trackId);
          event.dataTransfer?.setDragImage(button, 12, 12);
        }
      });
    });

    mount.querySelector<HTMLElement>("[data-suite-drop]")?.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    mount.querySelector<HTMLElement>("[data-suite-drop]")?.addEventListener("drop", (event) => {
      event.preventDefault();
      const trackId =
        event.dataTransfer?.getData("application/x-listening-room-record") ||
        event.dataTransfer?.getData("text/plain") ||
        "";
      if (suiteTracks.some((track) => track.id === trackId)) {
        selectSuiteTrack(trackId);
      }
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-nutcracker-door]").forEach((button) => {
      button.addEventListener("click", () => {
        const songId = Number(button.dataset.nutcrackerDoor);
        if (isNutcrackerSongId(songId)) {
          navigate(`song-${songId}`);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-nutcracker-preview]").forEach((button) => {
      button.addEventListener("click", () => {
        const songId = Number(button.dataset.nutcrackerPreview);
        if (isNutcrackerSongId(songId)) {
          const song = nutcrackerSongGames.find((item) => item.id === songId);
          if (song) {
            playNutcrackerSongPreview(song);
          }
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-song-track]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const songId = Number(button.dataset.songId);
        const trackNumber = Number(button.dataset.songTrack);
        if (isNutcrackerSongId(songId) && isNutcrackerTrackNumber(trackNumber)) {
          if (isNutcrackerSongInteractionBlocked(songId)) {
            return;
          }
          const song = nutcrackerSongGames.find((item) => item.id === songId);
          const track = song?.tracks.find((item) => item.number === trackNumber);
          if (!song || !track) {
            return;
          }
          if (event.detail === 0) {
            toggleNutcrackerTrack(shellState, songId, trackNumber);
            checkNutcrackerSelectionIfReady(song, shellState, progress);
            render();
            return;
          }
          playNutcrackerTrackPreview(track);
        }
      });
      button.addEventListener("dblclick", () => {
        const songId = Number(button.dataset.songId);
        const trackNumber = Number(button.dataset.songTrack);
        if (isNutcrackerSongId(songId) && isNutcrackerTrackNumber(trackNumber)) {
          if (isNutcrackerSongInteractionBlocked(songId)) {
            return;
          }
          const song = nutcrackerSongGames.find((item) => item.id === songId);
          if (!song) {
            return;
          }
          toggleNutcrackerTrack(shellState, songId, trackNumber);
          checkNutcrackerSelectionIfReady(song, shellState, progress);
          render();
        }
      });
      button.addEventListener("dragstart", (event) => {
        const songId = Number(button.dataset.songId);
        const trackNumber = Number(button.dataset.songTrack);
        if (isNutcrackerSongId(songId) && isNutcrackerTrackNumber(trackNumber)) {
          event.dataTransfer?.setData("text/plain", `${songId}:${trackNumber}`);
          event.dataTransfer?.setData("application/x-nutcracker-track", `${songId}:${trackNumber}`);
          event.dataTransfer?.setDragImage(button, 12, 12);
        }
      });
    });

    mount.querySelectorAll<HTMLElement>("[data-source-help]").forEach((sourceHelpElement) => {
      const helpTarget = sourceHelpElement.matches("button")
        ? sourceHelpElement
        : sourceHelpElement.querySelector<HTMLButtonElement>("button");
      if (!helpTarget) {
        return;
      }
      helpTarget.addEventListener("pointerenter", (event) => {
        showSourceFlyingHelp(sourceHelpElement, event);
      });
      helpTarget.addEventListener("pointermove", (event) => {
        showSourceFlyingHelp(sourceHelpElement, event);
      });
      helpTarget.addEventListener("pointerleave", () => {
        hideSourceFlyingHelp();
      });
      helpTarget.addEventListener("focus", () => {
        showSourceFlyingHelp(sourceHelpElement);
      });
      helpTarget.addEventListener("blur", () => {
        hideSourceFlyingHelp();
      });
    });

    mount.querySelectorAll<HTMLElement>("[data-song-drop-stage]").forEach((stage) => {
      stage.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
      stage.addEventListener("drop", (event) => {
        event.preventDefault();
        const payload =
          event.dataTransfer?.getData("application/x-nutcracker-track") || event.dataTransfer?.getData("text/plain") || "";
        const [songIdRaw, trackNumberRaw] = payload.split(":");
        const songId = Number(songIdRaw);
        const trackNumber = Number(trackNumberRaw);
        if (isNutcrackerSongId(songId) && isNutcrackerTrackNumber(trackNumber)) {
          if (isNutcrackerSongInteractionBlocked(songId)) {
            return;
          }
          const song = nutcrackerSongGames.find((item) => item.id === songId);
          if (!song || song.routeId !== shellState.routeId) {
            return;
          }
          addNutcrackerTrack(shellState, songId, trackNumber);
          checkNutcrackerSelectionIfReady(song, shellState, progress);
          render();
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-song-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const songId = Number(button.dataset.songId);
        if (isNutcrackerSongId(songId)) {
          const songAction = button.dataset.songAction;
          if (isNutcrackerSongInteractionBlocked(songId) && !isNutcrackerSongModalAction(songAction)) {
            return;
          }
          handleSongAction(songId, songAction);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-trivia-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        if (shellState.triviaFeedback) return;
        const option = Number(button.dataset.triviaAnswer);
        const question = getTriviaQuestion(shellState.triviaQuestionIndex);
        if (option === question.correctOption) {
          shellState.triviaCorrectCount += 1;
          shellState.triviaFeedback = "correct";
          audio.playOneShot(getM07Asset("/audio/trivia/correct.mp3"));
          if (shellState.triviaCorrectCount >= 10) progress.markGameKey(9);
        } else {
          shellState.triviaWrongCount += 1;
          shellState.triviaFeedback = "wrong";
          audio.playOneShot(getM07Asset("/audio/trivia/wrong.mp3"));
        }
        render("[data-trivia-next]", "[data-source-trivia-question]");
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-trivia-next]")?.addEventListener("click", () => {
      if (shellState.triviaFeedback === "correct") shellState.triviaQuestionIndex += 1;
      shellState.triviaFeedback = null;
      render("[data-trivia-answer]", "[data-source-trivia-question]");
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-melody-difficulty]").forEach((button) => {
      button.addEventListener("click", () => {
        const difficulty = button.dataset.melodyDifficulty;
        if (!difficulty || !isMelodyDifficulty(difficulty)) return;
        shellState.melodyDifficulty = difficulty;
        shellState.melodyStarted = true;
        shellState.melodyInputEnabled = false;
        shellState.melodySequenceIndex = 0;
        shellState.melodyInput = [];
        shellState.melodyFeedback = null;
        shellState.melodyInputMistake = false;
        stopMelodyPlayback();
        startMelodyDemonstration();
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-melody-start]")?.addEventListener("click", () => {
      shellState.melodyInputEnabled = true;
      render("[data-melody-note]", "[data-source-melody-keyboard]");
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-melody-note]").forEach((button) => {
      button.addEventListener("click", () => {
        if (shellState.melodyFeedback || shellState.melodyDemoPlaying || !shellState.melodyInputEnabled) return;
        const note = Number(button.dataset.melodyNote);
        const sequences = getMelodySequences(shellState.melodyDifficulty);
        const sequence = sequences[shellState.melodySequenceIndex % sequences.length];
        if (!sequence || !Number.isInteger(note) || note < 1 || note > 17) return;
        audio.playOneShot(getMelodyNoteAudio(note, "m"));
        const expectedToken = sequence.tokens[shellState.melodyInput.length];
        if (expectedToken?.note === note) {
          shellState.melodyInput.push(note);
          shellState.melodyInputMistake = false;
        } else {
          shellState.melodyInputMistake = true;
        }
        if (shellState.melodyInput.length >= sequence.tokens.length) {
          shellState.melodyFeedback = "correct";
          if (shellState.melodySequenceIndex + 1 === 3) progress.markGameKey(5);
          shellState.melodyInputEnabled = false;
          shellState.melodyInput = [];
        }
        render(
          shellState.melodyFeedback ? "[data-melody-next]" : `[data-melody-note="${note}"]`,
          "[data-source-melody-keyboard]",
        );
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-melody-next]")?.addEventListener("click", () => {
      const sequences = getMelodySequences(shellState.melodyDifficulty);
      if (shellState.melodyFeedback === "correct" && shellState.melodySequenceIndex >= sequences.length - 1) {
        shellState.melodySequenceIndex = 0;
        shellState.melodyInput = [];
        shellState.melodyFeedback = null;
        shellState.melodyInputMistake = false;
        shellState.melodyInputEnabled = false;
        shellState.melodyStarted = false;
        render("[data-melody-difficulty]", "[data-source-melody-levels]");
        return;
      }
      if (shellState.melodyFeedback === "correct") shellState.melodySequenceIndex += 1;
      shellState.melodyFeedback = null;
      shellState.melodyInputMistake = false;
      shellState.melodyInputEnabled = false;
      startMelodyDemonstration();
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-memory-card]").forEach((button) => {
      button.addEventListener("click", () => {
        const cardId = Number(button.dataset.memoryCard);
        const card = shellState.memoryDeck.find((candidate) => candidate.id === cardId);
        if (
          !card ||
          shellState.memoryFeedback === "loss" ||
          shellState.memoryFeedback === "level-complete" ||
          shellState.memoryFeedback === "win" ||
          shellState.memoryMatchedPairs.includes(card.pairId) ||
          shellState.memoryRevealed.includes(cardId)
        ) return;
        audio.playOneShot(card.soundUrl);
        shellState.memoryRevealed.push(cardId);
        if (shellState.memoryRevealed.length === 2) {
          const [firstId, secondId] = shellState.memoryRevealed;
          const first = shellState.memoryDeck.find((candidate) => candidate.id === firstId);
          const second = shellState.memoryDeck.find((candidate) => candidate.id === secondId);
          if (first && second && first.pairId === second.pairId) {
            shellState.memoryMatchedPairs.push(first.pairId);
            shellState.memoryFeedback = "match";
          } else {
            shellState.memoryErrorsLeft = Math.max(shellState.memoryErrorsLeft - 1, 0);
            shellState.memoryFeedback = shellState.memoryErrorsLeft === 0 ? "loss" : "miss";
          }
          shellState.memoryRevealed = [];
          const pairCount = memoryPairsForLevel(shellState.memoryLevel);
          if (shellState.memoryMatchedPairs.length === pairCount) {
            shellState.memoryFeedback = pairCount === 18 ? "win" : "level-complete";
            if (pairCount === 18) progress.markGameKey(2);
          }
        }
        render("[data-memory-card]", "[data-source-memory-board]");
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-memory-next]")?.addEventListener("click", () => {
      shellState.memoryLevel = Math.min(shellState.memoryLevel + 1, 14);
      const pairs = memoryPairsForLevel(shellState.memoryLevel);
      shellState.memoryDeck = createMemoryDeck(pairs);
      shellState.memoryRevealed = [];
      shellState.memoryMatchedPairs = [];
      shellState.memoryErrorsLeft = memoryErrorsForPairs(pairs);
      shellState.memoryFeedback = null;
      render("[data-memory-card]", "[data-source-memory-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-memory-reset]")?.addEventListener("click", () => {
      if (shellState.memoryFeedback === "win") shellState.memoryLevel = 1;
      const pairs = memoryPairsForLevel(shellState.memoryLevel);
      shellState.memoryDeck = createMemoryDeck(pairs);
      shellState.memoryRevealed = [];
      shellState.memoryMatchedPairs = [];
      shellState.memoryErrorsLeft = memoryErrorsForPairs(pairs);
      shellState.memoryFeedback = null;
      render("[data-memory-card]", "[data-source-memory-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-tree-prompt]")?.addEventListener("click", () => {
      if (shellState.treePhase !== "ready") return;
      startTreePrompt();
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-tree-option]").forEach((button) => {
      button.addEventListener("click", () => {
        const option = Number(button.dataset.treeOption);
        const roundIndex = Number(button.dataset.treeRound);
        const round = createTreeRounds(shellState.treeVariant)[shellState.treeRoundIndex];
        if (
          shellState.treePhase !== "choosing" ||
          !round ||
          roundIndex !== shellState.treeRoundIndex ||
          option < 1 ||
          option > 4
        ) return;
        stopTreePlayback();
        audio.stopSceneAudio();
        shellState.activeAudioId = audio.playOneShot(round.optionAudioUrls[option - 1]).id;
        shellState.treePhase = "answering";
        shellState.treeSelectedOption = option;
        const correct = option === round.correctOption;
        if (correct) {
          shellState.treeCorrectCount += 1;
          shellState.treeRoundIndex += 1;
          shellState.treeFeedback = shellState.treeRoundIndex >= 3 ? "win" : "correct";
        } else {
          shellState.treeFeedback = "wrong";
        }
        render("[data-tree-prompt]", "[data-source-tree-scene]");
        const timerId = window.setTimeout(() => {
          treeTimerIds.delete(timerId);
          if (shellState.routeId !== "tree-game" || shellState.treePhase !== "answering") return;
          shellState.activeAudioId = null;
          shellState.treeSelectedOption = null;
          if (!correct) {
            shellState.treePhase = "choosing";
            shellState.treeFeedback = null;
            render(
              `[data-tree-round="${shellState.treeRoundIndex}"][data-tree-option="${option}"]`,
              "[data-source-tree-scene]",
            );
            return;
          }
          if (shellState.treeRoundIndex >= 3) {
            shellState.treePhase = "level-complete";
            render("[data-tree-next-level]", "[data-source-tree-scene]");
            return;
          }
          startTreePrompt();
        }, round.optionDurationMs[option - 1]);
        treeTimerIds.add(timerId);
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-tree-next-level]")?.addEventListener("click", () => {
      if (shellState.treePhase !== "level-complete") return;
      stopTreePlayback();
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      if (shellState.treeVariant < 3) {
        shellState.treeVariant = (shellState.treeVariant + 1) as 1 | 2 | 3;
        shellState.treeRoundIndex = 0;
        shellState.treeCorrectCount = 0;
        shellState.treePhase = "ready";
        shellState.treeSelectedOption = null;
        shellState.treeFeedback = null;
        render("[data-tree-prompt]", "[data-source-tree-scene]");
        return;
      }
      progress.markGameKey(8);
      shellState.treePhase = "complete";
      shellState.treeSelectedOption = null;
      shellState.treeFeedback = "win";
      render("[data-source-tree-scene]", "[data-source-tree-scene]");
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-flying-level]").forEach((button) => {
      button.addEventListener("click", () => {
        const level = Number(button.dataset.flyingLevel);
        if (level !== 1 && level !== 2 && level !== 3) return;
        stopFlyingPlayback();
        audio.stopSceneAudio();
        shellState.activeAudioId = null;
        shellState.flyingLevel = level;
        shellState.flyingPhase = "ready";
        shellState.flyingInstrumentIndex = 0;
        shellState.flyingCorrectCount = 0;
        shellState.flyingColumn = 2;
        shellState.flyingRow = 0;
        shellState.flyingGrid = Array<number | null>(28).fill(null);
        shellState.flyingFeedback = null;
        render("[data-flying-start]", "[data-source-flying-grid]");
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-flying-start]")?.addEventListener("click", () => {
      startFlyingGame();
    });

    mount.querySelector<HTMLButtonElement>("[data-flying-left]")?.addEventListener("click", () => {
      if (shellState.flyingPhase !== "playing" || shellState.flyingColumn <= 1) return;
      const nextColumn = shellState.flyingColumn - 1;
      if (shellState.flyingGrid[flyingGridIndex(nextColumn, shellState.flyingRow)] !== null) return;
      shellState.flyingColumn = nextColumn as 1 | 2 | 3 | 4;
      render("[data-flying-left]", "[data-source-flying-grid]");
    });

    mount.querySelector<HTMLButtonElement>("[data-flying-right]")?.addEventListener("click", () => {
      if (shellState.flyingPhase !== "playing" || shellState.flyingColumn >= 4) return;
      const nextColumn = shellState.flyingColumn + 1;
      if (shellState.flyingGrid[flyingGridIndex(nextColumn, shellState.flyingRow)] !== null) return;
      shellState.flyingColumn = nextColumn as 1 | 2 | 3 | 4;
      render("[data-flying-right]", "[data-source-flying-grid]");
    });

    mount.querySelector<HTMLButtonElement>("[data-flying-down]")?.addEventListener("click", tickFlyingInstrument);

    mount.querySelector<HTMLButtonElement>("[data-flying-pause]")?.addEventListener("click", () => {
      if (shellState.flyingPhase === "playing") {
        stopFlyingPlayback();
        audio.stopSceneAudio();
        shellState.activeAudioId = null;
        shellState.flyingPhase = "paused";
        render("[data-flying-pause]", "[data-source-flying-grid]");
        return;
      }
      if (shellState.flyingPhase === "paused") {
        shellState.flyingPhase = "playing";
        playCurrentFlyingInstrument();
        render("[data-flying-pause]", "[data-source-flying-grid]");
        scheduleFlyingTick();
      }
    });

    mount.querySelector<HTMLButtonElement>("[data-flying-restart]")?.addEventListener("click", startFlyingGame);

    mount.querySelectorAll<HTMLButtonElement>("[data-childrens-song]").forEach((button) => {
      button.addEventListener("click", () => {
        const song = Number(button.dataset.childrensSong);
        if (song < 1 || song > 8) return;
        shellState.childrensAlbumSong = song as DoorKey;
        shellState.childrensAlbumSelections = [];
        shellState.childrensAlbumFeedback = null;
        render("[data-childrens-instrument]", "[data-source-childrens-board]");
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-childrens-preview]")?.addEventListener("click", () => {
      playSceneAudio(getM08Asset(`/audio/childrens-album/preview/preview${shellState.childrensAlbumSong}.mp3`), false);
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-childrens-instrument]").forEach((button) => {
      button.addEventListener("click", () => {
        const instrument = Number(button.dataset.childrensInstrument);
        if (instrument < 1 || instrument > 8 || shellState.childrensAlbumFeedback === "win") return;
        const selected = new Set(shellState.childrensAlbumSelections);
        if (selected.has(instrument)) selected.delete(instrument);
        else selected.add(instrument);
        shellState.childrensAlbumSelections = [...selected].sort((left, right) => left - right);
        shellState.childrensAlbumFeedback = null;
        audio.playOneShot(
          getM08Asset(`/audio/childrens-album/song${shellState.childrensAlbumSong}/instsound${instrument}.mp3`),
        );
        render("[data-childrens-instrument]", "[data-source-childrens-board]");
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-childrens-check]")?.addEventListener("click", () => {
      const song = childrensAlbumSongs[shellState.childrensAlbumSong - 1];
      if (!song) return;
      if (isChildrensAlbumSelectionCorrect(song, shellState.childrensAlbumSelections)) {
        const snapshot = progress.markChildrensDoor(song.id);
        if (snapshot.openedChildrensDoorCount === childrensAlbumSongs.length) {
          progress.markGameKey(6);
          shellState.childrensAlbumFeedback = "win";
        } else {
          shellState.childrensAlbumFeedback = "correct";
        }
      } else {
        shellState.childrensAlbumFeedback = "wrong";
      }
      render("[data-childrens-check]", "[data-source-childrens-board]");
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-loopy-tune]").forEach((button) => {
      button.addEventListener("click", () => {
        const tune = Number(button.dataset.loopyTune);
        if (tune < 1 || tune > 8) return;
        shellState.loopyTune = tune as DoorKey;
        shellState.loopySelections = [];
        shellState.loopyFeedback = null;
        render("[data-loopy-track]", "[data-source-loopy-board]");
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-loopy-track]").forEach((button) => {
      button.addEventListener("click", () => {
        const track = Number(button.dataset.loopyTrack);
        if (track < 1 || track > 8 || shellState.loopyFeedback === "win") return;
        const selected = new Set(shellState.loopySelections);
        if (selected.has(track)) selected.delete(track);
        else selected.add(track);
        shellState.loopySelections = [...selected].sort((left, right) => left - right);
        shellState.loopyFeedback = null;
        audio.playOneShot(
          getM08Asset(`/audio/embedded/loopy-${shellState.loopyTune}/sound-${loopyTrackSoundId(track)}.mp3`),
        );
        render("[data-loopy-track]", "[data-source-loopy-board]");
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-loopy-check]")?.addEventListener("click", () => {
      const tune = loopyTunes[shellState.loopyTune - 1];
      if (!tune) return;
      if (isLoopySelectionCorrect(tune, shellState.loopySelections)) {
        shellState.loopyCompleted = [...new Set([...shellState.loopyCompleted, tune.id])].sort((left, right) => left - right);
        if (shellState.loopyCompleted.length === loopyTunes.length) {
          progress.markGameKey(3);
          shellState.loopyFeedback = "win";
        } else {
          shellState.loopyFeedback = "correct";
        }
      } else {
        shellState.loopyFeedback = "wrong";
      }
      render("[data-loopy-check]", "[data-source-loopy-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-loopy-next]")?.addEventListener("click", () => {
      if (shellState.loopyFeedback !== "correct" || shellState.loopyTune >= 8) return;
      shellState.loopyTune = (shellState.loopyTune + 1) as DoorKey;
      shellState.loopySelections = [];
      shellState.loopyFeedback = null;
      render("[data-loopy-track]", "[data-source-loopy-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-orchestra-listen]")?.addEventListener("click", () => {
      if (shellState.orchestraFeedback === "win") return;
      shellState.orchestraPromptId ??= chooseOrchestraPrompt(shellState.orchestraCorrectIds, random());
      const prompt = shellState.orchestraPromptId;
      if (prompt === null) return;
      shellState.orchestraFeedback = null;
      audio.stopSceneAudio();
      audio.playOneShot(
        getM08Asset(`/audio/embedded/orchestra/sound-${orchestraInstrumentSoundId(prompt)}.mp3`),
      );
      render("[data-orchestra-listen]", "[data-source-orchestra-board]");
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-orchestra-instrument]").forEach((button) => {
      button.addEventListener("click", () => {
        const instrument = Number(button.dataset.orchestraInstrument);
        const prompt = shellState.orchestraPromptId;
        if (
          instrument < 1
          || instrument > orchestraInstruments.length
          || prompt === null
          || shellState.orchestraFeedback === "win"
        ) return;
        audio.stopSceneAudio();
        shellState.activeAudioId = null;
        if (instrument === prompt && !shellState.orchestraCorrectIds.includes(instrument)) {
          shellState.orchestraCorrectIds.push(instrument);
          shellState.orchestraPromptId = null;
          if (shellState.orchestraCorrectIds.length === orchestraInstruments.length) {
            progress.markGameKey(4);
            shellState.orchestraFeedback = "win";
            audio.playOneShot(getM08Asset(`/audio/embedded/orchestra/sound-${orchestraWinSoundId}.mp3`));
          } else {
            shellState.orchestraFeedback = "correct";
            audio.playOneShot(
              getM08Asset(`/audio/embedded/orchestra/sound-${orchestraInstrumentSoundId(instrument)}.mp3`),
            );
          }
        } else {
          shellState.orchestraFeedback = "wrong";
          audio.playOneShot(getM08Asset(`/audio/embedded/orchestra/sound-${orchestraBadSoundId}.mp3`));
        }
        render(
          shellState.orchestraFeedback === "correct" ? "[data-orchestra-listen]" : `[data-orchestra-instrument="${instrument}"]`,
          "[data-source-orchestra-board]",
        );
      });
    });

    const startToyPlayback = (
      kind: "check" | "demo",
      notes: readonly number[],
      focusSelector: string,
    ) => {
      stopToyMarchPlayback();
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.toyFeedback = null;
      shellState.toyPlaybackKind = kind;
      const playbackNotes = [...notes];
      const playStep = (index: number) => {
        shellState.toyMarchIndex = index;
        audio.playOneShot(
          getM08Asset(`/audio/embedded/toy-soldiers/sound-${toySoldierSoundId(playbackNotes[index])}.mp3`),
        );
        render(focusSelector, "[data-source-toy-board]");
      };
      playStep(0);
      for (let index = 1; index < playbackNotes.length; index += 1) {
        const timerId = window.setTimeout(() => {
          toyTimerIds.delete(timerId);
          playStep(index);
        }, index * 1000);
        toyTimerIds.add(timerId);
      }
      const completionTimerId = window.setTimeout(() => {
        toyTimerIds.delete(completionTimerId);
        shellState.toyMarchIndex = null;
        shellState.toyPlaybackKind = null;
        shellState.toyFeedback = kind === "check"
          ? toySoldiersAreCorrect(playbackNotes) ? "correct" : "wrong"
          : null;
        render(focusSelector, "[data-source-toy-board]");
      }, playbackNotes.length * 1000);
      toyTimerIds.add(completionTimerId);
    };

    mount.querySelectorAll<HTMLButtonElement>("[data-toy-soldier]").forEach((button) => {
      button.addEventListener("click", () => {
        const soldier = Number(button.dataset.toySoldier);
        if (soldier < 0 || soldier > 7) return;
        const nextNote = (shellState.toySoldierNotes[soldier] + 1) % 11;
        shellState.toySoldierNotes[soldier] = nextNote;
        startToyPlayback("check", shellState.toySoldierNotes, `[data-toy-soldier="${soldier}"]`);
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-toy-check]")?.addEventListener("click", () => {
      startToyPlayback("demo", toySoldierCorrectNotes, "[data-toy-check]");
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-alice-puzzle]").forEach((button) => {
      button.addEventListener("click", () => {
        const puzzle = Number(button.dataset.alicePuzzle);
        if (!alicePuzzleIds.includes(puzzle)) return;
        shellState.aliceChooserOpen = false;
        shellState.alicePuzzle = puzzle;
        shellState.aliceDialValues = [4, 4, 4];
        shellState.aliceFeedback = null;
        render("[data-alice-dial]", "[data-source-alice-board]");
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-alice-dial]").forEach((button) => {
      button.addEventListener("click", () => {
        const dial = Number(button.dataset.aliceDial);
        if (dial < 0 || dial > 2) return;
        shellState.aliceDialValues[dial] = (shellState.aliceDialValues[dial] % 4) + 1;
        shellState.aliceFeedback = alicePuzzleIsCorrect(shellState.aliceDialValues) ? "correct" : "wrong";
        render(`[data-alice-dial="${dial}"]`, "[data-source-alice-board]");
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-nut-house-tutorial]")?.addEventListener("click", () => {
      shellState.nutHousePhase = "prompt";
      shellState.nutHouseFeedback = null;
      render("[data-nut-house-start]", "[data-source-nut-house-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-nut-house-start]")?.addEventListener("click", () => {
      shellState.nutHousePhase = "playing";
      shellState.nutHouseFeedback = null;
      audio.stopSceneAudio();
      audio.playOneShot(getM08Asset(`/audio/embedded/nut-house-${shellState.nutHouseRoom}/sound-11.mp3`));
      render("[data-nut-house-play]", "[data-source-nut-house-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-nut-house-play]")?.addEventListener("click", () => {
      audio.stopSceneAudio();
      audio.playOneShot(getM08Asset(`/audio/embedded/nut-house-${shellState.nutHouseRoom}/sound-11.mp3`));
    });

    mount.querySelector<HTMLButtonElement>("[data-nut-house-help]")?.addEventListener("click", () => {
      audio.stopSceneAudio();
      shellState.nutHousePhase = "help";
      render("[data-nut-house-help-close]", "[data-source-nut-house-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-nut-house-help-close]")?.addEventListener("click", () => {
      shellState.nutHousePhase = "playing";
      render("[data-nut-house-help]", "[data-source-nut-house-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-nut-house-exit]")?.addEventListener("click", () => {
      audio.stopSceneAudio();
      shellState.nutHousePhase = "exit";
      render("[data-nut-house-exit-no]", "[data-source-nut-house-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-nut-house-exit-no]")?.addEventListener("click", () => {
      shellState.nutHousePhase = "playing";
      render("[data-nut-house-exit]", "[data-source-nut-house-board]");
    });

    mount.querySelector<HTMLButtonElement>("[data-nut-house-exit-yes]")?.addEventListener("click", () => {
      navigate("main-menu");
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-nut-house-mirror]").forEach((button) => {
      const playMirrorPreview = () => {
        const mirror = Number(button.dataset.nutHouseMirror);
        if (mirror < 1 || mirror > 8 || shellState.nutHouseFeedback === "win") return;
        audio.stopSceneAudio();
        audio.playOneShot(
          getM08Asset(
            `/audio/embedded/nut-house-${shellState.nutHouseRoom}/sound-${nutHouseMirrorSoundId(shellState.nutHouseRoom, mirror)}.mp3`,
          ),
        );
      };
      button.addEventListener("pointerenter", playMirrorPreview);
      button.addEventListener("focus", () => {
        if (suppressNextNutHouseFocusPreview) {
          suppressNextNutHouseFocusPreview = false;
          return;
        }
        playMirrorPreview();
      });
      button.addEventListener("click", () => {
        const mirror = Number(button.dataset.nutHouseMirror);
        if (mirror < 1 || mirror > 8 || shellState.nutHouseFeedback === "win") return;
        const room = shellState.nutHouseRoom;
        const correct = mirror === nutHouseCorrectMirror(room);
        const soundMap = getNutHouseSoundMap(room);
        audio.stopSceneAudio();
        audio.playOneShot(
          getM08Asset(
            `/audio/embedded/nut-house-${room}/sound-${correct ? soundMap.youWinSoundId : soundMap.badGuessSoundId}.mp3`,
          ),
        );
        if (correct) {
          const roomProgress = room - 10;
          progress.setNutHouseOpenDoor(roomProgress);
          if (room === 18) {
            progress.markGameKey(7);
            shellState.nutHouseFeedback = "win";
          } else {
            shellState.nutHouseRoom = room + 1;
            shellState.nutHousePhase = "prompt";
            shellState.nutHouseFeedback = "correct";
          }
        } else {
          shellState.nutHouseFeedback = "wrong";
        }
        suppressNextNutHouseFocusPreview = !correct || room === 18;
        render(
          correct && room < 18 ? "[data-nut-house-start]" : `[data-nut-house-mirror="${mirror}"]`,
          "[data-source-nut-house-board]",
        );
      });
    });

    if (focusSelector) {
      const requestedTarget = mount.querySelector<HTMLElement>(focusSelector);
      const usableTarget =
        requestedTarget instanceof HTMLButtonElement && requestedTarget.disabled ? null : requestedTarget;
      const fallbackTarget = fallbackFocusSelector
        ? mount.querySelector<HTMLElement>(fallbackFocusSelector)
        : null;
      (usableTarget ?? fallbackTarget)?.focus();
    }
  };

  const isNutcrackerSongInteractionBlocked = (songId: NutcrackerSongId): boolean =>
    getNutcrackerSongGameByRoute(shellState.routeId)?.id === songId &&
    (shellState.helpOpen ||
      shellState.nutcrackerFeedback[songId] === "hint" ||
      shellState.pendingNutcrackerSongChange === songId ||
      shellState.pendingNutcrackerSongExit === songId);

  const isNutcrackerSongModalAction = (action: string | undefined): boolean =>
    action === "dismiss-hint" ||
    action === "accept-change-song" ||
    action === "cancel-change-song" ||
    action === "accept-exit-song" ||
    action === "cancel-exit-song";

  const startMelodyDemonstration = () => {
    const sequences = getMelodySequences(shellState.melodyDifficulty);
    const sequence = sequences[shellState.melodySequenceIndex % sequences.length];
    if (!sequence) return;
    stopMelodyPlayback();
    audio.stopSceneAudio();
    shellState.melodyInputEnabled = false;
    shellState.melodyInputMistake = false;
    shellState.melodyDemoPlaying = true;
    let delay = 0;
    sequence.tokens.forEach((token) => {
      const timerId = window.setTimeout(() => {
        melodyTimerIds.delete(timerId);
        if (!shellState.melodyDemoPlaying || shellState.routeId !== "melody") return;
        shellState.activeAudioId = audio.playOneShot(getMelodyNoteAudio(token.note, token.length)).id;
      }, delay);
      melodyTimerIds.add(timerId);
      delay += token.delayMs;
    });
    const completionTimerId = window.setTimeout(() => {
      melodyTimerIds.delete(completionTimerId);
      if (!shellState.melodyDemoPlaying || shellState.routeId !== "melody") return;
      shellState.melodyDemoPlaying = false;
      render("[data-melody-start]", "[data-source-melody-board]");
    }, delay);
    melodyTimerIds.add(completionTimerId);
    render("[data-source-melody-board]", "[data-source-melody-keyboard]");
  };

  const showSourceFlyingHelp = (sourceHelpElement: HTMLElement, event?: PointerEvent) => {
    const label = sourceHelpElement.dataset.sourceHelp;
    const flyingHelp = mount.querySelector<HTMLElement>(".source-flying-help");
    const viewport = mount.querySelector<HTMLElement>(".game-viewport");
    if (!label || !flyingHelp || !viewport) {
      return;
    }

    flyingHelp.querySelectorAll<HTMLElement>(".source-flying-help-text").forEach((layer) => {
      layer.textContent = label;
    });
    flyingHelp.dataset.sourceFrame = sourceHelpElement.dataset.sourceHelpFrame ?? "2";
    flyingHelp.dataset.sourceBounds = sourceHelpElement.dataset.sourceHelpBounds ?? "frame 2 edit ids 0231-0233 bbox approx 276x22 after 1.2 scale";
    flyingHelp.dataset.visible = "true";

    const viewportRect = viewport.getBoundingClientRect();
    const sourceRect = sourceHelpElement.getBoundingClientRect();
    // The release shell scales the 640-wide stage with a CSS transform; pointer coordinates are in
    // screen pixels, while style.left/top are in unscaled stage pixels, so divide out the scale.
    const renderedScale = viewportRect.width > 0 ? viewportRect.width / 640 : 1;
    const sourceX = (event ? event.clientX - viewportRect.left : sourceRect.left + sourceRect.width / 2 - viewportRect.left) / renderedScale;
    const sourceY = (event ? event.clientY - viewportRect.top : sourceRect.top - viewportRect.top) / renderedScale;
    const left = Math.min(Math.max(sourceX + 14, 8), 488);
    const top = Math.min(Math.max(sourceY - 34, 8), 438);
    flyingHelp.style.left = `${left}px`;
    flyingHelp.style.top = `${top}px`;
  };

  const hideSourceFlyingHelp = () => {
    const flyingHelp = mount.querySelector<HTMLElement>(".source-flying-help");
    if (!flyingHelp) {
      return;
    }
    flyingHelp.querySelectorAll<HTMLElement>(".source-flying-help-text").forEach((layer) => {
      layer.textContent = "";
    });
    delete flyingHelp.dataset.visible;
    flyingHelp.style.left = "10000px";
  };

  const navigate = (routeId: RouteId) => {
    if (readerExitTimerId !== null) {
      window.clearTimeout(readerExitTimerId);
      readerExitTimerId = null;
    }
    const routeChanged = routeId !== shellState.routeId;
    if (routeChanged) {
      shellState.routeStack.push(shellState.routeId);
    }
    if (routeChanged && routeId === "melody") {
      shellState.melodyStarted = false;
      shellState.melodyInputEnabled = false;
      shellState.melodyInput = [];
      shellState.melodyFeedback = null;
      shellState.melodyInputMistake = false;
    }
    if (routeChanged && routeId === "tree-game") {
      shellState.treeVariant = 1;
      shellState.treeRoundIndex = 0;
      shellState.treeCorrectCount = 0;
      shellState.treePhase = "ready";
      shellState.treeSelectedOption = null;
      shellState.treeFeedback = null;
    }
    if (routeChanged && routeId === "flying-instruments") {
      shellState.flyingPhase = "choosing";
      shellState.flyingInstrumentIndex = 0;
      shellState.flyingCorrectCount = 0;
      shellState.flyingColumn = 2;
      shellState.flyingRow = 0;
      shellState.flyingGrid = Array<number | null>(28).fill(null);
      shellState.flyingFeedback = null;
    }
    if (routeChanged && routeId === "alice-puzzles") {
      shellState.aliceChooserOpen = true;
      shellState.alicePuzzle = 1;
      shellState.aliceDialValues = [4, 4, 4];
      shellState.aliceFeedback = null;
    }
    if (routeChanged && routeId === "overture") {
      shellState.overturePhase = "intro";
    }
    if (routeChanged && isReadingRouteId(routeId)) {
      shellState.readingPages[routeId] = 0;
    }
    if (routeChanged && routeId === "music-dictionary") {
      shellState.activeDictionaryInstrumentId = dictionaryInstruments[0].id;
    }
    if (routeChanged && routeId === "nut-house") {
      shellState.nutHouseRoom = 11 + Math.min(progress.getSnapshot().nutHouse.openDoor, 7);
      shellState.nutHousePhase = progress.getSnapshot().nutHouse.openDoor === 0 ? "tutorial" : "prompt";
      shellState.nutHouseFeedback = null;
    }
    shellState.routeId = routeId;
    shellState.helpOpen = false;
    shellState.musictionaryHelpOpen = false;
    shellState.musictionaryHelpFishVisible = false;
    shellState.nutcrackerChooserWarningOpen = false;
    shellState.pendingNutcrackerSongChange = null;
    shellState.pendingNutcrackerSongExit = null;
    stopMelodyPlayback();
    stopTreePlayback();
    stopFlyingPlayback();
    stopToyMarchPlayback();
    audio.stopSceneAudio();
    shellState.activeAudioId = null;
    shellState.activeSuiteTrackId = null;
    if (isReadingRouteId(routeId)) {
      const narrationPath = getReadingActivity(routeId).audioPath;
      if (narrationPath) {
        shellState.activeAudioId = audio.playOneShot(narrationPath).id;
      }
    }
    if (routeId === "music-dictionary") {
      shellState.activeAudioId = audio.playOneShot(getDictionaryInstrument(shellState.activeDictionaryInstrumentId).audioPath).id;
    }
    if (routeId === "waltz") {
      audio.playOneShot(getM08Asset("/audio/waltz/MP3Wedding3.wav"));
    }
    render();
  };

  const stopSceneAudio = () => {
    stopMelodyPlayback();
    stopTreePlayback();
    if (shellState.routeId === "flying-instruments" && shellState.flyingPhase === "playing") {
      stopFlyingPlayback();
      shellState.flyingPhase = "paused";
    } else if (shellState.routeId !== "flying-instruments" || shellState.flyingPhase !== "matching") {
      stopFlyingPlayback();
    }
    if (shellState.routeId === "tree-game" && (shellState.treePhase === "prompting" || shellState.treePhase === "answering")) {
      shellState.treePhase = "ready";
      shellState.treeSelectedOption = null;
      shellState.treeFeedback = null;
    }
    stopToyMarchPlayback();
    audio.stopSceneAudio();
    shellState.activeAudioId = null;
    shellState.activeSuiteTrackId = null;
    render();
  };

  const playNutcrackerTrackPreview = (track: NutcrackerTrack) => {
    audio.stopSceneAudio();
    shellState.activeSuiteTrackId = null;
    shellState.activeAudioId = audio.playTrack(track.audioPath, getNutcrackerTrackStartSeconds(track)).id;
  };

  const playNutcrackerSongPreview = (song: NutcrackerSongGame) => {
    audio.stopSceneAudio();
    shellState.activeSuiteTrackId = null;
    const handles = song.tracks.filter((track) => track.valid).map((track) => audio.playOneShot(track.audioPath));
    shellState.activeAudioId = handles[0]?.id ?? null;
    render();
  };

  const playSceneAudio = (audioPath: string, loop: boolean, startTimeSeconds = 0) => {
    audio.stopSceneAudio();
    shellState.activeAudioId = loop ? audio.playTrack(audioPath, startTimeSeconds).id : audio.playOneShot(audioPath).id;
    render();
  };

  const selectSuiteTrack = (trackId: string) => {
    const track = getSuiteTrack(trackId);
    audio.stopSceneAudio();
    shellState.activeSuiteTrackId = track.id;
    shellState.activeAudioId = track.audioPath ? audio.playOneShot(track.audioPath).id : null;
    render();
  };

  const flyingGridIndex = (column: number, row: number) => row * 4 + (column - 1);

  const playCurrentFlyingInstrument = () => {
    const sequence = getFlyingInstrumentSequence(shellState.flyingLevel);
    const instrument = sequence[shellState.flyingInstrumentIndex];
    audio.stopSceneAudio();
    shellState.activeAudioId = instrument ? audio.playOneShot(instrument.soundUrl).id : null;
  };

  const finishFlyingGame = () => {
    stopFlyingPlayback();
    audio.stopSceneAudio();
    shellState.activeAudioId = null;
    shellState.flyingPhase = "complete";
    const keyEarned = shellState.flyingScore >= 300 || progress.getSnapshot().gameKeys[3];
    shellState.flyingFeedback = keyEarned ? "win" : "round-complete";
    if (shellState.flyingScore >= 300) progress.markGameKey(3);
    render("[data-flying-restart]", "[data-source-flying-grid]");
  };

  const spawnFlyingInstrument = () => {
    const sequence = getFlyingInstrumentSequence(shellState.flyingLevel);
    if (shellState.flyingInstrumentIndex >= sequence.length) {
      finishFlyingGame();
      return;
    }
    shellState.flyingColumn = 2;
    shellState.flyingRow = 0;
    if (shellState.flyingGrid[flyingGridIndex(2, 0)] !== null) {
      stopFlyingPlayback();
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.flyingPhase = "blocked";
      shellState.flyingFeedback = "blocked";
      render("[data-flying-restart]", "[data-source-flying-grid]");
      return;
    }
    shellState.flyingPhase = "playing";
    shellState.flyingFeedback = null;
    playCurrentFlyingInstrument();
    render("[data-flying-down]", "[data-source-flying-grid]");
    scheduleFlyingTick();
  };

  const settleFlyingInstrument = () => {
    const sequence = getFlyingInstrumentSequence(shellState.flyingLevel);
    const instrument = sequence[shellState.flyingInstrumentIndex];
    if (!instrument) {
      finishFlyingGame();
      return;
    }
    const cellIndex = flyingGridIndex(shellState.flyingColumn, shellState.flyingRow);
    shellState.flyingGrid[cellIndex] = instrument.id;
    shellState.flyingCorrectCount += 1;
    shellState.flyingInstrumentIndex += 1;
    audio.stopSceneAudio();
    shellState.activeAudioId = null;

    const belowRow = shellState.flyingRow + 1;
    const belowIndex = belowRow <= 6 ? flyingGridIndex(shellState.flyingColumn, belowRow) : -1;
    const belowId = belowIndex >= 0 ? shellState.flyingGrid[belowIndex] : null;
    const matched = belowId !== null && getFlyingInstrumentById(belowId).family === instrument.family;
    if (!matched) {
      if (shellState.flyingInstrumentIndex >= sequence.length) {
        finishFlyingGame();
      } else {
        spawnFlyingInstrument();
      }
      return;
    }

    shellState.flyingPhase = "matching";
    shellState.flyingFeedback = "match";
    shellState.flyingScore += 8 * shellState.flyingLevel;
    render("[data-source-flying-grid]", "[data-source-flying-grid]");
    if (shellState.flyingScore >= 300) {
      finishFlyingGame();
      return;
    }
    const timerId = window.setTimeout(() => {
      flyingTimerIds.delete(timerId);
      if (shellState.routeId !== "flying-instruments" || shellState.flyingPhase !== "matching") return;
      shellState.flyingGrid[cellIndex] = null;
      shellState.flyingGrid[belowIndex] = null;
      if (shellState.flyingInstrumentIndex >= sequence.length) {
        finishFlyingGame();
      } else {
        spawnFlyingInstrument();
      }
    }, 1000);
    flyingTimerIds.add(timerId);
  };

  const tickFlyingInstrument = () => {
    stopFlyingPlayback();
    if (shellState.routeId !== "flying-instruments" || shellState.flyingPhase !== "playing") return;
    const nextRow = shellState.flyingRow + 1;
    if (nextRow <= 6 && shellState.flyingGrid[flyingGridIndex(shellState.flyingColumn, nextRow)] === null) {
      shellState.flyingRow = nextRow;
      render("[data-flying-down]", "[data-source-flying-grid]");
      scheduleFlyingTick();
      return;
    }
    settleFlyingInstrument();
  };

  function scheduleFlyingTick() {
    if (shellState.routeId !== "flying-instruments" || shellState.flyingPhase !== "playing") return;
    const timerId = window.setTimeout(() => {
      flyingTimerIds.delete(timerId);
      tickFlyingInstrument();
    }, 345);
    flyingTimerIds.add(timerId);
  }

  const startFlyingGame = () => {
    stopFlyingPlayback();
    shellState.flyingInstrumentIndex = 0;
    shellState.flyingCorrectCount = 0;
    shellState.flyingColumn = 2;
    shellState.flyingRow = 0;
    shellState.flyingGrid = Array<number | null>(28).fill(null);
    shellState.flyingFeedback = null;
    spawnFlyingInstrument();
  };

  const startTreePrompt = () => {
    const round = createTreeRounds(shellState.treeVariant)[shellState.treeRoundIndex];
    if (!round || shellState.routeId !== "tree-game") return;
    stopTreePlayback();
    audio.stopSceneAudio();
    shellState.activeAudioId = audio.playOneShot(round.promptAudioUrl).id;
    shellState.treePhase = "prompting";
    shellState.treeSelectedOption = null;
    shellState.treeFeedback = null;
    render("[data-source-tree-scene]", "[data-source-tree-scene]");
    const timerId = window.setTimeout(() => {
      treeTimerIds.delete(timerId);
      if (shellState.routeId !== "tree-game" || shellState.treePhase !== "prompting") return;
      shellState.activeAudioId = null;
      shellState.treePhase = "choosing";
      render(
        `[data-tree-round="${shellState.treeRoundIndex}"][data-tree-option="1"]`,
        "[data-source-tree-scene]",
      );
    }, round.promptDurationMs);
    treeTimerIds.add(timerId);
  };

  const handleAction = (action: string | undefined) => {
    if (action === "start") {
      shellState.overturePhase = "launcher";
      render(".source-projector-launcher");
      return;
    }

    if (action === "play-featured-game") {
      navigate("main-menu");
      return;
    }

    if (action === "preview-musical-friends") {
      shellState.overturePhase = "intro";
      render(".source-intro-scene");
      return;
    }

    if (action === "preview-alice") {
      navigate("alice-puzzles");
      return;
    }

    if (action === "open-kids-music-stage") {
      openExternal("http://www.kidsmusicstage.com");
      return;
    }

    if (action === "exit-projector") {
      exitApp();
      return;
    }

    if (action === "back") {
      shellState.routeId = shellState.routeStack.pop() ?? "main-menu";
      shellState.helpOpen = false;
      shellState.musictionaryHelpOpen = false;
      shellState.musictionaryHelpFishVisible = false;
      shellState.nutcrackerChooserWarningOpen = false;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      stopMelodyPlayback();
      stopTreePlayback();
      stopFlyingPlayback();
      stopToyMarchPlayback();
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      render();
      return;
    }

    if (action === "help") {
      const songRoute = getNutcrackerSongGameByRoute(shellState.routeId);
      const closingSongHelp = Boolean(songRoute && shellState.helpOpen);
      shellState.nutcrackerChooserWarningOpen = false;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      if (songRoute) {
        audio.stopSceneAudio();
        shellState.activeAudioId = null;
        shellState.activeSuiteTrackId = null;
      }
      shellState.helpOpen = !shellState.helpOpen;
      if (songRoute) {
        render(
          closingSongHelp ? '[data-source-control="helpButton"]' : '[data-modal-dismiss="true"]',
          ".nutcracker-song-scene",
        );
      } else {
        render();
      }
      return;
    }

    if (action === "chooser-warning") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      shellState.helpOpen = false;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      shellState.nutcrackerChooserWarningOpen = true;
      render();
      return;
    }

    if (action === "cancel-chooser-warning") {
      shellState.nutcrackerChooserWarningOpen = false;
      render();
      return;
    }

    if (action === "accept-chooser-warning") {
      shellState.nutcrackerChooserWarningOpen = false;
      navigate("main-menu");
      return;
    }

    if (action === "exit") {
      if (isReadingRouteId(shellState.routeId)) {
        const readerScene = mount.querySelector<HTMLElement>(".source-reader-scene");
        if (!readerScene || readerScene.dataset.exiting === "true") {
          return;
        }
        audio.stopSceneAudio();
        shellState.activeAudioId = null;
        readerScene.dataset.exiting = "true";
        readerExitTimerId = window.setTimeout(() => {
          readerExitTimerId = null;
          navigate("main-menu");
        }, 400);
        return;
      }
      navigate("main-menu");
      return;
    }

    if (action === "reset-progress") {
      stopMelodyPlayback();
      stopTreePlayback();
      stopFlyingPlayback();
      stopToyMarchPlayback();
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      progress.resetAll();
      shellState.childrensAlbumSong = 1;
      shellState.childrensAlbumSelections = [];
      shellState.childrensAlbumFeedback = null;
      shellState.loopyTune = 1;
      shellState.loopySelections = [];
      shellState.loopyCompleted = [];
      shellState.loopyFeedback = null;
      shellState.orchestraPromptId = null;
      shellState.orchestraCorrectIds = [];
      shellState.orchestraFeedback = null;
      shellState.toySoldierNotes = [...toySoldierInitialNotes];
      shellState.toyFeedback = null;
      shellState.toyMarchIndex = null;
      shellState.toyPlaybackKind = null;
      shellState.treeVariant = 1;
      shellState.treeRoundIndex = 0;
      shellState.treeCorrectCount = 0;
      shellState.treePhase = "ready";
      shellState.treeSelectedOption = null;
      shellState.treeFeedback = null;
      shellState.flyingPhase = "choosing";
      shellState.flyingInstrumentIndex = 0;
      shellState.flyingCorrectCount = 0;
      shellState.flyingScore = 0;
      shellState.flyingColumn = 2;
      shellState.flyingRow = 0;
      shellState.flyingGrid = Array<number | null>(28).fill(null);
      shellState.flyingFeedback = null;
      shellState.aliceChooserOpen = true;
      shellState.alicePuzzle = 1;
      shellState.aliceDialValues = [4, 4, 4];
      shellState.aliceFeedback = null;
      shellState.nutHouseRoom = 11;
      shellState.nutHousePhase = "tutorial";
      shellState.nutHouseFeedback = null;
      render();
      return;
    }

    if (action === "print-certificate") {
      if (progress.getSnapshot().gameKeys[1]) {
        printCertificate();
      }
      return;
    }

    if (action === "audio-preview") {
      audio.stopSceneAudio();
      shellState.activeAudioId = audio.playTrack(previewAudioPath).id;
      render();
      return;
    }

    if (action === "audio-stop") {
      stopSceneAudio();
      return;
    }

    if (action === "suite-stop") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      render();
      return;
    }

    if (action === "suite-play") {
      const track = getSuiteTrack(shellState.activeSuiteTrackId ?? suiteTracks[0].id);
      shellState.activeSuiteTrackId = track.id;
      if (track.audioPath) {
        playSceneAudio(track.audioPath, false);
      } else {
        audio.stopSceneAudio();
        shellState.activeAudioId = null;
        render();
      }
      return;
    }

    if (action === "mute") {
      audio.setMuted(!audio.getState().muted);
      render();
    }
  };

  const handleSongAction = (songId: NutcrackerSongId, action: string | undefined) => {
    const song = nutcrackerSongGames.find((item) => item.id === songId);
    if (!song) {
      return;
    }

    if (action === "play-theme") {
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      if (shellState.activeAudioId) {
        stopSceneAudio();
        return;
      }
      playNutcrackerSongPreview(song);
      return;
    }

    if (action === "reset-song") {
      shellState.nutcrackerSelections[songId] = [];
      shellState.nutcrackerFeedback[songId] = null;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      render();
      return;
    }

    if (action === "confirm-change-song") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      shellState.pendingNutcrackerSongChange = songId;
      shellState.pendingNutcrackerSongExit = null;
      render('[data-song-action="cancel-change-song"]', ".source-change-alert");
      return;
    }

    if (action === "cancel-change-song") {
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      render('[data-source-control="songChooser"]', ".nutcracker-song-scene");
      return;
    }

    if (action === "accept-change-song") {
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      navigate("nutcracker-chooser");
      return;
    }

    if (action === "confirm-exit-song") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = songId;
      render('[data-song-action="cancel-exit-song"]', ".source-song-warning-modal");
      return;
    }

    if (action === "cancel-exit-song") {
      shellState.pendingNutcrackerSongExit = null;
      render('[data-source-control="quiter"]', ".nutcracker-song-scene");
      return;
    }

    if (action === "accept-exit-song") {
      shellState.pendingNutcrackerSongExit = null;
      navigate("nutcracker-chooser");
      return;
    }

    if (action === "hint-song") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      showNutcrackerHint(song, shellState, progress);
      render('[data-song-action="dismiss-hint"]', ".source-hint-alert");
      return;
    }

    if (action === "dismiss-hint") {
      if (shellState.nutcrackerFeedback[songId] === "hint") {
        shellState.nutcrackerFeedback[songId] = null;
      }
      render('[data-source-control="hintButton"]', ".nutcracker-song-scene");
      return;
    }

    if (action === "submit-song") {
      submitNutcrackerSong(song, shellState, progress);
      render();
    }
  };

  mount.addEventListener("keydown", (event) => {
    if (shellState.routeId !== "flying-instruments" || shellState.flyingPhase !== "playing") return;
    const selector = event.key === "ArrowLeft"
      ? "[data-flying-left]"
      : event.key === "ArrowRight"
        ? "[data-flying-right]"
        : event.key === "ArrowDown"
          ? "[data-flying-down]"
          : null;
    if (!selector) return;
    event.preventDefault();
    mount.querySelector<HTMLButtonElement>(selector)?.click();
  });

  let audioIdleUpdateScheduled = false;
  audio.subscribe((audioState) => {
    if (audioState.activeTrackCount !== 0 || shellState.activeAudioId === null || audioIdleUpdateScheduled) {
      return;
    }
    audioIdleUpdateScheduled = true;
    queueMicrotask(() => {
      audioIdleUpdateScheduled = false;
      if (audio.getState().activeTrackCount === 0 && shellState.activeAudioId !== null) {
        shellState.activeAudioId = null;
        render();
      }
    });
  });

  render();
  if (!showDeveloperPanel) {
    refitStage = fitStageToWindow(mount);
  }
}

function renderScene(route: RouteDefinition, progress: ReturnType<ProgressStoreController["getSnapshot"]>, shellState: ShellState): string {
  if (route.id === "overture") {
    return renderSourceOverture(shellState.overturePhase);
  }

  if (route.id === "main-menu") {
    return renderMainPlayRoom(progress);
  }

  if (isReadingRouteId(route.id)) {
    return renderReadingActivity(route.id, shellState.readingPages[route.id]);
  }

  if (route.id === "music-dictionary") {
    return renderMusicDictionary(
      getDictionaryInstrument(shellState.activeDictionaryInstrumentId),
      shellState.musictionaryHelpOpen,
      shellState.musictionaryHelpFishVisible,
    );
  }

  if (route.id === "suite") {
    return renderSuitePlayer(shellState.activeSuiteTrackId, shellState.activeAudioId !== null);
  }

  if (route.id === "nutcracker-chooser") {
    return renderNutcrackerChooser(progress);
  }

  if (route.id === "trivia") {
    return renderTriviaGame(shellState, progress.gameKeys[9]);
  }

  if (route.id === "melody") {
    return renderMelodyGame(shellState, progress.gameKeys[5]);
  }

  if (route.id === "memory") {
    return renderMemoryGame(shellState, progress.gameKeys[2]);
  }

  if (route.id === "tree-game") {
    return renderTreeGame(shellState, progress.gameKeys[8]);
  }

  if (route.id === "flying-instruments") {
    return renderFlyingInstruments(shellState, progress.gameKeys[3]);
  }

  if (route.id === "childrens-album") {
    return renderChildrensAlbum(shellState, progress);
  }

  if (route.id === "loopy-tunes") {
    return renderLoopyTunes(shellState, progress.gameKeys[3]);
  }

  if (route.id === "orchestra") {
    return renderOrchestra(shellState, progress.gameKeys[4]);
  }

  if (route.id === "toy-soldiers") {
    return renderToySoldiers(shellState);
  }

  if (route.id === "waltz") {
    return renderWaltz();
  }

  if (route.id === "alice-puzzles") {
    return renderAlicePuzzles(shellState);
  }

  if (route.id === "nut-house") {
    return renderNutHouse(shellState, progress.gameKeys[7]);
  }

  const song = getNutcrackerSongGameByRoute(route.id);
  if (song) {
    return renderNutcrackerSongGame(
      song,
      progress.nutDoors[song.id],
      shellState.nutcrackerSelections[song.id],
      shellState.nutcrackerFeedback[song.id],
      progress.openedNutDoorCount === nutcrackerSongGames.length,
      shellState.activeAudioId !== null,
      shellState.pendingNutcrackerSongChange === song.id,
      shellState.pendingNutcrackerSongExit === song.id,
      shellState.helpOpen,
    );
  }

  return `
    <div class="scene-body">
      <img class="stage-mark" src="${stageMarkUrl}" alt="" aria-hidden="true" />
      <div class="scene-copy">
        <p class="level-label">${route.levelTarget}</p>
        <h1>${route.heading}</h1>
        <p>${route.summary}</p>
      </div>
    </div>
  `;
}

function renderSourceOverture(phase: ShellState["overturePhase"]): string {
  if (phase === "launcher") {
    return `
      <div
        class="scene-body source-projector-launcher"
        tabindex="-1"
        data-source-projector="analysis/setup/app/Nutcracker2.exe embedded FWS at byte 864256"
        data-source-frame="root frame 1268 label choose"
        data-source-capture="official Ruffle v0.5.0 lossless 1280 x 960 DPR-2 source-runtime capture downsampled to the native 640 x 480 stage"
        data-source-fallback="static source capture preserves the normal launcher frame; isolated button ids 0028, 0038, 0043, 0047, and 0051 extract but swfrender reports the button ids unknown, so exact rollover/down timeline playback remains pending"
        data-source-action-map="nut to nutIni; MFBtn to MFintro; aliceBTN to aliceIntro; webBTN to warningMSG_mc show; button 0038 to root frame 2388"
      >
        <img class="source-projector-choose" src="${projectorChooseSourceUrl}" alt="" aria-hidden="true" />
        <h1 class="sr-only">Choose a Kids Music Stage game</h1>
        <button
          class="source-projector-launcher-button source-projector-play"
          type="button"
          data-action="play-featured-game"
          aria-label="Play Featured Game"
          data-source-placement="button id 0028 instance nut at depth 0002 x 364.15 y 90.95 ratio 1267"
          data-source-hit-rect="x 216-424 y 44-246"
          data-source-action="root gotoAndPlay nutIni"
        ><span class="sr-only">Play Featured Game</span></button>
        <button
          class="source-projector-launcher-button source-projector-preview-mf"
          type="button"
          data-action="preview-musical-friends"
          aria-label="Preview Musical Friends"
          data-source-placement="button id 0043 instance MFBtn at depth 0012 x 146.25 y 355.55 ratio 1267"
          data-source-hit-rect="x 54-188 y 326-460"
          data-source-action="root gotoAndPlay MFintro"
        ><span class="sr-only">Preview Musical Friends</span></button>
        <button
          class="source-projector-launcher-button source-projector-preview-alice"
          type="button"
          data-action="preview-alice"
          aria-label="Preview Alice's Adventures in Musicland"
          data-source-placement="button id 0047 instance aliceBTN at depth 0020 x 291.80 y 355.55 ratio 1267"
          data-source-hit-rect="x 196-332 y 326-460"
          data-source-action="root gotoAndPlay aliceIntro"
        ><span class="sr-only">Preview Alice's Adventures in Musicland</span></button>
        <button
          class="source-projector-launcher-button source-projector-web"
          type="button"
          data-action="open-kids-music-stage"
          aria-label="Go to KidsMusicStage.com"
          data-source-placement="button id 0051 instance webBTN at depth 0029 x 527.70 y 355.65 ratio 1267"
          data-source-hit-rect="x 432-576 y 320-464"
          data-source-action="warningMSG_mc gotoAndStop show; YES opens http://www.kidsmusicstage.com"
        ><span class="sr-only">Go to KidsMusicStage.com</span></button>
        <button
          class="source-projector-launcher-button source-projector-exit"
          type="button"
          data-action="exit-projector"
          aria-label="Exit"
          data-source-placement="button id 0038 at depth 0009 x 563.50 y 25.45 ratio 1267"
          data-source-hit-rect="x 572-640 y 8-58"
          data-source-action="GotoFrame 2388 then FSCommand quit"
        ><span class="sr-only">Exit</span></button>
      </div>
    `;
  }

  return `
    <div
      class="scene-body source-intro-scene"
      data-source-swf="analysis/setup/app/flute_intro.swf"
      data-source-frame="root frame 1 through 1277 at 15 fps"
      data-source-image="DEFINEBITSJPEG id 0371 promoted as the recovered garden layer"
      data-source-control="source text skip at the lower-right edge; root gotoAndStop choose"
      data-source-fallback="full root probes at frames 1, 300, 900, 1200, and 1277 rendered blank; frames 100 and 600 crashed the local SWF renderer, so the runtime holds one promoted source layer instead of claiming full timeline playback"
    >
      <img class="source-intro-garden" src="${fluteIntroGardenUrl}" alt="" aria-hidden="true" />
      <h1 class="sr-only">Recovered projector introduction</h1>
      <button class="source-intro-skip" type="button" data-action="start">skip</button>
    </div>
  `;
}

function renderMainPlayRoom(progress: ReturnType<ProgressStoreController["getSnapshot"]>): string {
  const nutcrackerUnlocked = progress.completedGameCount === 9;
  return `
    <div
      class="scene-body source-playroom-scene"
      data-source-projector="analysis/setup/app/Nutcracker2.exe embedded FWS at byte 864256"
      data-source-frame="root frame 2378 label playRoom"
      data-source-background="DEFINEBITSJPEG id 0518; shape id 0519 at depth 0003 centered x 320 y 240"
      data-source-capture="official Ruffle v0.5.0 render of extracted root frame 2378 source layers"
      data-source-fallback="swfextract -f 2378 omits JPEG id 0518 with the installed SWFTools build; the deterministic asset gate chroma-keys the source-runtime foreground capture over the exact promoted source JPEG and retains source-coordinate hotspots"
    >
      <img class="source-playroom-background" src="${mainPlayRoomCompositeUrl}" alt="" aria-hidden="true" />
      <div class="source-playroom-hotspots" role="group" aria-label="Music room activities">
        ${mainRoomHotspots.map(renderMainRoomHotspot).join("")}
        ${
          nutcrackerUnlocked
            ? `<button
                class="source-playroom-hotspot source-playroom-nutcracker"
                type="button"
                data-scene-route="nutcracker-chooser"
                style="left: 300.95px; top: 192.4px"
                title="The Nutcracker Game"
                aria-label="The Nutcracker Game"
                data-source-placement="button sprite id 0671 nutButton at depth 0187 x 300.95 y 192.40 ratio 2377"
                data-source-action="button id 0670 loads games/nutcrackergame/nutchooser.swf; on-load gate shows nutButton only when collectedKeys equals 9"
              ><span class="sr-only">The Nutcracker Game</span></button>`
            : ""
        }
      </div>
    </div>
  `;
}

function renderMainRoomHotspot(hotspot: MainRoomHotspot): string {
  const routeAttribute = hotspot.routeId ? `data-scene-route="${hotspot.routeId}"` : "disabled";
  const gapDescription = hotspot.routeId ? "" : " (source route not yet reconstructed)";
  return `
    <button
      class="source-playroom-hotspot"
      type="button"
      ${routeAttribute}
      style="left: ${hotspot.x}px; top: ${hotspot.y}px"
      title="${escapeHtml(hotspot.label)}${gapDescription}"
      aria-label="${escapeHtml(hotspot.label)}${gapDescription}"
      data-source-placement="button id ${String(hotspot.sourceButtonId).padStart(4, "0")} at depth ${String(hotspot.depth).padStart(4, "0")} x ${hotspot.x.toFixed(2)} y ${hotspot.y.toFixed(2)} ratio 2377"
      data-source-action="loadGame ${escapeHtml(hotspot.sourcePath)}"
      ${hotspot.routeId ? "" : "data-source-route-gap=true"}
    ><span class="sr-only">${escapeHtml(hotspot.label)}</span></button>
  `;
}

function renderReadingActivity(routeId: ReadingRouteId, pageIndex: number): string {
  const activity = getReadingActivity(routeId);
  const safePageIndex = Math.min(Math.max(pageIndex, 0), activity.pages.length - 1);
  const page = activity.pages[safePageIndex];
  const previousPage = safePageIndex - 1;
  const nextPage = safePageIndex + 1;
  const sourceTextIds = page.columns.flatMap((column) => column.sourceTextIds);
  const sourceImageIds = [activity.sourceBookImageId, ...page.columns.flatMap((column) => column.sourceImageIds)];
  const previousButtonId = sourceReaderPreviousButtonIds[routeId][safePageIndex];
  const nextButtonId = sourceReaderNextButtonIds[routeId][safePageIndex];
  const exitHoverPath = routeId === "ballet-history" ? readerControlExitHoverBalletUrl : readerControlExitHoverUrl;
  return `
    <div
      class="scene-body source-reader-scene"
      data-source-swf="analysis/setup/app/${escapeHtml(activity.sourceSwfPath)}"
      data-source-frame-label="${page.sourceFrameLabel}"
      data-source-text-ids="${sourceTextIds.join(",") || "none"}"
      data-source-image-ids="${sourceImageIds.join(",")}"
      data-source-controls="NEXT >, < PREV, EXIT"
      data-source-classification="original asset"
      data-source-capture="official Ruffle v0.5.0 neutral source-runtime capture"
      data-source-fallback="static source-runtime frame captures preserve the complete display; live narration, page navigation, source hit regions, hover art, and exit fade are reconstructed while the pre-page book fade and transient loading sprite remain a documented timeline gap"
    >
      <article class="source-reader-book" aria-label="${escapeHtml(activity.title)}">
        <img
          class="source-reader-scene-frame"
          src="${page.sceneImagePath}"
          alt=""
          aria-hidden="true"
          data-source-image="official Ruffle v0.5.0 root frame label ${page.sourceFrameLabel} capture"
        />
        <img
          class="source-reader-exit-book-frame"
          src="${activity.bookImagePath}"
          alt=""
          aria-hidden="true"
          data-source-image="DEFINEBITSJPEG3 id ${String(activity.sourceBookImageId).padStart(4, "0")} exit fade layer"
        />
        <h1 class="sr-only" tabindex="-1" data-source-reader-heading>${escapeHtml(activity.title)} · ${escapeHtml(page.title)}</h1>
        <p class="sr-only" role="status" aria-live="polite">${escapeHtml(page.title)} of ${escapeHtml(activity.pageCountLabel)}</p>
        <div class="sr-only" data-source-reader-accessible-copy>
          ${page.columns
            .map(
              (column, index) => `<section data-source-side="${index === 0 ? "left" : "right"}" data-source-text-ids="${column.sourceTextIds.join(",") || "none"}" data-source-image-ids="${column.sourceImageIds.join(",") || "none"}">
                ${column.heading ? `<h2>${escapeHtml(column.heading)}</h2>` : ""}
                ${column.subheading ? `<p>${escapeHtml(column.subheading)}</p>` : ""}
                ${column.body ? `<p>${formatMultilineText(column.body)}</p>` : ""}
              </section>`,
            )
            .join("")}
        </div>
        <nav class="source-reader-controls" aria-label="Source reader controls">
          <button
            class="source-reader-control source-reader-control-exit"
            type="button"
            data-action="exit"
            data-source-button-id="${sourceReaderExitButtonIds[routeId]}"
            data-source-action="goto bye timeline, play, then unloadMovie"
            aria-label="Exit reader"
          ><img src="${exitHoverPath}" alt="" aria-hidden="true" /><span class="sr-only">EXIT</span></button>
          ${
            previousButtonId === null
              ? ""
              : `<button
                  class="source-reader-control source-reader-control-prev"
                  type="button"
                  data-reading-route="${routeId}"
                  data-reading-page="${previousPage}"
                  data-reading-direction="previous"
                  data-source-button-id="${previousButtonId}"
                  data-source-hit-bounds="x 20.00-309.00 y 35.00-434.95"
                  aria-label="Previous spread"
                ><img src="${readerControlPrevHoverUrl}" alt="" aria-hidden="true" /><span class="sr-only">&lt; PREV</span></button>`
          }
          ${
            nextButtonId === null
              ? ""
              : `<button
                  class="source-reader-control source-reader-control-next"
                  type="button"
                  data-reading-route="${routeId}"
                  data-reading-page="${nextPage}"
                  data-reading-direction="next"
                  data-source-button-id="${nextButtonId}"
                  data-source-hit-bounds="x 327.00-624.95 y 35.00-436.95"
                  aria-label="Next spread"
                ><img src="${readerControlNextHoverUrl}" alt="" aria-hidden="true" /><span class="sr-only">NEXT &gt;</span></button>`
          }
        </nav>
      </article>
    </div>
  `;
}

function renderMusicDictionary(
  activeInstrument: DictionaryInstrument,
  helpOpen: boolean,
  helpFishVisible: boolean,
): string {
  if (helpOpen) {
    return `
      <div
        class="scene-body source-musictionary-scene source-musictionary-help-scene"
        data-source-swf="analysis/setup/app/activities/musictionary/musictionary.swf"
        data-source-state="shared help hallway${helpFishVisible ? "; question mascot visible" : ""}"
        data-source-capture="official Ruffle v0.5.0 source-runtime capture through the recovered Nutcracker2 projector"
      >
        <img class="source-musictionary-frame" src="${helpFishVisible ? musictionaryHelpFishUrl : musictionaryHelpUrl}" alt="" aria-hidden="true" />
        <h1 class="sr-only" tabindex="-1" data-source-musictionary-heading>Musictionary help</h1>
        <button
          class="source-musictionary-hit source-musictionary-help-question"
          type="button"
          data-dictionary-help-fish
          aria-label="${helpFishVisible ? "Hide" : "Show"} the Musictionary help character"
          data-source-hit-bounds="x 537-583 y 140-184"
        ></button>
        <button
          class="source-musictionary-hit source-musictionary-help-exit"
          type="button"
          data-dictionary-help-close
          aria-label="Exit Musictionary help"
          data-source-hit-bounds="x 566-640 y 450-480"
        ></button>
      </div>
    `;
  }

  return `
    <div
      class="scene-body source-musictionary-scene"
      data-source-swf="analysis/setup/app/activities/musictionary/musictionary.swf"
      data-source-player="instPlayer sprite id ${activeInstrument.sourceAssetId}"
      data-source-text-id="${activeInstrument.sourceTextId}"
      data-source-controls="EXIT text ids 0073-0075; NEXT text id 0086"
      data-source-capture="official Ruffle v0.5.0 stable fact-state source-runtime capture through the recovered Nutcracker2 projector"
      data-source-retained-gap="the source entry-preview, rhyme reveal, and character/instrument timeline motion are not reconstructed; the complete stable fact state and embedded narration are preserved"
    >
      <img class="source-musictionary-frame" src="${activeInstrument.sceneImagePath}" alt="" aria-hidden="true" />
      <h1 class="sr-only" tabindex="-1" data-source-musictionary-heading>${escapeHtml(activeInstrument.name)}</h1>
      <p class="sr-only">${escapeHtml(activeInstrument.family)}. ${escapeHtml(activeInstrument.summary)}</p>
      <button
        class="source-musictionary-hit source-musictionary-help"
        type="button"
        data-dictionary-help
        aria-label="Open Musictionary help"
        data-source-hit-bounds="x 0-72 y 0-73"
      ></button>
      <button
        class="source-musictionary-hit source-musictionary-exit"
        type="button"
        data-action="exit"
        aria-label="Exit Musictionary"
        data-source-hit-bounds="x 568-640 y 0-75"
      ></button>
      <button
        class="source-musictionary-hit source-musictionary-next"
        type="button"
        data-dictionary-next
        aria-label="Next instrument after ${escapeHtml(activeInstrument.name)}"
        data-source-hit-bounds="x 267-375 y 315-390"
      ></button>
    </div>
  `;
}

function renderSuitePlayer(activeTrackId: string | null, isPlaying: boolean): string {
  const activeTrack = activeTrackId ? getSuiteTrack(activeTrackId) : null;
  const playbackLabel = activeTrack
    ? activeTrack.audioPath
      ? `${activeTrack.collectionTitle}: ${activeTrack.title}. ${isPlaying ? "Playing" : "Paused"}.`
      : `${activeTrack.collectionTitle}: ${activeTrack.title}. Recovered source audio theme${activeTrack.number}.mp3 is missing.`
    : "Choose one of the sixteen source records.";
  const platterAction = activeTrack?.audioPath ? (isPlaying ? "suite-stop" : "suite-play") : "";
  const platterLabel = activeTrack?.audioPath
    ? isPlaying
      ? `Pause ${activeTrack.title}`
      : `Play ${activeTrack.title}`
    : "Drop a record on the gramophone";

  return `
    <div
      class="scene-body source-listening-room"
      data-source-swf="analysis/setup/app/activities/originals/gramophone.swf"
      data-source-frame="official Ruffle v0.5.0 neutral root-state source-runtime capture"
      data-source-action="16 draggable lp instances load activities/originals/theme{iam}.mp3; player states are pauseLP and playLP; dynamic labels are discTitle and discName"
      data-source-missing-audio="the recovered source tree contains theme1.mp3 through theme8.mp3 only; theme9.mp3 through theme16.mp3 remain selectable but cannot play"
      data-source-retained-gap="record movement and tonearm animation are not reconstructed over the exact neutral source capture"
    >
      <img class="source-listening-frame" src="${listeningRoomSourceUrl}" alt="" aria-hidden="true" />
      <h1 class="sr-only">The Listening Room</h1>
      <p class="sr-only" aria-live="polite" data-suite-status>${escapeHtml(playbackLabel)}</p>
      <section class="source-record-shelf" aria-label="Sixteen source records">
        ${suiteTracks.map((track) => renderSuiteTrackButton(track, activeTrack?.id ?? null)).join("")}
      </section>
      <button
        class="source-listening-platter ${isPlaying ? "suite-stop-button" : "suite-play-button"}"
        type="button"
        data-suite-drop
        ${platterAction ? `data-action="${platterAction}"` : ""}
        aria-label="${escapeHtml(platterLabel)}"
        data-source-instance="hole sprite id 0050 at x 151.20 y 334.30 scale 1.525"
      ></button>
      <button class="source-listening-exit" type="button" data-action="exit" aria-label="Exit the Listening Room"><span class="sr-only">EXIT</span></button>
    </div>
  `;
}

function renderSuiteTrackButton(track: SuiteTrack, activeTrackId: string | null): string {
  const placement = suiteRecordPlacements.find((candidate) => candidate.trackNumber === track.number);
  if (!placement) {
    throw new Error(`Missing source placement for suite track ${track.number}`);
  }
  const [scaleX, skewY, skewX, scaleY] = placement.matrix;
  const hitX = placement.hitX ?? placement.x;
  const hitY = placement.hitY ?? placement.y;
  const hitWidth = placement.hitWidth ?? 86;
  return `
    <button
      class="source-record"
      type="button"
      draggable="true"
      data-suite-track="${track.id}"
      aria-pressed="${track.id === activeTrackId}"
      aria-label="${track.number}. ${escapeHtml(track.collectionTitle)}, ${escapeHtml(track.title)}${track.audioPath ? "" : "; recovered source audio is missing"}"
      style="left: ${hitX}px; top: ${hitY}px; --source-hit-width: ${hitWidth}px"
      data-source-placement="${placement.sourceInstance} sprite id ${String(placement.sourceSpriteId).padStart(4, "0")} at depth ${String(placement.depth).padStart(4, "0")} matrix ${scaleX} ${skewX} ${skewY} ${scaleY} x ${placement.x.toFixed(2)} y ${placement.y.toFixed(2)}"
      data-source-action="loads activities/originals/theme${track.number}.mp3 and updates discTitle/discName"
      data-source-audio="${track.audioPath ? "recovered" : "missing"}"
    >
      <span class="sr-only">${track.number}. ${escapeHtml(track.collectionTitle)}, ${escapeHtml(track.title)}${track.audioPath ? `, ${formatDuration(track.durationSeconds)}` : ", source audio missing"}</span>
    </button>
  `;
}

function renderNutcrackerChooser(progress: ReturnType<ProgressStoreController["getSnapshot"]>): string {
  return `
    <div class="scene-body chooser-scene nutcracker-chooser source-flash-scene">
      <img
        class="nutcracker-chooser-source-frame"
        src="${nutChooserSourceNormalUrl}"
        alt=""
        aria-hidden="true"
        data-source-classification="SWF-derived recreation"
        data-source-method="source-runtime capture"
        data-source-swf="analysis/setup/app/games/nutcrackergame/nutchooser.swf"
        data-source-frame="normal chooser state after the source intro mascot clears; dynamic opened-door and magic-key layers excluded"
        data-source-capture="official Ruffle v0.5.0 lossless 1280 x 960 DPR-2 source-runtime capture downsampled to the native 640 x 480 stage and stripped of PNG metadata"
        data-source-image="complete source frame preserves the hallway, source color transforms, ornamental frame, instrument bed, Help control, and EXIT control that the earlier child-layer composition did not flatten exactly"
      />
      <p class="sr-only">Nutcracker song doors</p>
      <div class="nutcracker-door-grid" aria-label="Nutcracker song doors">
        ${nutcrackerSongGames
          .map((song) => {
            const door = song.id as DoorKey;
            const completed = progress.nutDoors[door];
            const unlocked = isNutcrackerDoorUnlocked(progress, song.id);
            const status = completed ? "Cleared" : unlocked ? "Ready" : "Locked";
            const state = completed ? "cleared" : unlocked ? "ready" : "locked";
            return `
              <article
                class="nutcracker-door-card"
                style="${getNutcrackerDoorStyle(song.id)}"
                aria-label="Door ${door} ${escapeHtml(song.title)}"
                data-source-placement="${escapeHtml(getNutcrackerDoorSourcePlacement(song.id))}"
                data-source-action="on load derives iam from instance name m# and sets this._visible from _root.door# loaded from games/data/nutdoors.txt"
              >
                <button
                  class="door-button nutcracker-door-button"
                  type="button"
                  data-nutcracker-door="${song.id}"
                  data-door-state="${state}"
                  aria-label="Door ${door}: ${escapeHtml(song.title)}. ${status}."
                  ${unlocked ? "" : "disabled"}
                >
                  <img
                    class="chooser-door-art"
                    src="${chooserOpenDoorUrl}"
                    style="${getNutcrackerDoorArtStyle(song.id)}"
                    alt=""
                    aria-hidden="true"
                    data-source-classification="swf-derived recreation"
                    data-source-crop="100 x 190 source-local crop at x 130 y 105 from the 512 x 512 sprite id 0080 render"
                    data-source-image="source-local crop of nutchooser.swf movie clip id 0080 transformed by the recovered m# root matrix; visible only when the recovered door# completion flag equals 1; no modern hover glow, drop shadow, status label, disabled opacity, or disabled background"
                    ${completed ? "" : "hidden"}
                  />
                </button>
                <button
                  class="media-button door-preview-button sr-only"
                  type="button"
                  data-nutcracker-preview="${song.id}"
                  ${unlocked ? "" : "disabled"}
                >
                  Preview
                </button>
              </article>
            `;
          })
          .join("")}
      </div>
      ${renderChooserSourceControls()}
      ${renderChooserMagicKey(progress)}
      ${renderNutcrackerFlyingHelp("chooser")}
    </div>
  `;
}

function renderChooserMagicKey(progress: ReturnType<ProgressStoreController["getSnapshot"]>): string {
  const visible = progress.openedNutDoorCount === nutcrackerSongGames.length;
  return `
    <img
      class="nutcracker-chooser-magic-key"
      src="${chooserMagicKeyUrl}"
      alt=""
      aria-hidden="true"
      data-source-classification="swf-derived recreation"
      data-source-instance="magicKey"
      data-source-visible="${visible ? "true" : "false"}"
      data-source-placement="nutchooser.swf places magicKey sprite id 0213 at depth 0175 matrix scale 0.642 x 316.05 y 175.80 ratio 5"
      data-source-action="on load reads _level0.nutDoorsVisited; sets this._visible to 1 only when nutDoorsVisited equals 8, otherwise 0"
      data-source-image="sprite id 0213 rendered in swfcombine wrapper -X 180 -Y 180 -x 80 -y 90 to avoid negative-coordinate clipping; trimmed output promoted by npm run assets:nutcracker-ui"
      ${visible ? "" : "hidden"}
    />
  `;
}

function renderM07SourceFrame(game: "melody" | "memory" | "tree" | "flying", sourceSwf: string): string {
  return `
    <img class="m07-stage" src="${getM07Asset(`/${game}-stage.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}"
      data-source-image="repaired source-local DefineBitsJPEG3 stage image promoted by npm run assets:m07" />
    <img class="m07-curtain" src="${getM07Asset(`/${game}-curtain.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}"
      data-source-image="source-local repaired DefineBitsJPEG3 curtain image; source-local promotion retained even where pixels match another game" />
    <img class="m07-frame-top" src="${getM07Asset(`/${game}-frame-top.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}" />
    <img class="m07-frame-medallion" src="${getM07Asset(`/${game}-frame-medallion.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}" />
    <img class="m07-frame-bottom" src="${getM07Asset(`/${game}-frame-bottom.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}" />
  `;
}

function renderTriviaGame(state: ShellState, unlocked: boolean): string {
  const question = getTriviaQuestion(state.triviaQuestionIndex);
  const feedbackText =
    state.triviaFeedback === "correct"
      ? question.successText ?? "Congratulations!!!"
      : state.triviaFeedback === "wrong"
        ? question.failureText ?? "Sorry, try again"
        : "";

  return `
    <div class="scene-body m07-scene m07-trivia-scene" data-source-swf="analysis/setup/app/games/trivia/trivia.swf"
      data-source-frame="root frame 20 question state" data-source-classification="swf-derived recreation">
      <img class="m07-trivia-book" src="${getM07Asset("/trivia-book.png")}" alt="" aria-hidden="true"
        data-source-classification="original asset" data-source-image="repaired trivia DefineBitsJPEG3 id 0005 at full 640 x 480" />
      <section class="m07-trivia-question" tabindex="-1" data-source-trivia-question
        data-source-placement="question edit text id 0109 at x 132.40 y 66.05 on root frame 20">
        <p>${formatMultilineText(question.prompt)}</p>
      </section>
      <div class="m07-trivia-options" role="group" aria-label="Answers"
        data-source-placement="b1-b4 at x 373.25 and y 89.95, 144.00, 199.80, 265.20; scale 0.872">
        ${question.options
          .map(
            (option, index) => `<button class="m07-trivia-answer" type="button" data-trivia-answer="${index + 1}"
              ${state.triviaFeedback ? "disabled" : ""}>${formatMultilineText(option)}</button>`,
          )
          .join("")}
      </div>
      <dl class="m07-trivia-score" data-source-placement="correctQ x 150 y 308; wrongQ x 146 y 345">
        <div><dt>CORRECT</dt><dd>${state.triviaCorrectCount}</dd></div>
        <div><dt>WRONG</dt><dd>${state.triviaWrongCount}</dd></div>
      </dl>
      <p class="m07-feedback m07-trivia-feedback" aria-live="polite">${escapeHtml(feedbackText)}</p>
      ${
        state.triviaFeedback
          ? `<button class="m07-source-button m07-trivia-next" type="button" data-trivia-next>${
              state.triviaFeedback === "correct" ? "NEXT" : "AGAIN"
            }</button>`
          : ""
      }
      ${unlocked ? '<p class="m07-source-reward" data-source-key="gameKey9">CONGRATULATIONS!</p>' : ""}
    </div>
  `;
}

const melodyKeyboardHitTargets = [
  [1, 12.8, 14.6, 56.8, 133.1],
  [2, 44.5, 10.1, 39.3, 73.1],
  [3, 59, 11.8, 58.7, 126.4],
  [4, 87.5, 10.4, 44.3, 70.3],
  [5, 106.1, 10.1, 46.7, 123],
  [6, 140.8, 10.3, 50.4, 116.7],
  [7, 168.5, 8.9, 33.9, 66.2],
  [8, 177.9, 10.2, 50.8, 112.7],
  [9, 208, 8.4, 34, 75.7],
  [10, 222.3, 9.2, 50.7, 107.7],
  [11, 244.9, 9.5, 38.6, 58.7],
  [12, 266.1, 8.6, 37, 103],
  [13, 294.1, 7.7, 38, 101.2],
  [14, 306.1, 11.3, 35.5, 53.5],
  [15, 321.6, 6.6, 46.3, 100.5],
  [16, 345.8, 8.6, 33.1, 54.6],
  [17, 355.9, 6.6, 36.4, 98],
] as const;

function renderMelodyGame(state: ShellState, unlocked: boolean): string {
  const sequences = getMelodySequences(state.melodyDifficulty);
  const sequence = sequences[state.melodySequenceIndex % Math.max(sequences.length, 1)];
  const finalSequence = state.melodySequenceIndex >= sequences.length - 1;
  const levelLabels: readonly [MelodyDifficulty, string][] = [
    ["beg", "Beginner"],
    ["easy", "Easy"],
    ["inter", "Intermediate"],
    ["adv", "Advanced"],
  ];
  const selectedLevelLabel = levelLabels.find(([difficulty]) => difficulty === state.melodyDifficulty)?.[1] ?? "Beginner";

  return `
    <div class="scene-body m07-scene m07-melody-scene" data-source-swf="analysis/setup/app/games/melody/melody.swf"
      data-source-frame="${state.melodyStarted ? "root frame 2 label init; new_seq frame 8; fin frame 13" : "root frame 1 level chooser"}">
      ${renderM07SourceFrame("melody", "analysis/setup/app/games/melody/melody.swf")}
      ${
        state.melodyStarted
          ? `<section class="m07-melody-board" tabindex="-1" data-source-melody-board aria-label="Funky Monkey melody sequence">
              <img class="m07-melody-monkey" src="${getM07Asset("/melody-monkey.png")}" alt="" aria-hidden="true"
                data-source-classification="swf-derived recreation"
                data-source-image="makaka sprite id 0170 frame 1, cropped from a centered 2048 x 2048 SWFTools wrapper and mirrored by the root -0.703 x scale"
                data-source-placement="makaka sprite id 0170 scale -0.703/0.703 x 250.20 y 220.15" />
              <div class="m07-melody-progress" data-source-placement="LEVEL text id 0302 instance x 452.05 plus internal x 44.00; level value x 452.05 y 125; MELODY text id 0298 instance x 454.05 plus internal x 37.35; sequence x 484.95, of instance x 513.45 plus internal x 4.50, total x 535.95 y 194.10">
                <span class="m07-melody-level-label">LEVEL</span>
                <strong>${escapeHtml(selectedLevelLabel)}</strong>
                <span class="m07-melody-sequence-label">MELODY</span>
                <span class="m07-melody-sequence-count"><b class="m07-melody-current-sequence">${Math.min(state.melodySequenceIndex + 1, sequences.length)}</b><i>of</i><b class="m07-melody-total-sequences">${sequences.length}</b></span>
              </div>
              ${
                !state.melodyFeedback && !state.melodyDemoPlaying && !state.melodyInputEnabled
                  ? `<button class="m07-melody-start" type="button" data-melody-start
                      data-source-classification="original source text"
                      data-source-placement="start_btn sprite id 0297 at x 327.95 y 98.65; text id 0291">Begin the game</button>`
                  : ""
              }
              <div class="m07-melody-keyboard" data-source-melody-keyboard
                data-source-placement="keyboard sprite id 0290 scale 1.583 x 317.95 y 370.35"
                data-source-fallback="source key hit sprites retain unavailable button/timeline states; transparent DOM hit targets preserve pointer and keyboard input over the promoted source keyboard art">
                <img src="${getM07Asset("/melody-keyboard.png")}" alt="" aria-hidden="true"
                  data-source-classification="swf-derived recreation"
                  data-source-image="keyboard sprite id 0290 recovered from a centered wrapper crop; button-backed missing children remain interactive DOM hit targets" />
                <div class="m07-melody-key-targets">
                  ${melodyKeyboardHitTargets.map(([note, x, y, width, height]) => `<button type="button" data-melody-note="${note}"
                    style="--melody-key-x:${x}px;--melody-key-y:${y}px;--melody-key-width:${width}px;--melody-key-height:${height}px"
                    ${state.melodyFeedback || state.melodyDemoPlaying || !state.melodyInputEnabled ? "disabled" : ""}
                    aria-label="Note ${note}"></button>`).join("")}
                </div>
              </div>
              <p class="m07-feedback${finalSequence ? " is-final" : ""}" aria-live="polite">${state.melodyFeedback ? "CONGRATULATIONS!" : ""}</p>
              ${state.melodyFeedback ? `<button class="m07-melody-next${finalSequence ? " is-final" : ""}" type="button" data-melody-next>${finalSequence ? "NEW GAME" : "CONTINUE"}</button>` : ""}
              ${unlocked ? '<span class="sr-only" data-source-key="gameKey5">Game key 5 unlocked.</span>' : ""}
              <span class="sr-only" aria-live="polite">${
                state.melodyDemoPlaying
                  ? "Melody demonstration playing."
                  : state.melodyInputMistake
                    ? "That note was not next. Try the same note again."
                    : state.melodyFeedback
                      ? "CONGRATULATIONS!"
                      : state.melodyInputEnabled
                        ? `Note ${state.melodyInput.length + 1} of ${sequence?.tokens.length ?? 0}.`
                        : "Demonstration complete. Begin the game."
              }</span>
              <span class="sr-only">${sequence ? `Sequence ${sequence.id} has ${sequence.tokens.length} notes.` : "No sequence loaded."}</span>
            </section>`
          : `<section class="m07-melody-levels" data-source-melody-levels
              data-source-placement="root frame 1 level sprite id 0021 at x 331.25 y 223.90; source text id 0004 and button ids 0008, 0012, 0016, 0020">
              <p>Select level:</p>
              <div>
                ${levelLabels
                  .map(
                    ([difficulty, label]) => `<button type="button" data-melody-difficulty="${difficulty}">${label}</button>`,
                  )
                  .join("")}
              </div>
            </section>`
      }
    </div>
  `;
}

function renderMemoryGame(state: ShellState, unlocked: boolean): string {
  const pairCount = memoryPairsForLevel(state.memoryLevel);
  const columns = pairCount <= 6 ? 4 : pairCount <= 10 ? 5 : 6;
  const backUrl = getM07Asset("/memory-card-back.png");

  return `
    <div class="scene-body m07-scene m07-memory-scene" data-source-swf="analysis/setup/app/games/memorygame/memory.swf"
      data-source-frame="root frames 1-4; initial ncol 4 nrow 3 pairs 5 errors pairs plus floor(pairs / 2)">
      ${renderM07SourceFrame("memory", "analysis/setup/app/games/memorygame/memory.swf")}
      <dl class="m07-memory-status">
        <div><dt>errors left :</dt><dd>${state.memoryErrorsLeft}</dd></div>
        <div><dt>level :</dt><dd>${state.memoryLevel}</dd></div>
      </dl>
      <div class="m07-memory-board" data-source-memory-board style="--memory-columns: ${columns}"
        data-source-placement="initial card matrix is 4 columns x 3 rows inside the 385 x 360 source play region">
        ${state.memoryDeck
          .map((card) => {
            const showing = state.memoryRevealed.includes(card.id) || state.memoryMatchedPairs.includes(card.pairId);
            return `<button class="m07-memory-card" type="button" data-memory-card="${card.id}"
              aria-label="Card ${card.id}${showing ? `, pair ${card.pairId}` : ""}"
              ${state.memoryFeedback === "loss" || state.memoryFeedback === "level-complete" || state.memoryFeedback === "win" || state.memoryMatchedPairs.includes(card.pairId) ? "disabled" : ""}>
              <img src="${showing ? card.faceUrl : backUrl}" alt="" aria-hidden="true"
                data-source-classification="swf-derived recreation"
                data-source-image="${showing ? `memory card face sprite id 0057 frame ${card.pairId}` : "memory card back sprite id 0061"}" />
            </button>`;
          })
          .join("")}
      </div>
      <p class="m07-feedback m07-memory-feedback" aria-live="polite">${
        state.memoryFeedback === "match"
          ? "CORRECT"
          : state.memoryFeedback === "miss"
            ? "TRY AGAIN"
            : state.memoryFeedback === "loss"
              ? "PLAY AGAIN"
              : state.memoryFeedback === "level-complete"
                ? "NEXT LEVEL"
                : state.memoryFeedback === "win"
                  ? "CONGRATULATIONS!"
                  : ""
      }</p>
      ${state.memoryFeedback === "level-complete" ? '<button class="m07-source-button m07-memory-next" type="button" data-memory-next>NEXT LEVEL</button>' : ""}
      ${state.memoryFeedback === "loss" || state.memoryFeedback === "win" ? `<button class="m07-source-button" type="button" data-memory-reset>${state.memoryFeedback === "win" ? "NEW GAME" : "PLAY AGAIN"}</button>` : ""}
      ${unlocked ? '<p class="m07-source-reward" data-source-key="gameKey2">NEW GAME</p>' : ""}
    </div>
  `;
}

function renderTreeGame(state: ShellState, unlocked: boolean): string {
  const placements = [
    [97.75, 188.45], [160.9, 190.65], [245.85, 170.65], [68.9, 303.5],
    [137.5, 316.8], [226.95, 268.65], [304.55, 255.5], [91.3, 441.95],
    [159.8, 438.35], [208.2, 419.3], [260.2, 388.05], [309.2, 397.35],
  ] as const;
  const currentRound = Math.min(state.treeRoundIndex, 2);
  const actorAssets = [
    getM07Asset("/tree-mouse-king.png"),
    getM07Asset("/tree-nutcracker.png"),
    getM07Asset("/tree-ballerina.png"),
  ] as const;
  const actorNames = ["Mouse King", "Nutcracker", "Ballerina"] as const;
  const actorSpriteIds = [33, 23, 44] as const;
  const actorTrimBounds = [
    { x: -37, y: -127, width: 73, height: 136 },
    { x: -49, y: -115, width: 82, height: 123 },
    { x: -45, y: -139, width: 63, height: 148 },
  ] as const;
  const optionRotations = [-7, 5, -3, 8] as const;
  const showChoices = state.treePhase === "choosing" || (state.treePhase === "answering" && state.treeFeedback === "wrong");
  const announcement = state.treePhase === "prompting"
    ? `Listen for ${actorNames[currentRound]}.`
    : state.treeFeedback === "wrong"
      ? "That was not the matching sound. Try the same round again."
      : state.treePhase === "level-complete"
        ? `Sound set ${state.treeVariant} complete. Next level.`
        : state.treePhase === "complete"
          ? "Game key 8 earned."
          : state.treePhase === "choosing"
            ? `Find ${actorNames[currentRound]} on the tree.`
            : "Start the recovered sound sequence.";

  return `
    <div class="scene-body m07-scene m07-tree-scene" data-source-swf="analysis/setup/app/games/tree/tree.swf"
      data-source-frame="ini frame 1; beg frame 2; win frame 18; go_out frame 39; goOut frame 46">
      ${renderM07SourceFrame("tree", "analysis/setup/app/games/tree/tree.swf")}
      <div class="m07-tree-source-scene" tabindex="-1" data-source-tree-scene>
        <img class="m07-tree-sky" src="${getM07Asset("/tree-sky-gradient.png")}" alt="" aria-hidden="true" data-source-classification="swf-derived recreation" data-source-image="source shape id 0001" />
        <img class="m07-tree-hall-color" src="${getM07Asset("/tree-hallway-color.png")}" alt="" aria-hidden="true" data-source-classification="swf-derived recreation" data-source-image="source shape id 0003" />
        <img class="m07-tree-hall-line" src="${getM07Asset("/tree-hallway-line-art.png")}" alt="" aria-hidden="true" data-source-classification="original asset" data-source-image="repaired DefineBitsJPEG3 id 0004 with alpha" />
        <img class="m07-tree-door" src="${getM07Asset("/tree-door-blue.png")}" alt="" aria-hidden="true" data-source-classification="swf-derived recreation" data-source-image="source shape id 0002" />
        <img class="m07-tree-branch" src="${getM07Asset("/tree-branch.png")}" alt="" aria-hidden="true" data-source-classification="swf-derived recreation" data-source-image="source shape id 0007" />
        <div class="m07-tree-cast" aria-hidden="true" data-source-placement="per_1 sprite 0033 x477.10 y431.25; per_2 sprite 0023 x560.15 y433.25; per_3 sprite 0044 x398.65 y436.30">
          <img class="m07-tree-cast-mouse" src="${actorAssets[0]}" alt="" data-source-sprite="id 0033 per_1" />
          <img class="m07-tree-cast-nutcracker" src="${actorAssets[1]}" alt="" data-source-sprite="id 0023 per_2" />
          <img class="m07-tree-cast-ballerina" src="${actorAssets[2]}" alt="" data-source-sprite="id 0044 per_3" />
        </div>
        ${placements
          .map(([x, y], index) => {
            const round = Math.floor(index / 4);
            const option = (index % 4) + 1;
            const active = showChoices && state.treeRoundIndex < 3 && round === currentRound;
            const selected = active && state.treeSelectedOption === option;
            const trim = actorTrimBounds[round];
            return `<button class="m07-tree-option" type="button" data-tree-option="${option}" data-tree-round="${round}"
              style="left:${x}px;top:${y}px;--tree-option-x:${trim.x * 0.8}px;--tree-option-y:${trim.y * 0.8}px;--tree-option-origin-x:${trim.x * -0.8}px;--tree-option-origin-y:${trim.y * -0.8}px;--tree-option-width:${trim.width * 0.8}px;--tree-option-height:${trim.height * 0.8}px" aria-label="Sound choice ${option}, round ${round + 1}"
              data-source-placement="pl_${index + 1} x ${x} y ${y}; source clone scale 80 and random rotation -10..10"
              data-source-actor="per_${round + 1} sprite id ${actorSpriteIds[round]}" data-source-trim-bounds="${trim.width}x${trim.height} x${trim.x} y${trim.y}"
              data-visible="${active}" data-selected="${selected}"
              ${active && state.treePhase === "choosing" ? "" : "disabled"}>
                <img src="${actorAssets[round]}" alt="" aria-hidden="true" style="--tree-option-rotation:${optionRotations[option - 1]}deg" />
              </button>`;
          })
          .join("")}
        ${state.treePhase === "complete" ? `<img class="m07-tree-magic-key" src="${getM07Asset("/tree-magic-key.png")}" alt="" aria-hidden="true" data-source-sprite="magicKey id 0178 root x322.35 y229.20 scale1.806" />` : ""}
      </div>
      ${state.treePhase === "ready" ? '<button class="m07-source-button m07-tree-prompt" type="button" data-tree-prompt data-source-control="strt_btn sprite id 0047 root x330.90 y123.45; button child id 0046 does not flatten locally">START</button>' : ""}
      ${state.treePhase === "level-complete" ? '<button class="m07-source-button m07-tree-next-level" type="button" data-tree-next-level data-source-text="ids 0180-0182">NEXT LEVEL</button>' : ""}
      <p class="sr-only" aria-live="polite">${announcement}</p>
      ${unlocked ? '<span class="sr-only" data-source-key="gameKey8">Game key 8 is saved.</span>' : ""}
    </div>
  `;
}

function renderFlyingInstruments(state: ShellState, unlocked: boolean): string {
  const sequence = getFlyingInstrumentSequence(state.flyingLevel);
  const targetCount = sequence.length;
  const instrument = sequence[state.flyingInstrumentIndex] ?? null;
  const choosing = state.flyingPhase === "choosing";
  const gridAsset = getM07Asset(`/flying-grid-level-${state.flyingLevel}.png`);
  const controlButton = (
    className: string,
    attribute: string,
    bodyAsset: string,
    labelAsset: string,
    accessibleLabel: string,
  ) => `<button class="m07-flying-source-control ${className}" type="button" ${attribute}
      aria-label="${accessibleLabel}" data-source-classification="source child-layer composition">
        <img class="m07-flying-control-body" src="${getM07Asset(bodyAsset)}" alt="" aria-hidden="true" />
        <img class="m07-flying-control-label" src="${getM07Asset(labelAsset)}" alt="" aria-hidden="true" />
      </button>`;
  const cells = state.flyingGrid
    .map((instrumentId, index) => {
      if (instrumentId === null) return "";
      const cellInstrument = getFlyingInstrumentById(instrumentId);
      const column = index % 4;
      const row = Math.floor(index / 4);
      const matching = state.flyingPhase === "matching"
        && column + 1 === state.flyingColumn
        && (row === state.flyingRow || row === state.flyingRow + 1);
      return `<img class="m07-flying-cell-instrument${matching ? " is-matching" : ""}" src="${cellInstrument.imageUrl}" alt=""
        aria-hidden="true" style="--flying-column:${column};--flying-row:${row}"
        data-source-instrument="${instrumentId}" data-source-family="${cellInstrument.family}" />`;
    })
    .join("");
  const currentPiece = instrument && (state.flyingPhase === "playing" || state.flyingPhase === "paused")
    ? `<img class="m07-flying-cell-instrument is-falling" src="${instrument.imageUrl}" alt="" aria-hidden="true"
        style="--flying-column:${state.flyingColumn - 1};--flying-row:${state.flyingRow}"
        data-source-instrument="${instrument.id}" data-source-family="${instrument.family}" />`
    : "";

  return `
    <div class="scene-body m07-scene m07-flying-scene" data-source-swf="analysis/setup/app/games/flyinginstruments/flyinginstruments.swf"
      data-source-frame="${choosing ? "chooseLevel frame 2" : `playLevel${state.flyingLevel} frame ${state.flyingLevel + 2}`}"
      data-flying-phase="${state.flyingPhase}">
      <img class="m07-flying-room" src="${getM07Asset("/flying-room-background.png")}" alt="" aria-hidden="true"
        data-source-classification="swf-derived recreation" data-source-sprite="id 0172 root x326.25 y252 scale0.469 with source root CXForm green0.6 blue0.9 applied" />
      ${renderM07SourceFrame("flying", "analysis/setup/app/games/flyinginstruments/flyinginstruments.swf")}
      <section class="m07-flying-board" data-source-flying-grid
        data-source-classification="source-backed display-list reconstruction"
        data-source-action="placeFlyingINST starts column 2 row 0; 4 columns x 7 rows at 60-unit spacing; left/right/down controls; checkSolution compares the landed family with the cell below and clears matches after 1000ms">
        ${
          choosing
            ? `<div class="m07-flying-chooser" data-source-state="chooseLevel frame 2">
                <div class="m07-flying-heading" aria-label="CHOOSE A GAME TO PLAY" data-source-text="ids 0275 and 0276">
                  <img src="${getM07Asset("/flying-choose-heading-shadow.png")}" alt="" aria-hidden="true" />
                  <img src="${getM07Asset("/flying-choose-heading.png")}" alt="" aria-hidden="true" />
                </div>
                <div class="m07-flying-levels" aria-label="Choose a level" data-source-sprite="chooser id 0214; L1/L2/L3 sprites 0205/0209/0213">
                  ${([1, 2, 3] as const).map((level) => `<button type="button" data-flying-level="${level}" aria-label="Level ${level}">
                    <img src="${getM07Asset(`/flying-level-${level}.png`)}" alt="" aria-hidden="true" />
                  </button>`).join("")}
                </div>
              </div>`
            : `<img class="m07-flying-grid-art" src="${gridAsset}" alt="" aria-hidden="true"
                data-source-classification="swf-derived recreation" data-source-sprite="id ${state.flyingLevel === 1 ? "0320" : state.flyingLevel === 2 ? "0324" : "0325"} root x204.9 y20.05 scale0.917" />
              <div class="m07-flying-grid-pieces" aria-label="Flying instrument play grid">
                ${cells}${currentPiece}
              </div>
              <div class="m07-flying-score" aria-label="Points ${state.flyingScore}" data-source-sprite="score id 0170 root x467.20 y172.50">
                <img src="${getM07Asset("/flying-points-label.png")}" alt="" aria-hidden="true" />
                <span>${state.flyingScore}</span>
              </div>
              ${
                state.flyingPhase === "ready"
                  ? controlButton("m07-flying-start", "data-flying-start", "/flying-start-button-body.png", "/flying-start-label.png", "Start")
                  : ""
              }
              ${
                state.flyingPhase === "playing"
                  ? `<div class="m07-flying-controller" data-source-sprite="controller id 0165 root x265.70 y415.05">
                      <img src="${getM07Asset("/flying-controller-arrows.png")}" alt="" aria-hidden="true" />
                      <button type="button" data-flying-left aria-label="Move left"></button>
                      <button type="button" data-flying-down aria-label="Move down"></button>
                      <button type="button" data-flying-right aria-label="Move right"></button>
                    </div>
                    <button class="m07-flying-pause" type="button" data-flying-pause aria-label="Pause"
                      data-source-control="pause_btn id 0146; source body shape id 0145; dynamic edit-text ids 0142-0144 do not flatten locally">
                      <img src="${getM07Asset("/flying-pause-button-body.png")}" alt="" aria-hidden="true" />
                      <span>PAUSE</span>
                    </button>`
                  : ""
              }
              ${
                state.flyingPhase === "paused"
                  ? controlButton("m07-flying-resume", "data-flying-pause", "/flying-resume-button-body.png", "/flying-resume-label.png", "Resume")
                  : ""
              }
              ${state.flyingPhase === "blocked" || state.flyingPhase === "complete"
                ? controlButton("m07-flying-restart", "data-flying-restart", "/flying-try-again-button-body.png", "/flying-try-again-label.png", "Try again")
                : ""}`
        }
        ${unlocked && !choosing ? `<img class="m07-flying-magic-key" src="${getM07Asset("/flying-magic-key.png")}" alt="" aria-hidden="true"
          data-source-key="gameKey3" data-source-sprite="magicKey id 0318 root x526.80 y106.95 scaleX -0.336 scaleY 0.336" />` : ""}
        <p class="sr-only" aria-live="polite">${
          state.flyingFeedback === "match"
            ? "Matching instrument families cleared."
            : state.flyingFeedback === "blocked"
              ? "The starting cell is blocked. Try again."
              : state.flyingFeedback === "win"
                ? "Game complete. Magic key 3 is saved."
                : state.flyingFeedback === "round-complete"
                  ? `Round complete with ${state.flyingScore} points. Try again to reach 300 points.`
                : choosing
                  ? "Choose level 1, 2, or 3."
                  : state.flyingPhase === "ready"
                    ? `Level ${state.flyingLevel} selected. Press Start.`
                    : instrument
                  ? `${escapeHtml(instrument.name)} is falling. ${Math.min(state.flyingCorrectCount, targetCount)} of ${targetCount} instruments played.`
                  : ""
        }</p>
      </section>
    </div>
  `;
}

function renderM08Frame(prefix: "childrens-album" | "orchestra", sourceSwf: string): string {
  return `
    <img class="m08-stage" src="${getM08Asset(`/${prefix}-stage.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}" />
    <img class="m08-curtain" src="${getM08Asset(`/${prefix}-curtain.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}" />
    <img class="m08-frame-top" src="${getM08Asset(`/${prefix}-frame-top.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}" />
    <img class="m08-frame-medallion" src="${getM08Asset(`/${prefix}-frame-medallion.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}" />
    <img class="m08-frame-bottom" src="${getM08Asset(`/${prefix}-frame-bottom.png`)}" alt="" aria-hidden="true"
      data-source-classification="original asset" data-source-swf="${sourceSwf}" />
  `;
}

function renderChildrensAlbum(
  state: ShellState,
  progress: ReturnType<ProgressStoreController["getSnapshot"]>,
): string {
  const song = childrensAlbumSongs[state.childrensAlbumSong - 1];
  const feedback = state.childrensAlbumFeedback === "win"
    ? "YOU FOUND GAME KEY 6"
    : state.childrensAlbumFeedback === "correct"
      ? "CORRECT — THIS DOOR IS SAVED"
      : state.childrensAlbumFeedback === "wrong"
        ? "TRY AGAIN"
        : "CHOOSE THE FOUR INSTRUMENTS YOU HEAR";
  return `
    <div class="scene-body m08-scene m08-childrens-scene"
      data-source-childrens-board tabindex="-1"
      data-source-swf="analysis/setup/app/games/childrensalbum/childrensalbum.swf"
      data-source-frame="640 x 480, 7 frames at 15 fps"
      data-source-action="select/drop instrument; preview; check; saveCADoor1..8; all eight doors grant gameKey6"
      data-source-fallback="installed swfrender crashes on the root display list; recovered child images, exact SWF text/actions, and bundled song audio are composed with DOM controls">
      ${renderM08Frame("childrens-album", "analysis/setup/app/games/childrensalbum/childrensalbum.swf")}
      <img class="m08-source-scene" src="${getM08Asset("/childrens-album-scene.png")}" alt="" aria-hidden="true"
        data-source-classification="original asset" data-source-image="DefineBitsJPEG3 id 0279" />
      <nav class="m08-door-strip" aria-label="Children's Album songs">
        ${childrensAlbumSongs.map((item) => `<button type="button" data-childrens-song="${item.id}"
          aria-pressed="${item.id === song.id}" data-door-open="${progress.childrensDoors[item.id]}">${item.id}</button>`).join("")}
      </nav>
      <h1 class="m08-title">${song.title}</h1>
      <button class="m08-source-button m08-listen" type="button" data-childrens-preview>LISTEN</button>
      <div class="m08-choice-grid m08-childrens-instruments" role="group" aria-label="Instruments"
        data-source-classification="documented fallback" data-source-provenance="eight instsound files per source song; exact binary patterns from games/data/childrensalbum.txt">
        ${childrensAlbumInstrumentLabels.map((label, index) => `<button type="button" data-childrens-instrument="${index + 1}"
          aria-pressed="${state.childrensAlbumSelections.includes(index + 1)}">${label}</button>`).join("")}
      </div>
      <button class="m08-source-button m08-check" type="button" data-childrens-check>CHECK</button>
      <p class="m08-feedback" aria-live="polite">${feedback}</p>
    </div>
  `;
}

function renderLoopyTunes(state: ShellState, unlocked: boolean): string {
  const tune = loopyTunes[state.loopyTune - 1];
  const feedback = state.loopyFeedback === "win"
    ? "ALL EIGHT TUNES COMPLETE — GAME KEY 3"
    : state.loopyFeedback === "correct"
      ? "THAT LOOP IS RIGHT"
      : state.loopyFeedback === "wrong"
        ? "TRY A DIFFERENT MIX"
        : "TURN ON THE FOUR PARTS THAT BELONG";
  return `
    <div class="scene-body m08-scene m08-loopy-scene" data-source-loopy-board tabindex="-1"
      data-source-swf="analysis/setup/app/games/loopytunes/loop${tune.id}.swf"
      data-source-action="totalLoops=8; goodLoops=4; tracks 1,3,5,7 are correct in all eight source loops; final loop grants gameKey3"
      data-source-fallback="all eight root renders terminate without a usable full board; source-local lossless/JPEG3 layers and embedded sounds are retained">
      <img class="m08-full-stage" src="${getM08Asset(`/loopy-${tune.id}-stage.png`)}" alt="" aria-hidden="true"
        data-source-classification="original asset" />
      <img class="m08-frame-medallion" src="${getM08Asset(`/loopy-${tune.id}-frame-medallion.png`)}" alt="" aria-hidden="true"
        data-source-classification="original asset" />
      <nav class="m08-door-strip" aria-label="Loopy Tunes">
        ${loopyTunes.map((item) => `<button type="button" data-loopy-tune="${item.id}" aria-pressed="${item.id === tune.id}"
          data-tune-complete="${state.loopyCompleted.includes(item.id)}">${item.id}</button>`).join("")}
      </nav>
      <h1 class="m08-title">LOOPY TUNE ${tune.id}</h1>
      <div class="m08-loop-grid" role="group" aria-label="Loop tracks"
        data-source-classification="documented fallback" data-source-provenance="myTrack1..8 ActionScript values recovered from every loop SWF">
        ${Array.from({ length: 8 }, (_item, index) => `<button type="button" data-loopy-track="${index + 1}"
          aria-pressed="${state.loopySelections.includes(index + 1)}"><span>TRACK</span>${index + 1}</button>`).join("")}
      </div>
      <button class="m08-source-button m08-check" type="button" data-loopy-check>CHECK</button>
      ${state.loopyFeedback === "correct" ? '<button class="m08-source-button m08-next" type="button" data-loopy-next>NEXT TUNE</button>' : ""}
      <p class="m08-feedback" aria-live="polite">${feedback}${unlocked ? " · KEY SAVED" : ""}</p>
    </div>
  `;
}

function renderOrchestra(state: ShellState, unlocked: boolean): string {
  const completedCount = state.orchestraCorrectIds.length;
  const feedback = state.orchestraFeedback === "win"
    ? "THE WHOLE ORCHESTRA — GAME KEY 4"
    : state.orchestraFeedback === "correct"
      ? "CORRECT — LISTEN FOR THE NEXT INSTRUMENT"
      : state.orchestraFeedback === "wrong"
        ? "THAT IS NOT THE SOUND"
        : "LISTEN, THEN CHOOSE THE INSTRUMENT";
  return `
    <div class="scene-body m08-scene m08-orchestra-scene" data-source-orchestra-board tabindex="-1"
      data-source-swf="analysis/setup/app/games/orchestragame/orchestra.swf"
      data-source-frame="640 x 480, 2095 frames at 15 fps"
      data-source-action="maxInst=18; RandomNumber chooses one remaining prompt and scans forward past completed instruments; each correct instrument counts once; goodInst==18 grants gameKey4"
      data-source-fallback="root render crashes after unresolved JPEG children; recoverable stage/frame layers, all 18 source labels, and DefineSound prompts are composed here">
      ${renderM08Frame("orchestra", "analysis/setup/app/games/orchestragame/orchestra.swf")}
      <h1 class="m08-title">THE ORCHESTRA GAME</h1>
      <button class="m08-source-button m08-listen" type="button" data-orchestra-listen ${completedCount >= 18 ? "disabled" : ""}>LISTEN ${Math.min(completedCount + 1, 18)} / 18</button>
      <div class="m08-choice-grid m08-orchestra-grid" role="group" aria-label="Orchestra instruments"
        data-source-classification="source text">
        ${orchestraInstruments.map((label, index) => `<button type="button" data-orchestra-instrument="${index + 1}"
          ${state.orchestraPromptId === null || state.orchestraCorrectIds.includes(index + 1) ? "disabled" : ""}>${label}</button>`).join("")}
      </div>
      <p class="m08-feedback" aria-live="polite">${feedback}${unlocked ? " · KEY SAVED" : ""}</p>
    </div>
  `;
}

const toySoldierSourceXs = [126.8, 178.95, 239.85, 287.85, 341.8, 398.8, 443.8, 491.3] as const;

function renderToySoldiers(state: ShellState): string {
  const activeMarchIndex = state.toyMarchIndex;
  const activeMarchNote = activeMarchIndex !== null ? state.toySoldierNotes[activeMarchIndex] : null;
  const activeMarchX = activeMarchIndex !== null ? toySoldierSourceXs[activeMarchIndex] : null;
  const activeMarchIsCorrect = activeMarchIndex !== null && activeMarchNote === activeMarchIndex + 1;
  const showMarchFeedback = state.toyPlaybackKind === "check";
  return `
    <div class="scene-body m08-scene m08-toy-scene" data-source-toy-board tabindex="-1"
      aria-busy="${state.toyPlaybackKind !== null}"
      data-source-swf="analysis/setup/app/games/toysoldiersgame/toysoldiersgame.swf"
      data-source-frame="640 x 480, one frame at 12 fps"
      data-source-action="soldier_0..7 drag between y=85 and y=300 on y_coords[i]=300-(21.5*i), then run the march check; Play Music runs correct_note=[1,2,3,4,5,6,7,8]"
      data-source-fallback="button id 0030 does not flatten locally; its recoverable child shape id 0029 is promoted for all eight keyboard-operable soldier controls">
      <img class="m08-toy-field" src="${getM08Asset("/toy-soldiers-field.png")}" alt="" aria-hidden="true"
        data-source-classification="original asset" data-source-symbol="shape id 0020" />
      <img class="m08-toy-moving-note" src="${getM08Asset("/toy-soldiers-moving-note.png")}" alt="" aria-hidden="true"
        data-source-classification="original asset" data-source-symbol="shape id 0021 in sprite id 0023 frames 1-20" />
      <img class="m08-toy-staff" src="${getM08Asset("/toy-soldiers-staff.png")}" alt="" aria-hidden="true"
        data-source-classification="original asset" data-source-symbol="shape id 0024" />
      ${showMarchFeedback && activeMarchNote !== null && activeMarchX !== null ? `<img
        class="m08-toy-feedback-flash ${activeMarchIsCorrect ? "m08-toy-correct-flash" : "m08-toy-wrong-flash"}"
        src="${getM08Asset(activeMarchIsCorrect ? "/toy-soldiers-correct-flash.png" : "/toy-soldiers-wrong-flash.png")}" alt="" aria-hidden="true"
        style="--source-x:${activeMarchX};--note:${activeMarchNote}"
        data-source-classification="original asset"
        data-source-symbol="${activeMarchIsCorrect ? "note_flash shape id 0025" : "wrong_note_flash shape id 0027"}" />` : ""}
      <div class="m08-soldiers" role="group" aria-label="Soldier pitch positions" data-source-classification="swf-derived recreation">
        ${state.toySoldierNotes.map((note, index) => `<button type="button" data-toy-soldier="${index}"
          style="--source-x:${toySoldierSourceXs[index]};--note:${note}"
          aria-label="Soldier ${index + 1}, pitch position ${note}, range 0 to 10">
          <img src="${getM08Asset("/toy-soldiers-soldier.png")}" alt="" aria-hidden="true" />
        </button>`).join("")}
      </div>
      <button class="m08-toy-play" type="button" data-toy-check aria-label="Play Music: hear the correct melody">
        <img class="m08-toy-play-body" src="${getM08Asset("/toy-soldiers-play-button-body.png")}" alt="" aria-hidden="true"
          data-source-classification="original asset" data-source-symbol="shape id 0032" />
        <img class="m08-toy-play-label" src="${getM08Asset("/toy-soldiers-play-button-label.png")}" alt="" aria-hidden="true"
          data-source-classification="original asset" data-source-symbol="text id 0034" />
      </button>
      ${state.toyFeedback === "correct" ? `<img class="m08-toy-correct-label"
        src="${getM08Asset("/toy-soldiers-correct-label.png")}" alt="CORRECT!!!!"
        data-source-classification="original asset" data-source-symbol="text id 0037, march frame 98" />` : ""}
      <p class="sr-only" role="status" aria-live="polite">${state.toyFeedback === "correct"
        ? "The soldiers are correct."
        : state.toyFeedback === "wrong"
          ? "The soldiers are not correct yet."
          : ""}</p>
    </div>
  `;
}

function renderWaltz(): string {
  return `
    <div class="scene-body m08-scene m08-waltz-scene"
      data-source-swf="analysis/setup/app/games/wedding/waltz.swf"
      data-source-frame="785 frames at 12 fps; approximately 65.4 seconds"
      data-source-action="the root timeline begins immediately with its sound stream; route entry plays bundled MP3Wedding3.wav once; no recovered gameplay or game-key action"
      data-source-fallback="the local renderer resolves only this 550 x 400 gray source surface; later timeline display objects remain unresolved">
      <img class="m08-waltz-source" src="${getM08Asset("/waltz-source-gradient.png")}" alt="" aria-hidden="true"
        data-source-classification="swf-derived recreation" data-source-symbol="root frame probe" />
    </div>
  `;
}

function renderAlicePuzzles(state: ShellState): string {
  if (state.aliceChooserOpen) {
    return `
      <div class="scene-body m08-scene m08-alice-scene m08-alice-chooser" data-source-alice-board tabindex="-1"
        data-source-swf="analysis/setup/app/games/aliceswf/alice.swf"
        data-source-frame="post-intro stable mainDialer state; chooser root has 641 frames at 15 fps"
        data-source-action="mainDialer exposes BTNgame_1 through BTNgame_12 around the clock; selecting a number sets nextGame and loads game_01.swf through game_12.swf"
        data-source-fallback="the stable chooser frame is an original SWF rendered through Ruffle 0.5.0; transparent accessible buttons preserve the recovered source hit regions">
        <img class="m08-alice-stage" src="${getM08Asset("/alice-chooser-main.png")}" alt="" aria-hidden="true"
        data-source-classification="source-runtime capture" data-source-symbol="alice.swf post-intro mainDialer" />
        <nav class="m08-alice-picker" aria-label="Alice clock puzzle selector">
          ${aliceChooserButtonPositions.map(({ puzzle, x, y }) => `<button type="button" data-alice-puzzle="${puzzle}"
            aria-label="Open Alice puzzle ${puzzle}" style="--alice-source-x:${x};--alice-source-y:${y}"><span>${puzzle}</span></button>`).join("")}
        </nav>
      </div>
    `;
  }

  return `
    <div class="scene-body m08-scene m08-alice-scene" data-source-alice-board tabindex="-1"
      data-source-swf="analysis/setup/app/games/aliceswf/alice.swf + game_${String(state.alicePuzzle).padStart(2, "0")}.swf"
      data-source-frame="chooser 800 x 600, 641 frames at 15 fps; puzzle boards 800 x 600, one frame"
      data-source-action="the chosen game supplies toy1, toy2, toy3, character1, and character2; clock_1..3 randomize toy frames 1 through 4 and call checkSolution on release; every gameCombination array is [1,1,1]"
      data-source-fallback="the complete source display list is captured through Ruffle 0.5.0 because SWFTools crashes on every puzzle root; the three source clock controls use recovered sprite id 0151 and keyboard-accessible whole-control activation that cycles frames 1 through 4 instead of replaying the source random angle mapping and pointer gesture">
      <img class="m08-alice-stage" src="${getM08Asset(`/alice-stage-${String(state.alicePuzzle).padStart(2, "0")}.png`)}" alt="" aria-hidden="true"
        data-source-classification="source-runtime capture" data-source-symbol="game_${String(state.alicePuzzle).padStart(2, "0")}.swf root frame 1 with child timelines active at capture" />
      <div class="m08-alice-dials" role="group" aria-label="Alice puzzle clocks" data-source-classification="composed source child assets">
        ${state.aliceDialValues.map((value, index) => `<button class="m08-alice-dial m08-alice-dial-${index + 1}" type="button"
          data-alice-dial="${index}" aria-label="Clock ${index + 1}, source toy frame ${value} of 4">
          <img class="m08-alice-dial-gear" src="${getM08Asset("/alice-clock-gear.png")}" alt="" aria-hidden="true" />
          <img class="m08-alice-dial-face" src="${getM08Asset("/alice-puzzle-dial.png")}" alt="" aria-hidden="true"
            style="--alice-dial-turn:${(value % 4) * 90}deg" />
        </button>`).join("")}
      </div>
      <p class="sr-only" aria-live="polite">${state.aliceFeedback === "correct"
        ? "The three Alice puzzle clocks are correct."
        : state.aliceFeedback === "wrong"
          ? "The Alice puzzle clocks are not correct yet."
          : ""}</p>
    </div>
  `;
}

function renderNutHouse(state: ShellState, unlocked: boolean): string {
  const room = Math.min(Math.max(state.nutHouseRoom, 11), 18);
  const phase = state.nutHousePhase === "tutorial" && room !== 11 ? "prompt" : state.nutHousePhase;
  const imageSuffix = phase === "playing" ? "gameplay" : phase;
  const feedback = state.nutHouseFeedback === "win"
    ? "The final mirror opens. Game key 7 is saved."
    : state.nutHouseFeedback === "correct"
      ? `Room ${room - 1} opened.`
      : state.nutHouseFeedback === "wrong"
        ? "That mirror stays closed."
        : "";
  const playingControls = phase === "playing" && state.nutHouseFeedback !== "win"
    ? `
      <div class="m08-nut-house-hit-regions" role="group" aria-label="Room ${room} mirrors">
        ${(nutHouseMirrorHitRegions[room] ?? []).map((region) => `
          <button type="button" class="m08-source-hit-region m08-nut-house-mirror"
            data-nut-house-mirror="${region.mirror}" aria-label="Mirror ${region.mirror}"
            data-source-sprite="room${room}.swf sprite ${String(region.sourceSpriteId).padStart(4, "0")}"
            data-source-hit-region="${region.x},${region.y},${region.width},${region.height}"
            data-source-classification="documented fallback"
            style="--source-left:${region.x}px;--source-top:${region.y}px;--source-width:${region.width}px;--source-height:${region.height}px;--source-shape:${region.shape}"></button>
        `).join("")}
      </div>
      <button type="button" class="m08-source-hit-region m08-nut-house-play" data-nut-house-play
        aria-label="Play this room's music"></button>
      <button type="button" class="m08-source-hit-region m08-nut-house-help" data-nut-house-help
        aria-label="Show the Nut House helper"></button>
      <button type="button" class="m08-source-hit-region m08-nut-house-exit" data-nut-house-exit
        aria-label="Exit the Nut House"></button>
    `
    : "";
  const phaseControls = phase === "tutorial"
    ? `<button type="button" class="m08-source-hit-region m08-nut-house-tutorial" data-nut-house-tutorial
        aria-label="Continue to the Nut House music prompt"></button>`
    : phase === "prompt"
      ? `<button type="button" class="m08-source-hit-region m08-nut-house-start" data-nut-house-start
          aria-label="Play the room music and enter room ${room}"></button>`
      : phase === "help"
        ? `<button type="button" class="m08-source-hit-region m08-nut-house-help-close" data-nut-house-help-close
            aria-label="Return to room ${room}"></button>`
        : phase === "exit"
          ? `<button type="button" class="m08-source-hit-region m08-nut-house-exit-yes" data-nut-house-exit-yes
              aria-label="Yes, exit the Nut House"></button>
            <button type="button" class="m08-source-hit-region m08-nut-house-exit-no" data-nut-house-exit-no
              aria-label="No, stay in the Nut House"></button>`
          : "";
  return `
    <div class="scene-body m08-scene m08-nut-house-scene" data-source-nut-house-board tabindex="-1"
      data-source-swf="analysis/setup/app/games/nuthouse/room${room}.swf"
      data-source-frame="room${room}.swf stable ${phase} state, captured at 800 x 600 through Ruffle 0.5.0 and promoted at 640 x 480"
      data-source-action="mainMusic is sound 11; maxMir=8; exact room11..18 mirror sequence 8,3,1,7,6,4,5,2; room18 grants gameKey7; openDoor persists"
      data-source-fallback="Ruffle captures resolve the full display list that local SWFTools crashes on; transparent DOM hit regions preserve keyboard access while live mirror morphs, fish motion, and success timelines remain manual-review gaps">
      <img class="m08-nut-house-source-frame" src="${getM08Asset(`/nut-house-room-${room}-${imageSuffix}.png`)}" alt="" aria-hidden="true"
        data-source-classification="original source-runtime capture" />
      ${playingControls}
      ${phaseControls}
      <p class="sr-only" aria-live="polite">${feedback || (unlocked ? "Game key 7 is saved." : "")}</p>
    </div>
  `;
}

function renderNutcrackerSongGame(
  song: NutcrackerSongGame,
  completed: boolean,
  selectedTrackNumbers: readonly NutcrackerTrackNumber[],
  feedback: string | null,
  allNutcrackerDoorsComplete: boolean,
  isPlaying: boolean,
  changePromptOpen: boolean,
  exitWarningOpen: boolean,
  helpOpen: boolean,
): string {
  const selectedTrackCount = selectedTrackNumbers.length;
  const correctRequiredCount = getCorrectNutcrackerTrackNumbers(song).length;
  const correctSelectionCount = feedback ? countCorrectSelections(song, selectedTrackNumbers) : 0;
  const incorrectSelectionCount = feedback ? Math.max(0, selectedTrackCount - correctSelectionCount) : 0;
  const hintOnly = feedback === "hint";
  const selectionCorrect = isCorrectNutcrackerSelection(song, selectedTrackNumbers);
  const showFinalKeyFrame = feedback === "ok" && allNutcrackerDoorsComplete;
  const sourceControlsBlocked = helpOpen || hintOnly || changePromptOpen || exitWarningOpen;
  const disabledSourceControl = sourceControlsBlocked ? " disabled" : "";
  const sourceMessage = feedback && !hintOnly
    ? selectionCorrect
      ? null
      : `you have ${correctSelectionCount} correct instruments and ${incorrectSelectionCount} incorrect instruments`
    : hintOnly || (selectedTrackCount > 0 && selectedTrackCount < correctRequiredCount)
      ? "All songs are played by 4 instruments!"
    : "Listen to the original song and find  4 correct instruments. Double click on the instruments or drag them onto the stage.";

  return `
    <div class="scene-body nutcracker-song-scene source-flash-scene">
      <img
        class="song-source-frame"
        src="${nutcrackerSongSourceFrameUrls[song.id]}"
        alt=""
        aria-hidden="true"
        data-source-classification="original source-runtime capture"
        data-source-image="song${song.id}/song.swf normal interactive state captured through official Ruffle v0.5.0 at DPR 2 with external character animation SWFs withheld, downsampled to 640 x 480, and metadata-stripped"
      />
      <section class="song-stage-overlay" aria-label="${escapeHtml(song.title)} track choices">
        <h1 class="sr-only">${escapeHtml(song.title)}</h1>
        <p class="song-source-message sr-only" aria-live="polite">${escapeHtml(sourceMessage ?? "")}</p>
        <div class="song-interaction-surface${sourceControlsBlocked ? " song-interaction-surface-blocked" : ""}" data-song-drop-stage="${song.id}"${sourceControlsBlocked ? ' inert aria-hidden="true"' : ""}>
        ${renderSelectedNutcrackerActors(song, selectedTrackNumbers, feedback)}
        ${song.tracks.map((track) => renderNutcrackerTrackButton(song.id, track, selectedTrackNumbers, feedback, sourceControlsBlocked)).join("")}
        ${renderNutcrackerFlyingHelp()}
        ${showFinalKeyFrame ? renderNutcrackerSongKeyFrame() : ""}
        <div class="song-actions source-song-actions${sourceControlsBlocked ? " source-song-actions-blocked" : ""}" aria-label="Source song controls">
          <button class="scene-button source-label-button source-song-help-button" type="button"${disabledSourceControl} data-action="help" data-source-control="helpButton" data-source-placement="song1/song.swf helpButton sprite id 0120 at root depth 0122 matrix scale 1.350 x 556.50 y 165.30" data-source-state="buttonON places button id 0118 depth 0001 and shape id 0119 depth 0004; normal art is baked into the complete source-runtime capture" data-source-hit-rect="532.13,141.95,51.98,38.48" data-source-help="Help" data-source-help-frame="4" data-source-help-bounds="button id 0118 pushes Help and calls _root.helpme; flyinghelp frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-source-action="sets _root.theNextFrame to helpFrame and drives _root.usmus to helpFrame/showUp">
            <span class="sr-only">HELP</span>
          </button>
          <button class="scene-button source-label-button source-song-hint-button" type="button"${disabledSourceControl} data-source-control="hintButton" data-source-placement="song1/song.swf hintButton sprite id 0127 at root depth 0127 matrix scale 1.350 x 556.35 y 267.95" data-source-state="buttonON places button id 0125 depth 0001 and shape id 0126 depth 0005; normal art is baked into the complete source-runtime capture" data-source-hit-rect="532.76,240.75,51.96,38.21" data-source-help="Hint" data-source-help-frame="4" data-source-help-bounds="button id 0125 pushes Hint and calls _root.helpme; flyinghelp frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-source-action="calls showHint and drives _root.courtain to giveHint" data-song-action="hint-song" data-song-id="${song.id}">
            <span class="sr-only">HINT</span>
          </button>
          <button class="scene-button source-label-button source-song-change-button" type="button"${disabledSourceControl} data-source-control="songChooser" data-source-placement="song1/song.swf songChooser sprite id 0133 at root depth 0133 matrix scale 1.598 x 84.10 y 163.70" data-source-state="buttonON places button id 0132 depth 0001 and shape id 0126 depth 0004; normal art is baked into the complete source-runtime capture" data-source-hit-rect="57.82,136.05,56.73,43.23" data-source-help="Select a&#10;different&#10;song" data-source-help-frame="4" data-source-help-bounds="button id 0132 pushes Select a different song and calls _root.helpme; flyinghelp frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-source-action="sets the recovered change-song message and drives _root.courtain to alert" data-song-action="confirm-change-song" data-song-id="${song.id}">
            <span class="sr-only">CHANGE SONG</span>
          </button>
          <button class="media-button source-label-button source-song-listen-button" type="button"${disabledSourceControl} data-source-control="listenSong" data-source-placement="song1/song.swf listenSong sprite id 0144 at root depth 0138 matrix scale 1.524 x 81.75 y 266.30" data-source-state="buttonON places button id 0137 depth 0001 and shape id 0126 depth 0006; songStop places button id 0143 depth 0003" data-source-hit-rect="52.18,235.59,64.39,43.13" data-source-help="${isPlaying ? "Stop the Music" : "Listen to the Original Music"}" data-source-help-frame="4" data-source-help-bounds="button id 0137 pushes Listen to the Original Music; button id 0143 pushes Stop the Music; flyinghelp frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-source-action="calls previewSong; the songStop state calls stopPreview/resumeInst/instFrameShow" data-song-action="play-theme" data-song-id="${song.id}">
            ${
              isPlaying
                ? `<img class="source-button-body" src="${songControlButtonBodyUrl}" alt="" aria-hidden="true" /><img class="source-button-label" src="${songStopLabelUrl}" alt="" aria-hidden="true" />`
                : ""
            }
            <span class="sr-only">${isPlaying ? "STOP" : "LISTEN"}</span>
          </button>
          <button class="scene-button source-label-button source-song-exit-button" type="button"${disabledSourceControl} data-source-control="quiter" data-source-placement="song1/song.swf quiter sprite id 0150 at root depth 0145 matrix scale 0.900 x 585.90 y 472.45" data-source-state="buttonON places button id 0148 depth 0001; normal EXIT art is baked into the complete source-runtime capture" data-source-hit-rect="549.72,449.05,72.36,46.89" data-source-help="Quit the Game" data-source-help-frame="3" data-source-help-bounds="button id 0148 hover action pushes Quit the Game, frame 3, and calls _root.helpme" data-source-action="sets _root.theNextFrame to warningFrame; drives _root.usmus to warningFrame/showUp" data-song-action="confirm-exit-song" data-song-id="${song.id}">
            <span class="sr-only">EXIT</span>
          </button>
          ${
            feedback && !hintOnly
              ? `<button
                  class="page-button source-label-button source-play-again-button"
                  type="button"
                  data-source-control="gameController"
                  data-source-placement="song1/song.swf gameController id 0115 depth 0116 matrix scale 1.140 x 322.20 y 317.70; buttonAgain frame places id 0114 at x -0.90 y 1.75 ratio 3"
                  data-source-body="song1/song.swf gameController buttonAgain uses button id 0114 with source shape id 0113"
                  data-song-action="reset-song"
                  data-song-id="${song.id}"
                >
                  <img class="source-button-body" src="${songPlayAgainButtonBodyUrl}" alt="" aria-hidden="true" />
                  <img class="source-button-label" src="${songPlayAgainLabelUrl}" alt="" aria-hidden="true" />
                  <span class="sr-only">PLAY AGAIN</span>
                </button>`
              : ""
          }
        </div>
        </div>
        ${sourceMessage && feedback && !sourceControlsBlocked ? renderNutcrackerHintCurtain(sourceMessage) : ""}
        ${sourceMessage && hintOnly && !helpOpen && !changePromptOpen && !exitWarningOpen ? renderNutcrackerHintCurtain(sourceMessage, song.id) : ""}
        ${changePromptOpen ? renderNutcrackerChangeSongPrompt(song.id) : ""}
        ${exitWarningOpen ? renderNutcrackerSongExitWarning(song.id) : ""}
        <p class="sr-only">${completed ? "Door cleared." : "Door ready."} Source: ${escapeHtml(song.sourcePath)}. Track streams extracted from recovered SWFs.</p>
      </section>
    </div>
  `;
}

function renderNutcrackerSongKeyFrame(): string {
  return `
    <aside
      class="source-song-keyframe"
      aria-label="Nutcracker completion key"
      data-source-frame="song1/song.swf keyFrame"
      data-source-placement="keyFrame places sprite id 0355 depth 0001 matrix scale 1.051 x -15.05 y 53.20 ratio 30; noAction id 0356 depth 0003"
      data-source-action="winner timeline calls saveNutDoor; when _level0.nutDoorsVisited equals 7 it calls saveKey1.exe, sets gameKey1, sets _root.theNextFrame to keyFrame, and drives _root.usmus to showUp"
    >
      <img
        src="${songKeyFrameTalkerUrl}"
        alt=""
        aria-hidden="true"
        data-source-image="song1/song.swf keyFrame sprite id 0355 rendered in swfcombine translated wrapper -X 700 -Y 260 -x 260 -y 120; direct render clips negative-coordinate source art"
      />
      <p class="sr-only">Nutcracker song key earned.</p>
    </aside>
  `;
}

function renderNutcrackerHintCurtain(message: string, songId?: NutcrackerSongId): string {
  return `
    <aside
      class="source-alert source-hint-alert"
      aria-label="Song hint"
      ${songId ? 'role="dialog" aria-modal="true"' : 'role="status"'}
      data-source-classification="swf-derived recreation"
      data-source-frame="song1/song.swf courtain giveHint"
      data-source-placement="courtain root id 0063 depth 0082 x 319.85 y 4.90; giveHint places source dismiss button id 0057 depth 0005, _root.message edit id 0058 depth 0007 matrix scale 0.953/0.843 x 132.90 y 96.80 ratio 14, and noAction clip id 0059 depth 0008"
    >
      ${renderNutcrackerCurtainArt()}
      <p>${escapeHtml(message)}</p>
      ${
        songId
          ? `<button
              class="source-hint-dismiss"
              type="button"
              data-song-action="dismiss-hint"
              data-song-id="${songId}"
              data-source-button="song1/song.swf courtain giveHint button id 0057 depth 0005"
              data-source-action="stopPreview; instFrameShow; restore speakers/focus/quiter buttonON; gotoAndPlay courtain bye"
              aria-label="Dismiss hint"
            ></button>`
          : ""
      }
    </aside>
  `;
}

function renderNutcrackerChangeSongPrompt(songId: NutcrackerSongId): string {
  return `
    <aside
      class="source-alert source-change-alert"
      aria-label="Change song confirmation"
      role="dialog"
      aria-modal="true"
      data-source-classification="swf-derived recreation"
      data-source-frame="song1/song.swf courtain alert"
      data-source-placement="courtain root id 0063 depth 0082 x 319.85 y 4.90; _root.message edit id 0054 depth 0012 matrix x 155.90 y 97.10 ratio 4"
    >
      ${renderNutcrackerCurtainArt()}
      <p>press "Yes" to change this song or "No" to cancel</p>
      <button class="source-alert-choice source-alert-yes" type="button" data-song-action="accept-change-song" data-song-id="${songId}">
        <img src="${songYesLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">YES</span>
      </button>
      <button class="source-alert-choice source-alert-no" type="button" data-song-action="cancel-change-song" data-song-id="${songId}">
        <img src="${songNoLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">NO</span>
      </button>
    </aside>
  `;
}

function renderNutcrackerSongExitWarning(songId: NutcrackerSongId): string {
  return `
    <aside
      class="source-song-warning-modal"
      aria-label="Exit song confirmation"
      role="dialog"
      aria-modal="true"
      data-source-classification="swf-derived recreation"
      data-source-frame="song1/song.swf warningFrame"
      data-source-placement="warningFrame places sprite id 0340 depth 0001 matrix scale 1.051 x -15.45 y 52.40 ratio 29; noAction id 0341 depth 0003 matrix scale 12.497 x -319.25 y -234.35 ratio 29; YES button id 0346 depth 0005 x -66.15 y -43.55; NO button id 0351 depth 0008 x 27.30 y -43.55; close sprite id 0352 depth 0011 x 96.30 y -143.70"
    >
      <img
        class="source-song-warningframe-talker"
        src="${songWarningframeTalkerUrl}"
        alt=""
        aria-hidden="true"
        data-source-image="song1/song.swf warningFrame sprite id 0340 rendered in swfcombine translated wrapper x 140 y 80; direct swfrender clips negative-coordinate source art"
      />
      <button
        class="source-song-warning-choice source-song-warning-yes"
        type="button"
        data-song-action="accept-exit-song"
        data-song-id="${songId}"
        data-source-button="song1/song.swf warningFrame YES button id 0346"
        data-source-body="song1/song.swf warningFrame YES visible body shape id 0344"
        data-source-action="_level0.gotoAndPlay('comeAgain')"
      >
        <img class="source-warning-button-body" src="${songWarningYesBodyUrl}" alt="" aria-hidden="true" />
        <img class="source-warning-button-label" src="${songWarningYesLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">YES</span>
      </button>
      <button
        class="source-song-warning-choice source-song-warning-no"
        type="button"
        data-song-action="cancel-exit-song"
        data-song-id="${songId}"
        data-source-button="song1/song.swf warningFrame NO button id 0351"
        data-source-body="song1/song.swf warningFrame NO visible body shape id 0349"
        data-source-action="stopPreview; resumeInst; instFrameShow; restore speakers/focus/quiter buttonON"
      >
        <img class="source-warning-button-body" src="${songWarningNoBodyUrl}" alt="" aria-hidden="true" />
        <img class="source-warning-button-label" src="${songWarningNoLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">NO</span>
      </button>
    </aside>
  `;
}

function renderNutcrackerCurtainArt(): string {
  return `
    <img
      class="source-alert-curtain-layer source-alert-curtain-fill"
      src="${songCurtainFillUrl}"
      alt=""
      aria-hidden="true"
      data-source-classification="swf-derived recreation"
      data-source-image="song1/song.swf courtain base sprite id 0042 child shape id 0038 depth 0001"
    />
    <img
      class="source-alert-curtain-layer source-alert-curtain-curve"
      src="${songCurtainCurveCxformUrl}"
      alt=""
      aria-hidden="true"
      data-source-classification="swf-derived recreation"
      data-source-image="song1/song.swf courtain base sprite id 0042 child shape id 0040 depth 0002 matrix x 2.80 y -56.45 with CXForm add 0 102 255 0"
    />
    <img
      class="source-alert-curtain-layer source-alert-curtain-stars"
      src="${songCurtainStarsUrl}"
      alt=""
      aria-hidden="true"
      data-source-classification="swf-derived recreation"
      data-source-image="song1/song.swf courtain base sprite id 0042 child shape id 0041 depth 0003"
    />
  `;
}

function renderSelectedNutcrackerActors(
  song: NutcrackerSongGame,
  selectedTrackNumbers: readonly NutcrackerTrackNumber[],
  feedback: string | null,
): string {
  return selectedTrackNumbers
    .map((trackNumber) => song.tracks.find((track) => track.number === trackNumber))
    .filter((track): track is NutcrackerTrack => track !== undefined)
    .map((track) => {
      const correctnessClass = feedback ? (track.valid ? " valid" : " invalid") : "";
      return `
        <img
          class="source-selected-actor source-selected-actor-song-${song.id} source-selected-actor-${track.number}${correctnessClass}"
          data-source-animation="${track.actorSourcePath}"
          data-source-classification="documented fallback"
          data-source-playback="${track.actorPlayback}"
          data-source-fallback="${track.actorFallbackReason}"
          src="${track.imagePath}"
          alt=""
          aria-hidden="true"
        />
      `;
    })
    .join("");
}

function renderNutcrackerTrackButton(
  songId: NutcrackerSongId,
  track: NutcrackerTrack,
  selectedTrackNumbers: readonly NutcrackerTrackNumber[],
  feedback: string | null,
  interactionBlocked: boolean,
): string {
  const selected = selectedTrackNumbers.includes(track.number);
  const feedbackClass = feedback ? (track.valid ? " valid" : selected ? " invalid" : "") : "";
  const hotspot = getTrackHotspotEvidence(track.number);

  return `
    <article
      class="track-card source-track-hotspot source-track-hotspot-${track.number}${selected ? " selected" : ""}${feedbackClass}"
      style="${formatTrackHotspotStyle(hotspot.hitRect)}"
      data-source-help="${escapeHtml(getNutcrackerSourceHelpLabel(songId, track))}"
      data-source-help-frame="${getNutcrackerSourceHelpFrame(songId, track)}"
      data-source-help-bounds="${escapeHtml(getNutcrackerSourceHelpBounds(songId, track))}"
      data-source-placement="${escapeHtml(hotspot.placement)}"
      data-source-vector-bounds="${escapeHtml(hotspot.vectorBounds)}"
      data-source-hit-rect="${escapeHtml(formatSourceRect(hotspot.hitRect))}"
    >
      <button
        class="track-select-button"
        type="button"
        ${interactionBlocked ? "disabled" : ""}
        data-song-id="${songId}"
        data-song-track="${track.number}"
        draggable="true"
        aria-pressed="${selected}"
        aria-label="Track ${track.number}: ${escapeHtml(track.instrument)}. Click to preview; double click or drag onto the stage to select. ${formatTrackStart(track)}."
      >
        <span class="sr-only">Track ${track.number}</span>
        <strong class="sr-only">${escapeHtml(track.instrument)}</strong>
        <small class="sr-only">${formatTrackStart(track)}${track.character ? ` / ${escapeHtml(track.character)}` : ""}</small>
      </button>
    </article>
  `;
}

function renderNutcrackerFlyingHelp(source: "song" | "chooser" = "song"): string {
  const sourcePlacement = source === "song"
    ? "song1/song.swf flyinghelp id 0257 depth 0306 initial matrix x 1143.85 y 195.55; helpme(a,b) sets _root.helpmessage, gotoAndStop(a), startDrag(this), _visible=1; nohelp() clears message, _visible=0, _x=10000"
    : "nutchooser.swf button ids 0200 and 0206 call _root.helpme(frame,label) and _root.nohelp(); current dumps expose the button actions but not an independent chooser flyinghelp placement, so this DOM layer is a documented helpme fallback";
  const sourceLayerModel = source === "song"
    ? "frame 2 places edit ids 0231/0232/0233 at normalized layer offsets from source matrices; frame 3 places edit ids 0234/0235/0236 at normalized offsets from negative source matrices; frame 4 places sprite id 0240, which fades nested sprite id 0239 containing edit ids 0237/0238"
    : "chooser control actions call helpme with frame 4 for Help and frame 3 for Quit the Game; no separate chooser flyinghelp display-list placement is recovered in the current dumps, so the DOM reuses the recovered song flyinghelp frame-layer fallback";
  const sourceBounds = source === "song"
    ? "frame 1 helpoff; frames 2/3 use edit text shadow stacks, frame 4 places sprite id 0240, frames 5-8 use shape ids 0241/0244/0246/0251/0252"
    : "button id 0200 calls helpme(4, Help); button id 0206 calls helpme(3, Quit the Game); rollouts call nohelp";
  return `
    <aside
      class="source-flying-help"
      aria-hidden="true"
      data-source-classification="documented fallback"
      data-source-fallback="dynamic edit text and frame-specific fading cannot be flattened by the local SWF renderer; the DOM recreates recovered edit-text layers and source frame bounds"
      data-source-control="${source === "song" ? "flyinghelp" : "chooser-helpme-fallback"}"
      data-source-placement="${sourcePlacement}"
      data-source-layer-model="${sourceLayerModel}"
      data-source-frame="1"
      data-source-bounds="${sourceBounds}"
    >
      <span class="source-flying-help-frame source-flying-help-frame-2" aria-hidden="true">
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-231"></span>
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-232"></span>
        <span class="source-flying-help-text source-flying-help-text-fill source-flying-help-text-233"></span>
      </span>
      <span class="source-flying-help-frame source-flying-help-frame-3" aria-hidden="true">
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-234"></span>
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-235"></span>
        <span class="source-flying-help-text source-flying-help-text-fill source-flying-help-text-236"></span>
      </span>
      <span class="source-flying-help-frame source-flying-help-frame-4" aria-hidden="true">
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-237"></span>
        <span class="source-flying-help-text source-flying-help-text-fill source-flying-help-text-238"></span>
      </span>
    </aside>
  `;
}

function getNutcrackerDoorStyle(songId: NutcrackerSongId): string {
  const positions: Record<NutcrackerSongId, { left: number; top: number; width: number; height: number }> = {
    1: { left: 105.02, top: 107.96, width: 77.97, height: 191.10 },
    2: { left: 447.07, top: 102.91, width: 77.97, height: 191.10 },
    3: { left: 187.93, top: 134.17, width: 47.76, height: 131.81 },
    4: { left: 393.59, top: 130.74, width: 53.21, height: 140.31 },
    5: { left: 239.34, top: 145.03, width: 28.84, height: 98.02 },
    6: { left: 361.66, top: 152.45, width: 33.93, height: 89.63 },
    7: { left: 270.60, top: 157.47, width: 20.55, height: 75.64 },
    8: { left: 341.66, top: 150.00, width: 17.03, height: 81.02 },
  };
  const position = positions[songId];
  return `left:${position.left.toFixed(2)}px;top:${position.top.toFixed(2)}px;width:${position.width.toFixed(2)}px;height:${position.height.toFixed(2)}px`;
}

function getNutcrackerDoorArtStyle(songId: NutcrackerSongId): string {
  const positions: Record<NutcrackerSongId, { left: number; top: number; width: number; height: number; mirrored: boolean }> = {
    1: { left: 14.74, top: -0.42, width: 107.70, height: 204.63, mirrored: false },
    2: { left: -36.13, top: 3.78, width: 107.70, height: 204.63, mirrored: true },
    3: { left: 3.89, top: 7.55, width: 67.40, height: 128.06, mirrored: false },
    4: { left: -15.53, top: 10.88, width: 67.30, height: 127.87, mirrored: true },
    5: { left: 2.37, top: 14.90, width: 43.70, height: 83.03, mirrored: false },
    6: { left: -15.39, top: 6.28, width: 43.60, height: 82.84, mirrored: true },
    7: { left: 5.04, top: 8.90, width: 29.30, height: 55.67, mirrored: false },
    8: { left: -11.15, top: 17.46, width: 29.30, height: 55.67, mirrored: true },
  };
  const position = positions[songId];
  return `left:${position.left.toFixed(2)}px;top:${position.top.toFixed(2)}px;width:${position.width.toFixed(2)}px;height:${position.height.toFixed(2)}px;transform:${position.mirrored ? "scaleX(-1)" : "none"}`;
}

function getNutcrackerDoorSourcePlacement(songId: NutcrackerSongId): string {
  const placements: Record<NutcrackerSongId, string> = {
    1: 'nutchooser.swf m1 id 0080 depth 0015 matrix scale 1.077 x -20.25 y -5.55 ratio 5',
    2: 'nutchooser.swf m2 id 0080 depth 0033 matrix scale -1.077 x 658.65 y -6.40 ratio 5',
    3: 'nutchooser.swf m3 id 0080 depth 0018 matrix scale 0.674 x 104.20 y 70.95 ratio 5',
    4: 'nutchooser.swf m4 id 0080 depth 0021 matrix scale -0.673 x 532.85 y 70.95 ratio 5',
    5: 'nutchooser.swf m5 id 0080 depth 0024 matrix scale 0.437 x 184.90 y 114.05 ratio 5',
    6: 'nutchooser.swf m6 id 0080 depth 0027 matrix scale -0.436 x 446.55 y 112.95 ratio 5',
    7: 'nutchooser.swf m7 id 0080 depth 0030 matrix scale 0.293 x 237.55 y 135.60 ratio 5',
    8: 'nutchooser.swf m8 id 0080 depth 0036 matrix scale -0.293 x 397.90 y 136.70 ratio 5',
  };
  return placements[songId];
}

type SourceRect = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
};

type TrackHotspotEvidence = {
  readonly placement: string;
  readonly vectorBounds: string;
  readonly hitRect: SourceRect;
};

const nutcrackerTrackHotspotEvidence: Record<NutcrackerTrackNumber, TrackHotspotEvidence> = {
  1: {
    placement: 'song1/song.swf instIMG1 id 0171 depth 0153 matrix scale 1.055 x 153.20 y 405.50',
    vectorBounds: 'shape id 0172 bbox [-62.50,-29.15,62.45,29.20] -> approx rect 87.26,374.74,131.82,61.55',
    hitRect: { left: 70, top: 330, width: 178, height: 102 },
  },
  2: {
    placement: 'song1/song.swf instIMG2 id 0213 depth 0253 matrix scale 1.055 x 103.10 y 355.75',
    vectorBounds: 'shape id 0214 bbox [-56.65,-24.15,56.65,24.10] -> approx rect 43.33,330.27,119.53,50.90',
    hitRect: { left: 45, top: 296, width: 160, height: 70 },
  },
  3: {
    placement: 'song1/song.swf instIMG3 id 0221 depth 0282 matrix scale 1.055 x 141.15 y 317.25',
    vectorBounds: 'shape id 0222 bbox [-66.65,-5.15,66.65,5.20] -> approx rect 70.84,311.82,140.63,10.92',
    hitRect: { left: 66, top: 260, width: 182, height: 60 },
  },
  4: {
    placement: 'song1/song.swf instIMG4 id 0229 depth 0294 matrix scale 1.055 x 317.45 y 352.35',
    vectorBounds:
      'sprite id 0229 nests frame-labeled button states; face1 uses shape id 0091 bbox [-66.65,-5.15,66.65,5.20] via id 0092, approx rect 248.14,348.82,140.63,10.92',
    hitRect: { left: 246, top: 334, width: 154, height: 44 },
  },
  5: {
    placement: 'song1/song.swf instIMG5 id 0179 depth 0169 matrix scale 1.055 x 307.70 y 402.20',
    vectorBounds: 'shape id 0180 bbox [-45.50,-51.25,45.60,51.30] -> approx rect 259.70,348.13,96.11,108.20',
    hitRect: { left: 242, top: 342, width: 180, height: 86 },
  },
  6: {
    placement: 'song1/song.swf instIMG6 id 0187 depth 0201 matrix scale 1.055 x 444.65 y 366.70',
    vectorBounds: 'shape id 0188 bbox [-24.90,-36.65,24.90,36.65] -> approx rect 418.38,328.04,52.54,77.33',
    hitRect: { left: 386, top: 326, width: 132, height: 78 },
  },
  7: {
    placement: 'song1/song.swf instIMG7 id 0195 depth 0229 matrix scale 1.055 x 522.90 y 408.05',
    vectorBounds: 'shape id 0196 bbox [-34.90,-51.45,34.95,51.45] -> approx rect 486.08,353.76,73.70,108.56',
    hitRect: { left: 525, top: 369, width: 88, height: 72 },
  },
  8: {
    placement: 'song1/song.swf instIMG8 id 0203 depth 0241 matrix scale 1.055 x 556.35 y 339.60',
    vectorBounds: 'shape id 0204 bbox [-54.00,-20.40,53.50,20.35] -> approx rect 499.38,318.08,113.41,42.99',
    hitRect: { left: 520, top: 252, width: 94, height: 82 },
  },
};

function getTrackHotspotEvidence(trackNumber: NutcrackerTrackNumber): TrackHotspotEvidence {
  return nutcrackerTrackHotspotEvidence[trackNumber];
}

function formatTrackHotspotStyle(position: SourceRect): string {
  return `left:${position.left}px;top:${position.top}px;width:${position.width}px;height:${position.height}px`;
}

function formatSourceRect(position: SourceRect): string {
  return `${position.left},${position.top},${position.width},${position.height}`;
}

function getNutcrackerSourceHelpLabel(songId: NutcrackerSongId, track: NutcrackerTrack): string {
  if (songId === 7 && track.number === 2) {
    return "VIOLIN (PIZZICATO)";
  }

  if (track.instrument === "Drums") {
    return "DRUM";
  }

  return track.instrument.toUpperCase();
}

function getNutcrackerSourceHelpFrame(songId: NutcrackerSongId, track: NutcrackerTrack): number {
  const label = getNutcrackerSourceHelpLabel(songId, track);
  return label === "SAXOPHONE" ? 3 : 2;
}

function getNutcrackerSourceHelpBounds(songId: NutcrackerSongId, track: NutcrackerTrack): string {
  const frame = getNutcrackerSourceHelpFrame(songId, track);
  if (frame === 3) {
    return "frame 3 edit ids 0234-0236 bbox approx 276x22 after 1.2 scale";
  }

  return "frame 2 edit ids 0231-0233 bbox approx 276x22 after 1.2 scale";
}

function countCorrectSelections(song: NutcrackerSongGame, selectedTrackNumbers: readonly NutcrackerTrackNumber[]): number {
  return song.tracks.filter((track) => track.valid && selectedTrackNumbers.includes(track.number)).length;
}

function formatDuration(durationSeconds: number | null): string {
  if (!durationSeconds) {
    return "--:--";
  }
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.round(durationSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatTrackStart(track: NutcrackerTrack): string {
  const startSeconds = getNutcrackerTrackStartSeconds(track);
  return startSeconds > 0 ? `Start ${startSeconds.toFixed(1)}s` : "Start 0.0s";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMultilineText(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function createNutcrackerSelectionState(): Record<NutcrackerSongId, NutcrackerTrackNumber[]> {
  return Object.fromEntries(nutcrackerSongGames.map((song) => [song.id, []])) as unknown as Record<
    NutcrackerSongId,
    NutcrackerTrackNumber[]
  >;
}

function createNutcrackerFeedbackState(): Record<NutcrackerSongId, string | null> {
  return Object.fromEntries(nutcrackerSongGames.map((song) => [song.id, null])) as unknown as Record<NutcrackerSongId, string | null>;
}

function isNutcrackerDoorUnlocked(
  progress: ReturnType<ProgressStoreController["getSnapshot"]>,
  songId: NutcrackerSongId,
): boolean {
  if (songId === 1) {
    return true;
  }

  return progress.nutDoors[(songId - 1) as DoorKey];
}

function isSourceFrameRoute(routeId: RouteId): boolean {
  return (
    routeId === "overture" ||
    routeId === "main-menu" ||
    isReadingRouteId(routeId) ||
    routeId === "music-dictionary" ||
    routeId === "suite" ||
    routeId === "nutcracker-chooser" ||
    routeId === "trivia" ||
    routeId === "melody" ||
    routeId === "memory" ||
    routeId === "tree-game" ||
    routeId === "flying-instruments" ||
    routeId === "childrens-album" ||
    routeId === "loopy-tunes" ||
    routeId === "orchestra" ||
    routeId === "toy-soldiers" ||
    routeId === "waltz" ||
    routeId === "alice-puzzles" ||
    routeId === "nut-house" ||
    getNutcrackerSongGameByRoute(routeId) !== undefined
  );
}

function toggleNutcrackerTrack(
  shellState: ShellState,
  songId: NutcrackerSongId,
  trackNumber: NutcrackerTrackNumber,
): void {
  const song = nutcrackerSongGames.find((item) => item.id === songId);
  const maxSelections = song ? getCorrectNutcrackerTrackNumbers(song).length : 4;
  const selected = new Set(shellState.nutcrackerSelections[songId]);
  if (selected.has(trackNumber)) {
    selected.delete(trackNumber);
  } else {
    if (selected.size >= maxSelections) {
      shellState.nutcrackerFeedback[songId] = "try again";
      return;
    }
    selected.add(trackNumber);
  }

  shellState.nutcrackerSelections[songId] = [...selected].sort((a, b) => a - b);
  shellState.nutcrackerFeedback[songId] = null;
}

function addNutcrackerTrack(
  shellState: ShellState,
  songId: NutcrackerSongId,
  trackNumber: NutcrackerTrackNumber,
): void {
  const song = nutcrackerSongGames.find((item) => item.id === songId);
  const maxSelections = song ? getCorrectNutcrackerTrackNumbers(song).length : 4;
  const selected = new Set(shellState.nutcrackerSelections[songId]);
  if (selected.has(trackNumber)) {
    shellState.nutcrackerFeedback[songId] = null;
    return;
  }
  if (selected.size >= maxSelections) {
    shellState.nutcrackerFeedback[songId] = "try again";
    return;
  }
  selected.add(trackNumber);
  shellState.nutcrackerSelections[songId] = [...selected].sort((a, b) => a - b);
  shellState.nutcrackerFeedback[songId] = null;
}

function checkNutcrackerSelectionIfReady(
  song: NutcrackerSongGame,
  shellState: ShellState,
  progress: ProgressStoreController,
): void {
  if (shellState.nutcrackerSelections[song.id].length === getCorrectNutcrackerTrackNumbers(song).length) {
    submitNutcrackerSong(song, shellState, progress);
  }
}

function submitNutcrackerSong(
  song: NutcrackerSongGame,
  shellState: ShellState,
  progress: ProgressStoreController,
): void {
  if (isCorrectNutcrackerSelection(song, shellState.nutcrackerSelections[song.id])) {
    const snapshot = progress.markNutDoor(song.id);
    if (snapshot.openedNutDoorCount === nutcrackerSongGames.length) {
      progress.markGameKey(1);
    }
    shellState.nutcrackerFeedback[song.id] = "ok";
    return;
  }

  shellState.nutcrackerFeedback[song.id] = "try again";
}

function showNutcrackerHint(
  song: NutcrackerSongGame,
  shellState: ShellState,
  progress: ProgressStoreController,
): void {
  if (shellState.nutcrackerSelections[song.id].length < getCorrectNutcrackerTrackNumbers(song).length) {
    shellState.nutcrackerFeedback[song.id] = "hint";
    return;
  }

  submitNutcrackerSong(song, shellState, progress);
}

function renderNutcrackerCertificatePrintSurface(): string {
  return `
    <section
      class="certificate-print-surface"
      aria-label="Nutcracker Club membership award certificate"
      data-source-projector="analysis/setup/app/fscommand/nc_certificate.exe embedded CWS at byte 860160"
      data-source-sprite="nc_certificate embedded SWF sprite id 0018; 550 by 354 source background; promoted from the intact inner render"
      data-source-action="frame 1 GetUrl print:#bmax targets nc_certificate; frame 5 FSCommand quit"
      data-source-fallback="the webview cannot execute legacy Flash print:#bmax or projector quit; window.print opens the host print dialog, whose Save PDF option replaces the legacy printer-only flow"
    >
      <img src="${nutcrackerClubCertificateUrl}" alt="The Nutcracker Club membership award certificate" />
    </section>
  `;
}

function renderNutcrackerCertificatePrintAction(className: string): string {
  return `
    <button
      class="${className}"
      type="button"
      data-action="print-certificate"
      data-source-reward="gameKey1"
      data-source-action="all eight Nutcracker doors grant gameKey1; legacy nc_certificate.exe prints target nc_certificate with print:#bmax"
    >Print / Save PDF</button>
  `;
}

function renderPrimaryActions(route: RouteDefinition): string {
  if (route.id === "overture") {
    return `
      <button class="scene-button primary" type="button" data-action="start">Start</button>
      <button class="scene-button" type="button" data-action="help">Help</button>
    `;
  }

  return `
    <button class="scene-button" type="button" data-action="back">Back</button>
    <button class="scene-button primary" type="button" data-action="help">Help</button>
    <button class="scene-button" type="button" data-action="exit">Menu</button>
  `;
}

function renderChooserSourceControls(): string {
  return `
    <div class="chooser-source-controls" aria-label="Source chooser controls">
      <button
        class="scene-button source-label-button chooser-source-help-button"
        type="button"
        data-action="help"
        data-source-control="helpButton"
        data-source-placement="nutchooser.swf helpButton root placement sprite id 0202 at depth 0168 matrix scale 1.350 x 556.50 y 165.30 ratio 5"
        data-source-state="sprite id 0202 buttonON places button id 0200 depth 0001 and shape id 0201 depth 0004; buttonOFF places shape id 0198 depth 0002 with alpha mul 0.4"
        data-source-image="normal Help art is preserved in the complete official-Ruffle source-runtime capture; this transparent source-bounded button supplies modern pointer and keyboard input"
        data-source-help="Help"
        data-source-help-frame="4"
        data-source-help-bounds="nutchooser.swf button id 0200 action pushes string Help, frame 4, and calls _root.helpme; rollout calls _root.nohelp"
      >
        <span class="sr-only">Help</span>
      </button>
      <button
        class="scene-button source-label-button chooser-source-exit-button primary"
        type="button"
        data-action="chooser-warning"
        data-source-control="quiter"
        data-source-placement="nutchooser.swf quiter root placement sprite id 0207 at depth 0173 matrix scale 0.900 x 585.90 y 472.45 ratio 5"
        data-source-state="sprite id 0207 buttonON places button id 0206 depth 0001; button id 0206 source art is recovered as shape id 0205 plus source sibling text id 0204 normal peach EXIT label; buttonOFF places blue text id 0203 depth 0001 matrix scale 1.722 x -114.95 y -12.70 with CXForm add 102 102 204 0"
        data-source-image="normal EXIT art is preserved in the complete official-Ruffle source-runtime capture; this transparent source-bounded button supplies modern pointer and keyboard input; text id 0203 is the blue buttonOFF label"
        data-source-action="sets _root.theNextFrame to warningFrame; warningFrame YES button id 0183 calls _level0.gotoAndPlay('comeAgain')"
        data-source-help="Quit the Game"
        data-source-help-frame="3"
        data-source-help-bounds="nutchooser.swf button id 0206 action pushes string Quit the Game, frame 3, and calls _root.helpme; rollout calls _root.nohelp"
      >
        <span class="sr-only">EXIT</span>
      </button>
    </div>
  `;
}

function renderChooserWarningFrame(): string {
  return `
    <aside
      class="help-modal source-help-modal source-chooser-warning-modal"
      aria-label="Quit warning"
      data-source-classification="swf-derived recreation"
      data-source-frame="nutchooser.swf warningFrame"
      data-source-placement="warningFrame places sprite id 0177 depth 0001 matrix scale 1.051 x -10.05 y 18.50 ratio 24; noAction id 0178 depth 0003 matrix scale 12.497 x -319.25 y -234.35 ratio 24; YES button id 0183 depth 0005 x -58.15 y -76.55; NO button id 0188 depth 0008 x 35.30 y -76.55; close sprite id 0189 depth 0011 x 96.30 y -143.70"
    >
      <img src="${nutChooserFrameUrl}" alt="" aria-hidden="true" />
      <img
        class="source-chooser-warningframe-talker"
        src="${chooserWarningframeTalkerUrl}"
        alt=""
        aria-hidden="true"
        data-source-image="nutchooser.swf warningFrame sprite id 0177 rendered in swfcombine translated wrapper x 130 y 90; direct swfrender clips negative-coordinate source art"
      />
      <button
        class="source-warning-choice source-warning-yes"
        type="button"
        data-action="accept-chooser-warning"
        data-source-button="nutchooser.swf warningFrame YES button id 0183"
        data-source-body="nutchooser.swf warningFrame YES normal body shape id 0179"
        data-source-action="_level0.gotoAndPlay('comeAgain')"
      >
        <img class="source-warning-button-body" src="${chooserWarningYesBodyUrl}" alt="" aria-hidden="true" />
        <img class="source-warning-button-label" src="${chooserWarningYesLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">YES</span>
      </button>
      <button
        class="source-warning-choice source-warning-no"
        type="button"
        data-action="cancel-chooser-warning"
        data-source-button="nutchooser.swf warningFrame NO button id 0188"
        data-source-body="nutchooser.swf warningFrame NO normal body shape id 0184"
        data-source-action="restores chooser controls and sends quiter to buttonON"
      >
        <img class="source-warning-button-body" src="${chooserWarningNoBodyUrl}" alt="" aria-hidden="true" />
        <img class="source-warning-button-label" src="${chooserWarningNoLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">NO</span>
      </button>
      <p class="sr-only">Quit the game?</p>
    </aside>
  `;
}

function renderHelp(route: RouteDefinition): string {
  if (route.id === "nutcracker-chooser") {
    return `
      <aside
        class="help-modal source-help-modal source-chooser-help-modal"
        aria-label="Scene help"
        data-source-classification="swf-derived recreation"
        data-source-frame="nutchooser.swf helpframe"
        data-source-placement="helpframe places sprite id 0170 depth 0001 matrix scale 1.051 x -0.90 y 39.65 ratio 22; noAction id 0171 depth 0003 matrix scale 12.497 x -319.25 y -234.35 ratio 22"
      >
        <img src="${nutChooserFrameUrl}" alt="" aria-hidden="true" />
        <img
          class="source-chooser-helpframe-talker"
          src="${chooserHelpframeTalkerUrl}"
          alt=""
          aria-hidden="true"
          data-source-image="nutchooser.swf nested talker sprite id 0169 rendered in swfcombine translated wrapper x 150 y 120; animated by helpframe sprite id 0170"
        />
        <p class="sr-only">${escapeHtml(getHelpText(route))}</p>
      </aside>
    `;
  }

  if (getNutcrackerSongGameByRoute(route.id)) {
    return `
      <aside
        class="help-modal source-help-modal source-song-help-modal"
        aria-label="Scene help"
        role="dialog"
        aria-modal="true"
        data-source-classification="swf-derived recreation"
        data-source-frame="song1/song.swf helpframe"
        data-source-placement="helpframe places sprite id 0333 depth 0001 matrix scale 1.051 x -5.00 y 74.95 ratio 27; noAction id 0334 depth 0003 matrix scale 12.497 x -319.25 y -234.35 ratio 27"
        data-source-action="helpButton release sets _root.theNextFrame to helpFrame; drives _root.usmus to helpFrame/showUp; stops previews and disables quiter/focus"
      >
        <img
          class="source-song-help-art"
          src="${songHelpArtUrl}"
          alt=""
          aria-hidden="true"
          data-source-image="song1/song.swf lossless bitmap id 0073; frame-surface asset used as source-backed help surface while full helpframe display-list playback remains pending"
        />
        <img
          class="source-song-helpframe-talker"
          src="${songHelpframeTalkerUrl}"
          alt=""
          aria-hidden="true"
          data-source-image="song1/song.swf helpframe sprite id 0333 rendered in swfcombine translated wrapper x 140 y 60; direct swfrender clips negative-coordinate source art"
        />
        <p class="sr-only">${escapeHtml(getHelpText(route))}</p>
        <button
          class="source-song-help-dismiss"
          type="button"
          data-action="help"
          data-modal-dismiss="true"
          data-source-fallback="the recovered helpframe sprite auto-exits only after its streamed timeline; the static DOM frame uses one full-frame dismiss surface while exact timed source playback remains unrecovered"
          aria-label="Close song help"
        ></button>
      </aside>
    `;
  }

  return `
    <aside class="help-modal" aria-label="Scene help">
      <h2>${route.title}</h2>
      <p>${escapeHtml(getHelpText(route))}</p>
    </aside>
  `;
}

function getHelpText(route: RouteDefinition): string {
  if (route.id === "nutcracker-chooser") {
    return "Choose a song door.";
  }

  if (getNutcrackerSongGameByRoute(route.id)) {
    return "All songs are played by 4 instruments! Listen to the original song and find  4 correct instruments. Double click on the instruments or drag them onto the stage.";
  }

  return "Route changes stop active scene audio and preserve saved progress locally.";
}

function updateProgress(button: HTMLButtonElement, progress: ProgressStoreController): void {
  const progressAction = button.dataset.progress;
  const key = Number(button.dataset.key);
  const door = Number(button.dataset.door);

  if (progressAction === "key" && isGameKey(key)) {
    progress.markGameKey(key);
  }

  if (progressAction === "nut-door" && isDoorKey(door)) {
    progress.markNutDoor(door);
  }

  if (progressAction === "children-door" && isDoorKey(door)) {
    progress.markChildrensDoor(door);
  }

  if (progressAction === "nut-house") {
    progress.setNutHouseOpenDoor(door);
  }
}

function isGameKey(key: number): key is GameKey {
  return Number.isInteger(key) && key >= 1 && key <= 9;
}

function isDoorKey(door: number): door is DoorKey {
  return Number.isInteger(door) && door >= 1 && door <= 8;
}
