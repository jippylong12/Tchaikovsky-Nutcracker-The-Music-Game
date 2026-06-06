# Local Media Bundle

`npm run assets:pipeline` copies private recovered audio and text data into ignored subdirectories here so Vite/Tauri can load them with stable `/local-media/...` paths.

Do not commit the generated `audio/`, `text/`, or `visual/` contents.
