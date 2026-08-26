# Recovered Behavior Map

Linear issue: JIP-319

This document maps representative Flash behavior to remake responsibilities. Evidence came from focused `swfdump -a` traces and helper-EXE string inspection.

This behavior map is an input to `docs/source-atlas.md`; it does not authorize generic UI. A route must also satisfy the atlas asset/text/placement/fallback gate before visible implementation is accepted.

## Tooling

Representative SWFs are inspectable with SWFTools:

```sh
swfdump -a analysis/setup/app/flute_intro.swf
swfdump -a analysis/setup/app/games/nutcrackergame/nutchooser.swf
swfdump -a analysis/setup/app/games/tree/tree.swf
swfdump -a analysis/setup/app/games/trivia/trivia.swf
```

Useful focused search:

```sh
swfdump -a <file.swf> | rg -n 'GetUrl2|FSCommand|gotoAnd|games/|gameKey|door|_level'
```

## Runtime Model

The original app relies on Flash levels and shared global variables:

| Flash concept | Observed behavior | Remake model |
| --- | --- | --- |
| `_level0` | Root shell/global state such as `gameKey9`, `nutDoorsVisited`, `theQuestion`, `correctQ`, `wrongQ` | Central app store plus per-route scene state |
| `_level1` | Loaded game/activity movie and text-data target | Active scene route with loaded data fixtures |
| `GetUrl URL:"...swf" Label:"_level1"` | Replaces the active movie with another SWF | `router.navigate(sceneId, params)` |
| `GetUrl2 128` | Loads text data into `_level0` or `_level1` | Typed data loader/parser |
| `gotoAndPlay` / `gotoAndStop` | Timeline state transitions and modal/help/warning screens | Scene state transitions and named modal states |
| `FSCommand:exec` | Runs Windows helper EXEs from `fscommand` | Local app methods for save/reset/route/export |
| `StopSounds` | Stops preview/music before route changes | Audio service cleanup on scene exit |

## Startup And Shell

`flute_intro.swf` is Flash 6, 800x600, 15 fps, 1277 frames. It is mostly a timeline intro with streaming audio and animation and a source `skip` control. The final structurally valid Flash payload appended to `Nutcracker2.exe` begins at byte `864256`; its root frame 2378 is labeled `playRoom` and contains the main activity routing. See `docs/shell-reference-source-map.md` for the locked payload, placements, actions, and renderer boundaries.

Remake action:

| Original | Modern behavior |
| --- | --- |
| Windows projector launches `Nutcracker2.exe` | Desktop app launches directly into a local shell |
| Intro timeline plays in `flute_intro.swf` | Optional intro scene; allow skip and direct main menu |
| Flash levels own state | Use a typed app store and scene router |

## Nutcracker Song Chooser

File: `games/nutcrackergame/nutchooser.swf`

Recovered behavior:

| Evidence | Meaning | Modern method |
| --- | --- | --- |
| Sets `_level0.nutDoorsVisited = 0` | Initializes/refreshes song-door visited count | `progress.resetTransientNutDoorVisitCount()` |
| `GetUrl2 128` for `games/data/nutdoors.txt` into `_level1` | Loads persisted door state | `loadProgress().nutDoors` |
| Loops over `door1` through `door8` and computes `nutDoorsVisited` | Counts opened/visited Nutcracker song doors | derived selector state |
| Door button actions load `games/nutcrackergame/songN/song.swf` into `_level1` | Routes to one of eight song games | `router.navigate('nutcracker-song', { song: N })` |
| Uses `StopSounds` on song route selection | Cleans up chooser preview/audio | `audio.stopAllSceneAudio()` |
| Uses `gotoAndStop` / `gotoAndPlay` labels such as `main`, `gameBegin`, `introFrame`, `helpFrame`, `warningFrame`, `nameFrame` | Timeline screens for chooser, help, warning, and name/intro states | typed scene substates/modals |

Door routing recovered:

| Door | SWF target |
| ---: | --- |
| 1 | `games/nutcrackergame/song1/song.swf` |
| 2 | `games/nutcrackergame/song2/song.swf` |
| 3 | `games/nutcrackergame/song3/song.swf` |
| 4 | `games/nutcrackergame/song4/song.swf` |
| 5 | `games/nutcrackergame/song5/song.swf` |
| 6 | `games/nutcrackergame/song6/song.swf` |
| 7 | `games/nutcrackergame/song7/song.swf` |
| 8 | `games/nutcrackergame/song8/song.swf` |

## Tree Game

File: `games/tree/tree.swf`

Recovered behavior:

