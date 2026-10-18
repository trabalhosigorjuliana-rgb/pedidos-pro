const { contextBridge, ipcRenderer } = require('electron');

// IPC assíncrono: evita bloquear a interface enquanto o banco SQLite é acessado.
contextBridge.exposeInMainWorld('desktopStorage', {
  getItem: (key) => ipcRenderer.invoke('db:get', String(key)),
  setItem: (key, value) => ipcRenderer.invoke('db:set', String(key), String(value)),
  removeItem: (key) => ipcRenderer.invoke('db:remove', String(key)),
  clear: () => ipcRenderer.invoke('db:clear'),
  backupToFolder: () => ipcRenderer.invoke('backup:show-location')
});
