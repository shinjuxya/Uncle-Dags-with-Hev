// Catching Dags with Hev - Electron wrapper (loads the existing index.html, fully offline)
const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

ipcMain.on('game-host:creator-exempt', (event) => {
  event.returnValue = fs.existsSync(path.join(app.getPath('userData'), '.creator-device'));
});

// Only allow one copy of the game at a time
const hasSingleInstanceLock = app.requestSingleInstanceLock();

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    show: false,
    backgroundColor: '#0d1630',
    title: 'Catching Dags with Hev',
    autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'app.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      autoplayPolicy: 'no-user-gesture-required', // lets the music play without extra clicks
      spellcheck: false
    }
  });

  Menu.setApplicationMenu(null);          // no File/Edit/View menu bar
  win.loadFile(path.join(__dirname, '..', 'index.html'));
  win.once('ready-to-show', () => { win.show(); win.focus(); });
  win.on('page-title-updated', (e) => e.preventDefault()); // keep our window title

  // Remove browser-only behaviour: right-click menu, reload and dev-tools shortcuts
  win.webContents.on('context-menu', (e) => e.preventDefault());
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    const k = (input.key || '').toLowerCase();
    if (k === 'f11') { win.setFullScreen(!win.isFullScreen()); event.preventDefault(); }
    else if (k === 'escape' && win.isFullScreen()) { /* let the game use Esc; F11 exits fullscreen */ }
    else if (k === 'f12' || k === 'f5' || (input.control && (k === 'r' || k === 'w' || (input.shift && k === 'i')))) {
      if (k !== 'w') event.preventDefault();
    }
  });

  // Never navigate away from the game; open outside links in the normal browser
  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}
