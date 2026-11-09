CATCHING DAGS WITH HEV - WINDOWS APP (ELECTRON)

Keep the project files together in one folder. The game uses:
  index.html, styles\style.css, three.min.js
  scripts\game.js, scripts\embedded-assets.js
  scripts\main.js, scripts\preload.js, scripts\ensure-electron.js
  package.json, package-lock.json
  app.ico, assets\audio\catch.wav, assets\audio\miss.wav
  assets\secret-worlds\ (five MP3 files)

The HTML contains the game structure. Gameplay logic is in scripts\game.js,
shared embedded media is in scripts\embedded-assets.js, and presentation
styles are in styles\style.css. Keep the listed files and assets together
when running or packaging.

Open the folder in VS Code, open Terminal (Ctrl+`) and run:
  1) npm install
  2) npm start
  3) npm run dist

The game opens in its own Electron window. The Windows installer is created in:
  dist\Catching-Dags-with-Hev-Setup-1.0.0.exe

The installer creates Desktop and Start Menu shortcuts.
F11 toggles fullscreen.
