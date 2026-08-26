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

`flute_intro.swf` is Flash 6, 800x600, 15 fps, 1277 frames. It is mostly a timeline intro with streaming audio and animation. Focused `swfdump` search did not expose obvious route/data commands in the inspected trace, so treat it as an optional intro/branding sequence rather than the core navigation source.

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
| Full intro/menu routing | `flute_intro.swf` focused trace did not expose clear route commands in the inspected lines | Decompile or inspect more shell/menu SWFs once scaffold exists |
| Song game rules | `song*/song.swf` and `track*.swf` need per-song rule recovery | M06 issues |
| Activity page/animation content | Story, biography, ballet, musictionary content flows need separate page maps | M05 issues |
| Launcher helper destinations | `nc_*.exe`/`ncc_*.exe` names are clear, but exact old projector launch targets may require Windows/runtime tracing | Treat as route placeholders unless needed for release parity |
| Asset extraction fidelity | SWF vector/timeline export quality is unproven | M03 asset extraction and import strategy |
