const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 760,
    minWidth: 960,
    minHeight: 600,
    center: true,
    title: 'Crystal Collector 2.0',
    backgroundColor: '#05050f',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Remove default top menu bar for clean game UI
  Menu.setApplicationMenu(null);

  // Load production game build
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  mainWindow.on('page-title-updated', (e) => {
    e.preventDefault();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
