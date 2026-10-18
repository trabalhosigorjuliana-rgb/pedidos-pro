const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktopStorage', {
  getItem: (key) => ipcRenderer.sendSync('db:get', String(key)),
  setItem: (key, value) => ipcRenderer.sendSync('db:set', String(key), String(value)),
  removeItem: (key) => ipcRenderer.sendSync('db:remove', String(key)),
  clear: () => ipcRenderer.sendSync('db:clear'),
  backupToFolder: () => ipcRenderer.invoke('backup:show-location')
});
