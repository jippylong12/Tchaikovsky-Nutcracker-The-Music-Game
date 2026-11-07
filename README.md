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

The CD's own media is not stored in this repository. A local copy of the recovered install is expected under `analysis/setup/app/`, and the app mirrors what it needs from there.

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

You need Node.js, Rust, and the recovered install under `analysis/setup/app/`.

```sh
cd app
npm install
npm run tauri:dev
```

More detail for developers is in [app/README.md](app/README.md) and under [docs/](docs/).
