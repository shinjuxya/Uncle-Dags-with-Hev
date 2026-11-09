const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('gameHost', Object.freeze({
  creatorExempt: ipcRenderer.sendSync('game-host:creator-exempt') === true
}));