| Evidence | Meaning | Modern method |
| --- | --- | --- |
| Constant pool references `Games/Tree/`, `Snd_`, `/c_`, `/i_`, `.mp3`, `Sound`, `loadSound` | Builds sound paths dynamically from tree variant and correct/incorrect instrument choices | `treeGame.resolveSoundPath(variant, kind, row, column)` |
| Uses `Math.random`, `Array`, `sort_var`, `rnd_var` | Randomizes play variants/buttons | seeded or unseeded game randomizer |
| `gotoAndStop` on button/percussion/instrument clips | Shows correct/incorrect visual state | local component state |
| Label `win` and `winFrame` | Game completion screen flow | `sceneState.phase = 'win'` |
| `GetUrl URL:"FSCommand:exec" Label:"saveKey8.exe"` | Completion persists `gameKey8=1` | `progress.markGameKey(8)` |
| Sets `_level0.gameKey8 = 1` and calls `updateKeys` | In-memory completion update and key display refresh | `progress.markGameKey(8); rewards.refreshKeys()` |
| Root instances `pl_1` through `pl_12` use fixed placements | Three rows of four source sound targets | exact source-coordinate `data-tree-round` / `data-tree-option` hotspots |
| Three bundled variants use `Snd_1` through `Snd_3` with `c_1`…`c_3` and `i_<round>_<option>` | Each round plays one prompt and four candidate clips | `createTreeRounds(variant)` resolves the promoted source audio |
| `otgad == 3` before the win/key path | Exactly three correct rounds complete the game | `treeCorrectCount >= 3` grants game key 8 |

Modern tree game model:

```ts
type TreeProgress = {
  variant: number;
  correctCount: number;
  gameKey: 8;
  phase: 'intro' | 'playing' | 'win' | 'reward';
};
```

## Trivia Game

File: `games/trivia/trivia.swf`

Recovered behavior:

| Evidence | Meaning | Modern method |
| --- | --- | --- |
| `GetUrl2 128` loads `games/trivia/questions/trivia.txt` into `_level1` and `_level0` | Loads question bank and globals from query-string text | `parseTriviaQuestions()` |
| Sets `requieredQ = 10` | Requires 10 correct answers for completion; misspelling is original | `requiredCorrectAnswers = 10` |
| Initializes or decrements `_level0.theQuestion` | Tracks current question number/index | `trivia.currentQuestionIndex` |
| Uses `_level0.correctQ`, `_level0.wrongQ` | Tracks score counters | `trivia.correctCount`, `trivia.wrongCount` |
| Looks up `qN`, `op1N` through `op4N`, `correctN`, `goodN`, `badN` | Question schema | structured trivia fixture |
| On correct answer, compares `correctQ` to `requieredQ` | Completion condition | `if correctCount >= requiredCorrectAnswers` |
| Wrong-screen `AGAIN` decrements `theQuestion` before `doQuestion` increments it | A wrong answer repeats the same question | advance the runtime index only after correct feedback |
| `GetUrl URL:"FSCommand:exec" Label:"saveKey9.exe"` | Trivia completion persists `gameKey9=1` | `progress.markGameKey(9)` |
| Sets `_level0.gameKey9 = 1` and shows `cornerKey` | In-memory key state updates reward indicator | `rewards.showKey(9)` |

Modern trivia question shape:

```ts
type TriviaQuestion = {
  id: number;
  prompt: string;
  options: [string, string, string, string];
  correctOption: 1 | 2 | 3 | 4;
  successText?: string;
  failureText?: string;
};
```

The M07 reconstruction additionally locks root frame 20, question edit text id 109 at x 132.40/y 66.05, answer instances `b1` through `b4` at x 373.25 and source y positions 89.95, 144.00, 199.80, and 265.20, and the exact embedded correct/wrong sounds. The runtime parses all 106 recovered questions and layers them over promoted DefineBitsJPEG3 id 5 book art. See `docs/m07-mini-games-source-map.md`.

## Funky Monkey Melody

File: `games/melody/melody.swf`

| Evidence | Meaning | Modern method |
| --- | --- | --- |
| Loads `Games/Melody/Snd/Melody.txt` | Four difficulty banks are external Flash variables | `parseMelodySequences()` and `getMelodySequences()` |
| Keys `m_beg_*`, `m_easy_*`, `m_inter_*`, `m_adv_*` | 8 beginner, 8 easy, 10 intermediate, and 10 advanced phrases | typed `MelodyDifficulty` sequence sets |
| Tokens pair note/length such as `5m` with a delay | Plays exact short/medium/long note clip and waits source duration | `getMelodyNoteAudio()` plus scheduled token delay |
| Root labels `init` 2, `new_seq` 8, `fin` 13 | Level selection, active phrase, and completion states | typed difficulty/index/input/feedback state |
| Keyboard sprite id 290 at scale 1.583 x 317.95/y 370.35 | Seventeen playable note targets | 17 source-positioned DOM note buttons |
| Root completion path tests `seq_var == 3` before `saveKey5.exe` | The third correct phrase persists game key 5 | `progress.markGameKey(5)` after sequence three |

