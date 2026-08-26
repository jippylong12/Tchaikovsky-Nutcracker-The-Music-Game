# Source Inventory

Linear issue: JIP-318

This document records the recovered source shape for Tchaikovsky's Nutcracker: The Music Game so later remake work can start from stable paths and counts.

For route-level implementation readiness, use `docs/source-atlas.md` and its machine-readable contract at `docs/source-atlas.json`. Run `npm run assets:source-atlas` from `app/` before visible route work.

## Source Locations

| Path | Role | Notes |
| --- | --- | --- |
| `base/tchaikovsky-nutcracker-the-music-game.iso` | Original disc image | Internet Archive metadata identifies the title as "Tchaikovsky's Nutcracker: The Music Game", creator "Quaint Interactive", year 2003. Size is 244,436,992 bytes. |
| `analysis/iso` | Extracted ISO root | Contains `autorun.inf`, `Autoplay.exe`, and `Setup.exe`. `Setup.exe` is an Inno Setup self-extracting archive. |
| `analysis/setup/app` | Extracted installed app | Contains the Flash projector, SWFs, media, text data, and `fscommand` helper EXEs used by the projector runtime. |

The extracted installed app is the remake source of truth. The remake should not depend on `Nutcracker2.exe` or any Windows-only `fscommand` executable.

## Extraction Commands

Confirmed local tools:

```sh
which innoextract
which swfdump
```

Recorded extraction shape:

```sh
# ISO extraction was already completed into analysis/iso.
# On macOS, a repeatable path is:
hdiutil attach base/tchaikovsky-nutcracker-the-music-game.iso
cp -R /Volumes/<mounted-disc> analysis/iso
hdiutil detach /Volumes/<mounted-disc>

# Installer extraction:
innoextract -d analysis/setup analysis/iso/Setup.exe
```

`swfdump` from SWFTools is sufficient for the M01 representative ActionScript/Flash 5-6 behavior recovery:

```sh
swfdump -a analysis/setup/app/games/nutcrackergame/nutchooser.swf
```

## File Counts

Counts from `analysis/setup/app`:

| Extension | Count | Meaning |
| --- | ---: | --- |
| `.swf` | 200 | Flash movies, activities, games, track animations, and helper timelines |
| `.mp3` | 187 | External audio assets |
| `.wav` | 3 | External audio assets |
| `.txt` | 19 | Query-string data files, track metadata, questions, and sequence data |
| `.exe` | 48 | Windows projector/runtime helper executables |
| `.bak` | 8 | Backup copies of some MP3 assets |

Command:

```sh
find analysis/setup/app -type f | awk 'BEGIN{IGNORECASE=1} /\.swf$/{swf++} /\.mp3$/{mp3++} /\.wav$/{wav++} /\.txt$/{txt++} /\.exe$/{exe++} END{printf "swf=%d\nmp3=%d\nwav=%d\ntxt=%d\nexe=%d\n", swf, mp3, wav, txt, exe}'
```

## Entrypoints

| Path | Role |
| --- | --- |
| `analysis/setup/app/Nutcracker2.exe` | Windows Flash projector containing the final valid embedded Flash 6 payload at byte `864256`; root frame 2378 label `playRoom` is the activity menu authority. |
| `analysis/setup/app/flute_intro.swf` | Intro shell movie. Flash 6, 800x600, 15 fps, 1277 frames. |
| `analysis/setup/app/games/nutcrackergame/nutchooser.swf` | Nutcracker song chooser. Flash 6, 640x480, 15 fps, 6 frames. Loads `games/data/nutdoors.txt` and routes to song SWFs. |

Most game and activity content is 640x480 Flash 6 content. The remake should use a 640x480 fixed game viewport for gameplay/activity scenes, with intro handling treated separately if retained.

## Major Activity SWFs

| Path | Role |
| --- | --- |
| `activities/story/story.swf` | Nutcracker story activity |
| `activities/biography/biography.swf` | Tchaikovsky biography activity |
| `activities/ballet/ballet.swf` | Nutcracker ballet history activity |
| `activities/musictionary/musictionary.swf` | Music dictionary / encyclopedia activity |
| `activities/originals/gramophone.swf` | Nutcracker Suite listening player |
| `activities/originals/theme1.mp3` through `theme8.mp3` | Eight Suite audio tracks |

## Major Game SWFs

