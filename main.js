const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

let db;
function initDatabase() {
  const dataDir = app.getPath('userData');
  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(path.join(dataDir, 'pedidos-pro.db'));
  db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS app_storage (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 950, minWidth: 900, minHeight: 650,
    title: 'Pedidos Pro',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}
ipcMain.on('db:get', (event, key) => {
  try { event.returnValue = db.prepare('SELECT value FROM app_storage WHERE key = ?').get(String(key))?.value ?? null; }
  catch (e) { event.returnValue = null; }
});
ipcMain.on('db:set', (event, key, value) => {
  try {
    db.prepare(`INSERT INTO app_storage(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP`)
      .run(String(key), String(value));
    event.returnValue = true;
  } catch (e) { event.returnValue = false; }
});
ipcMain.on('db:remove', (event, key) => {
  try { db.prepare('DELETE FROM app_storage WHERE key = ?').run(String(key)); event.returnValue = true; }
  catch (e) { event.returnValue = false; }
});
ipcMain.on('db:clear', (event) => {
  try { db.prepare('DELETE FROM app_storage').run(); event.returnValue = true; }
  catch (e) { event.returnValue = false; }
});
ipcMain.handle('backup:show-location', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'], title: 'Escolha a pasta para salvar uma cópia do banco de dados' });
  if (result.canceled || !result.filePaths[0]) return null;
  const destination = path.join(result.filePaths[0], 'pedidos-pro-backup.db');
  try {
    db.pragma('wal_checkpoint(FULL)');
    fs.copyFileSync(path.join(app.getPath('userData'), 'pedidos-pro.db'), destination);
    return { ok: true, path: destination };
  } catch (e) { return { ok: false, error: e.message }; }
});
app.whenReady().then(() => {
  initDatabase();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('before-quit', () => { if (db) { try { db.pragma('wal_checkpoint(FULL)'); db.close(); } catch(e) {} } });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
