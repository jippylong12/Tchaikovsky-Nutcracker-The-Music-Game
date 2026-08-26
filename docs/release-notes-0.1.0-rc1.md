# Tchaikovsky Nutcracker Music Game 0.1.0-rc1

Private local preservation release candidate for macOS ARM64.

## Included

- Source-backed overture, main room, story, biography, ballet history, Musictionary, and Listening Room.
- Eight Nutcracker song games with recovered chooser/progression, source audio, rewards, and printable certificate fallback.
- Trivia, Funky Monkey Melody, MusiCards, Find Me On The Tree, Flying Instruments, Children's Album, Loopy Tunes, Orchestra, Toy Soldiers, Waltz, Alice puzzles, and Nut House flows.
- Local progress persistence and shared scene-aware audio playback.
- A source-derived application icon and final private-package metadata.
- Production packaging without the developer route map, progress cheats, or audio diagnostics panel.

## Build and install

From `app/`:

```sh
npm run package:mac
```

Open the generated DMG under `app/src-tauri/target/release/bundle/dmg/`, drag **Tchaikovsky Nutcracker Music Game.app** to Applications, then use Finder's **Open** command from the app's context menu if Gatekeeper warns about the non-notarized private build.

Verified ARM64 DMG for this candidate: `Tchaikovsky Nutcracker Music Game_0.1.0_aarch64.dmg`, 162,022,167 bytes, SHA-256 `4966dca0af4fe6da39c01ccb7253d4e72675188fa09ada7ef485847081817387`.

The package is ad-hoc signed, not Developer ID signed, and not notarized. Do not bypass Gatekeeper for any copy whose hash/source you do not trust.

## Known limitations and open gates

- Marcus has not yet provided the explicit UI/gameplay approvals required by JIP-349, JIP-818/JIP-819/JIP-820, JIP-825/JIP-830/JIP-835, JIP-840/JIP-845/JIP-850, and JIP-345.
- Automated tests and source-atlas checks cannot approve rendered visual fidelity, native audio perception, host print/PDF UI, or every end-to-end packaged interaction.
- Some recovered Flash display lists and animated timelines cannot be flattened by the local SWF tools. Every retained fallback and exact tool failure is documented in the route source maps and source atlas.
- The current artifact is ARM64-only. Windows/Linux packages are deferred pending native-host build and smoke testing.
- The app is a local preservation build; it has not been uploaded, deployed, published, or submitted to an app store.

## Distribution rights

This is a private local preservation remake that requires the original recovered Tchaikovsky's Nutcracker: The Music Game assets. Original art, audio, text, and Flash-derived media are not licensed for public redistribution by this project.