The full monkey/keyboard composition cannot be flattened by the local renderer because it reports `INVALID GRADIENT` and unknown children. Promoted source stage/frame layers and exact audio/state are composed with a documented keyboard/character fallback; full nested timeline playback remains open for manual fidelity review.

## MusiCards Memory

File: `games/memorygame/memory.swf`

| Evidence | Meaning | Modern method |
| --- | --- | --- |
| Initializes level 1, pairs 5, `ncol = 4`, `nrow = 3` | First board has ten cards in a four-column region | `memoryPairsForLevel(1)` and a source-sized grid |
| Sets `errornum = pairs + Math.floor(pairs / 2)` | Error budget grows with the board | `memoryErrorsForPairs()` |
| Increments pairs until 18 | Fourteen-level progression from 5 through 18 pairs | `memoryPairsForLevel(level)` capped at 18 |
| Builds two entries per pair and sorts them by random `chance` | Card positions change on each board | Fisher-Yates shuffle with injectable randomness for deterministic tests |
| Face sprite id 57 has 18 frames; frame 17 reuses shape 36 and frame 18 uses shape 56; back sprite id 61 | All source card-face and hidden-card states | 18 correctly named face promotions and exact 37 x 52 card back |
| Bundled `snd/1.mp3` through `snd/18.mp3` | Each pair has its own source sound | `MemoryCard.soundUrl` |
| 18-pair completion calls `saveKey2.exe` | Final board persists game key 2 | `progress.markGameKey(2)` |

## Flying Instruments

File: `games/flyinginstruments/flyinginstruments.swf`

| Evidence | Meaning | Modern method |
| --- | --- | --- |
| Root labels `chooseLevel` 2, `playLevel1` 3, `playLevel2` 4, `playLevel3` 5, `bye` 6 | Three playable level states and exit | typed level/index/correct/feedback state on dedicated route |
| Source text `CHOOSE A GAME TO PLAY`, `START`, `RESUME`, `HELP` | Visible control vocabulary comes from source | exact source strings in preserved viewport |
| JPEG3 ids 74 through 120, viola child shape 48, and star id 123 | Seventeen recoverable instrument images plus reward star | correctly named per-instrument source promotions |
| Embedded exports map instrument and family sounds | No external companion directory is required | extracted `audio/flying/*.mp3` promotions |
| Four-by-seven grid and family/instrument actions | Tetris-like instrument-to-family classification | pointer/keyboard family targets with exact behavior and documented motion fallback |
| `maxInst = 17` for level 1, `8` for levels 2/3; four source `instSet` arrays per shorter level | Full-set first level and source-defined shorter sets | all 17 source instruments for level 1; deterministic first recovered eight-instrument set for levels 2/3 |
| Completion calls `saveKey3.exe` | Persists game key 3 | `progress.markGameKey(3)` |

The full root probe produces a transparent 640 x 480, 406-byte PNG while reporting missing JPEG and unknown child IDs. The runtime therefore composes promoted source instrument/stage imagery and embedded sounds with the typed grid substitute. Exact falling/grid animation remains a documented renderer gap.

## M08 Mini-Game Batch 2

The full source inventory, locked hashes, per-SWF dimensions, promoted child layers, audio map, and root-render diagnostics are in `docs/m08-mini-games-source-map.md`. The runtime rule helpers live in `app/src/data/m08Games.ts`.

### Children's Album and Loopy Tunes

| Source evidence | Exact behavior | Modern method |
| --- | --- | --- |
| `games/data/childrensalbum.txt` values `10100110`, `11001001`, `10010110`, `00101011`, `11000101`, `00111010`, `11000110`, `01011100` | Eight songs require four exact instrument indices | `childrensAlbumSongs` and `isChildrensAlbumSelectionCorrect()` |
| Reversed source title array | NEAPOLITAN SONG, MAZURKA, POLKA, GERMAN SONG, FRENCH SONG, ITALIAN SONG, RUSSIAN SONG, WALTZ | exact runtime source titles |
| `saveCADoor1.exe` through `saveCADoor8.exe`; all doors then save key 6 | Door completion persists and all eight grant key 6 | `markChildrensDoor()` then `markGameKey(6)` |
| Every `loopN.swf` sets `totalLoops=8`, `goodLoops=4`, and `myTrack1/3/5/7=1` | Tracks 1, 3, 5, and 7 are correct in all eight tunes | `loopyTunes` and `isLoopySelectionCorrect()` |
| Final Loopy source action saves key 3 | Legacy key overlap with Flying Instruments is real source behavior | `markGameKey(3)` after tune 8 |

### Orchestra, Toy Soldiers, and Waltz

