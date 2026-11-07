# Tchaikovsky Nutcracker: The Music Game

A desktop revival of the 2003 Windows CD-ROM *Tchaikovsky Nutcracker: The Music Game*.

The original CD ran on a Windows-only Flash projector (`Nutcracker2.exe`) that modern computers can no longer open. This project brings the game back as a normal desktop app. The goal is that it plays exactly like the CD did.

## How it works

The game was never rebuilt by hand. The app plays the **original Flash movies from the CD** through [Ruffle](https://ruffle.rs), an open-source Flash player, inside a small desktop shell built with [Tauri](https://tauri.app).

- **The projector:** the launcher, the music room, the help guide, the exit credits, and the Nutcracker Club pages are the CD's own projector movie, playing live.
- **The games and activities:** every object in the music room loads the original game, the same way the CD did. That covers the story, ballet and biography readers, the Musical Encyclopedia, the Listening Room, Music Trivia, MusiCards, Flying Instruments, the Funky Monkey, the Orchestra Game, Find Me On The Tree, the Children's Album, the NutHouse, and the Nutcracker song games.
- **What the shell adds:** the old CD wrote progress files and ran small Windows helper programs. The shell does those jobs instead:
  - keys and doors you earn are saved between sessions;
  - the website link opens in your browser;
  - quitting closes the app.
- **Ruffle fixes:** where Ruffle behaves differently from the 2003 Flash projector, the shell patches only that spot and documents it. One example is that the Listening Room expected its songs to load instantly.

## The original game files

The original CD files are in this repository under `original-cd/`, compressed and split into parts under 50 MB. They are the 480 files the CD installed (every movie, sound, and text file, unchanged), plus the Internet Archive scans of the disc and sleeve.

They unpack into `analysis/setup/app/` (the game) and `base/` (the scans). The unpacked folders are not committed. Every part and the whole archive are checked against SHA-256 checksums, so a damaged download fails loudly instead of running a broken game. Unpacking needs only Node, with no unzip or tar.

The raw disc image (`.iso`) is not included because it holds the same files a second time and the app never reads it. It is the Internet Archive item [`tchaikovsky-nutcracker-the-music-game-quaint-interactive`](https://archive.org/details/tchaikovsky-nutcracker-the-music-game-quaint-interactive): 244,436,992 bytes, SHA-256 `549cb5ea511f30c961483a2a6a84bdf11ae73663214510ffaedb8cbdced9e217`.

Maintainers who change the recovered files repack them with `node app/scripts/pack-original-cd.mjs`.

## Status

| Stage | What | State |
| --- | --- | --- |
| 0-3 | Shell, opening, launcher, music room | Playing the original projector |
| 4-5 | Nutcracker song games, room activities | Playing the original games; being play-tested |
| 6 | Package and ship | Not started |

Known gaps:

- The **printable certificates and activity sheets** on the Nutcracker Club pages don't do anything yet. These are 2 certificates plus Guess Who, the crosswords, and similar sheets. On the CD, each was a small Windows program that printed one page.
- The **key drawer** in the music room stays empty. The original file that drew collected keys into it (`games/keycontroller.swf`) is missing from the recovered CD.

## The plan: a double-click app

Stage 6 turns this into a normal desktop application. On a Mac that means a `.app` and a `.dmg` installer that you open with a double-click, with no Flash, browser, or setup needed. The same Tauri project can build a Windows `.exe` as well. Before shipping, we still have to decide how to bundle the roughly 186 MB of original game files.

## Running it (development)

You need Node.js and Rust.

```sh
cd app
npm install
npm run setup:cd
npm run tauri:dev
```

`npm run setup:cd` unpacks the original game files once (about 250 MB, under a minute). `dev` and `build` also run it automatically, and it skips the work when the files are already unpacked.

More detail for developers is in [app/README.md](app/README.md) and under [docs/](docs/).
