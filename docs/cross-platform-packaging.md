# Cross-platform Packaging Feasibility

Linear issue: JIP-344

## Decision

The macOS ARM64 app/DMG is the only produced release-candidate artifact. Windows and Linux builds remain feasible in Tauri, but they are deferred until they can be built and tested on a native Windows host and a native Linux host. An untested cross-compiled installer would be experimental evidence, not a deliverable.

## Native commands

After copying the private source/assets to the target machine and running `npm ci` from `app/`:

| Platform | Command | Native requirements | Output status |
| --- | --- | --- | --- |
| Windows | `npm run tauri -- build --bundles nsis,msi --no-sign` | Rust MSVC target, Visual Studio C++ build tools, WebView2, NSIS/WiX tooling | Deferred; must be built and smoke-tested on Windows |
| Linux | `npm run tauri -- build --bundles appimage,deb,rpm` | Rust GNU target, WebKitGTK development packages, distro packaging tools | Deferred; must be built and smoke-tested on Linux |

The local macOS Tauri CLI correctly exposes only macOS bundle values (`app`, `dmg`, and `ios`), so it cannot prove the Windows/Linux installer paths from this host.

## Platform-specific QA risks

- The recovered source contains filenames whose case must match exactly on Linux filesystems.
- MP3/WAV playback depends on the native WebView/media stack and must be tested with representative preview, loop, feedback, and long-form tracks.
- Persistence must be verified across process restarts in each platform's WebView storage location.
- Windows installers need WebView2/runtime behavior and SmartScreen caveats tested; Linux packages need WebKitGTK/runtime dependency coverage.
- Original and SWF-derived media remains private. Any Windows/Linux artifact must carry the same distribution-rights warning as the macOS build.

No Windows/Linux artifact was created, signed, published, uploaded, or represented as tested during M09.