| Path | Role |
| --- | --- |
| `games/nutcrackergame/nutchooser.swf` | Nutcracker song chooser |
| `games/nutcrackergame/song1` through `song8` | Song games with `song.swf`, `track1.swf` through `track8.swf`, character `anim*.swf`, and `trackinfo.txt` |
| `games/tree/tree.swf` | Instrument identification/action game |
| `games/trivia/trivia.swf` | Trivia game |
| `games/melody/melody.swf` | Melody sequence game |
| `games/memorygame/memory.swf` | Memory game |
| `games/childrensalbum/childrensalbum.swf` | Children's Album game |
| `games/loopytunes/loopChooser.swf`, `loop1.swf` through `loop8.swf` | Loopy Tunes selection/game flow |
| `games/aliceswf/alice.swf`, `game_01.swf` through `game_12.swf` | Alice puzzle flow |
| `games/nuthouse/room11.swf` through `room18.swf` | Nut House room flow |
| `games/orchestragame/orchestra.swf` | Orchestra game |
| `games/toysoldiersgame/toysoldiersgame.swf` | Toy soldiers game |
| `games/flyinginstruments/flyinginstruments.swf` | Flying instruments game |
| `games/wedding/waltz.swf` | Waltz game |

Top-level SWF/media distribution:

| Area | SWF | MP3 | WAV |
| --- | ---: | ---: | ---: |
| `activities/originals` | 1 | 8 | 0 |
| `games/aliceswf` | 13 | 0 | 0 |
| `games/childrensalbum` | 1 | 72 | 2 |
| `games/loopytunes` | 9 | 0 | 0 |
| `games/melody` | 1 | 53 | 0 |
| `games/memorygame` | 1 | 18 | 0 |
| `games/nutcrackergame` | 154 | 0 | 0 |
| `games/nuthouse` | 8 | 0 | 0 |
| `games/tree` | 2 | 36 | 0 |
| `games/wedding` | 1 | 0 | 1 |

## Text Data Files

| Path | Role |
| --- | --- |
| `games/data/gamekeys.txt` | Completion keys: `gameKey1` through `gameKey9` |
| `games/data/nutdoors.txt` | Nutcracker song door state: `door1` through `door8` |
| `games/data/childrensdoors.txt` | Children's Album door state: `cadoor1` through `cadoor8` |
| `games/data/nuthouserooms.txt` | Nut House open room state: `openDoor` |
| `games/data/childrensalbum.txt` | Children's Album encoded song patterns |
| `games/trivia/questions/trivia.txt` | Active trivia questions; includes `maxq`/question variables |
| `games/trivia/questions/trivia_.txt`, `trivia_0.txt` | Alternate trivia question sets |
| `games/melody/snd/Melody.txt` | Melody sequence definitions by difficulty |
| `games/nutcrackergame/song*/trackinfo.txt` | Nutcracker song labels/metadata |
| `games/childrensalbum/song1/songDescription.txt` | Children's Album song description |

The text files use Flash `loadVariables` style query-string data: ampersand-delimited variables with mixed `EOF`/`eof` markers and inconsistent casing. Later parsing should preserve original quirks until normalized test fixtures are in place.

## FSCommand Helpers

`analysis/setup/app/fscommand` contains 48 Windows EXEs.

State mutators:

| Helper group | Count | Original responsibility | Modern replacement |
| --- | ---: | --- | --- |
| `saveKey1.exe` through `saveKey9.exe` | 9 | Set `gameKeyN=1` in `games/data/gamekeys.txt` | `progress.markGameKey(N)` |
| `saveNutDoor1.exe` through `saveNutDoor8.exe` | 8 | Set `doorN=1` in `games/data/nutdoors.txt` | `progress.markNutDoor(N)` |
| `saveCADoor1.exe` through `saveCADoor8.exe` | 8 | Set `cadoorN=1` in `games/data/childrensdoors.txt` | `progress.markChildrensDoor(N)` |
| `saveNutHouse.exe` | 1 | Update `games/data/nuthouserooms.txt` | `progress.setNutHouseOpenDoor(value)` |
| `resetGameKeys.exe` | 1 | Reset all game keys to `0` | `progress.resetGameKeys()` |
| `resetDoorsKeys.exe` | 1 | Reset Nutcracker doors to `0` | `progress.resetNutDoors()` |
| `resetCADoors.exe` | 1 | Reset Children's Album doors to `0` | `progress.resetChildrensDoors()` |
| `resetOpenDoors.exe` | 1 | Reset Nut House open door to `0` | `progress.resetNutHouseRooms()` |

Launcher/projector helpers:

| Helper group | Count | Notes |
| --- | ---: | --- |
| `nc_*.exe` | 10 | Navigation/content launch helpers with names for certificates, crosswords, guess-who, ballet/history, biography, music encyclopedia, favorite instrument, and Nutcracker activity. |
| `ncc_*.exe` | 7 | Companion navigation/content launch helpers for the same activity family. |
| `n_certificate.exe`, `nc_certificate.exe` | 2 | Flash projector-style helpers; strings include Flash/Macromedia projector paths and `dummy.swf`. |

Launcher helpers are not persistence primitives. In the remake they should become routes, modals, printable/exportable certificate screens, or intentionally deferred external-content placeholders.