| Source evidence | Exact behavior | Modern method |
| --- | --- | --- |
| Orchestra `maxInst=18`, labels and sound ids 1-18 | One source prompt at a time in exact OBOE-through-FLUTE order; each counts once | `orchestraInstruments`, prompt index, completed-id set |
| Orchestra sound id 19 and id 838; `goodInst == 18` | Wrong/win feedback; completion grants key 4 | extracted embedded sounds and `markGameKey(4)` |
| Toy instances `soldier_0..7`, `top_y=85`, `bottom_y=300`, 11 snaps, `correct_note=[1..8]` | Eight pitch positions must ascend before the march | `toySoldierCorrectNotes` and `toySoldiersAreCorrect()` |
| Toy source contains no save-key action | Activity is supplementary | no invented progress key |
| Waltz 785 frames at 12 fps plus `MP3Wedding3.wav` | Approximately 65.4-second source timeline/audio; no recovered win or gameplay action | audio/timeline route with no invented progress state |

### Alice and Nut House

| Source evidence | Exact behavior | Modern method |
| --- | --- | --- |
| Alice chooser loads `game_01.swf` through `game_12.swf` | Twelve selectable puzzles | `alicePuzzleIds` and puzzle-local source image selection |
| All `gameCombination1..12` arrays equal `[1,1,1]` | Three dial values must each equal one | `alicePuzzleSolution` and `alicePuzzleIsCorrect()` |
| Alice source contains no save-key action | Activity is supplementary | no invented progress key |
| Nut House room11..18 correct mirrors `[8,3,1,7,6,4,5,2]` | Correct mirror loads the next room | `nutHouseCorrectMirror(room)` |
| `openDoor` in `nuthouserooms.txt`; room18 saves key 7 | Room progress persists; final room grants key 7 | `setNutHouseOpenDoor(room - 10)` and `markGameKey(7)` |

## Save And Progress Files

Original files:

| File | Variables | Modern state |
| --- | --- | --- |
| `games/data/gamekeys.txt` | `gameKey1` through `gameKey9` | `progress.gameKeys: Record<1..9, boolean>` |
| `games/data/nutdoors.txt` | `door1` through `door8` | `progress.nutDoors: Record<1..8, boolean>` |
| `games/data/childrensdoors.txt` | `cadoor1` through `cadoor8` | `progress.childrensDoors: Record<1..8, boolean>` |
| `games/data/nuthouserooms.txt` | `openDoor` | `progress.nutHouse.openDoor: number` |
| `games/data/childrensalbum.txt` | `s1` through `s8` bit patterns | Children's Album data fixture |

Modern progress API:

```ts
type GameKeyId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type DoorId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface ProgressStore {
  gameKeys: Record<GameKeyId, boolean>;
  nutDoors: Record<DoorId, boolean>;
  childrensDoors: Record<DoorId, boolean>;
  nutHouse: { openDoor: number };
}
```

## FSCommand Responsibility Map

| Original helper | Modern replacement |
| --- | --- |
| `saveKeyN.exe` | `progress.markGameKey(N)` |
| `saveNutDoorN.exe` | `progress.markNutDoor(N)` |
| `saveCADoorN.exe` | `progress.markChildrensDoor(N)` |
| `saveNutHouse.exe` | `progress.setNutHouseOpenDoor(value)` |
| `resetGameKeys.exe` | `progress.resetGameKeys()` |
| `resetDoorsKeys.exe` | `progress.resetNutDoors()` |
| `resetCADoors.exe` | `progress.resetChildrensDoors()` |
| `resetOpenDoors.exe` | `progress.resetNutHouseRooms()` |
| `nc_*.exe`, `ncc_*.exe`, certificate helpers | App routes, local modal screens, print/export flow, or documented deferred external-content placeholders |

## Unknowns Requiring Deeper Recovery

These do not block M02 scaffolding but should be handled in later milestone issues:

| Area | Unknown | Follow-up |
| --- | --- | --- |
| Full intro timeline playback | Representative intro frame renders are blank or crash; only child layers and the source skip control are recoverable locally | Documented fallback in JIP-818 and `docs/shell-reference-source-map.md` |
| Song game rules | `song*/song.swf` and `track*.swf` need per-song rule recovery | M06 issues |
| Reference activity animation | Story, biography, ballet, and Musictionary text/control maps are recovered; full root/display-list animation still cannot be flattened locally | Documented fallbacks in JIP-819/JIP-820 and `docs/shell-reference-source-map.md` |
| Launcher helper destinations | `nc_*.exe`/`ncc_*.exe` names are clear, but exact old projector launch targets may require Windows/runtime tracing | Treat as route placeholders unless needed for release parity |
| Asset extraction fidelity | SWF vector/timeline export quality is unproven | M03 asset extraction and import strategy |
