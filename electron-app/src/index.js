const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const fs = require('fs');
const path = require('path');
const {captureScreenshot, getCurrentDate} = require("./utils/utils");
const log = require('electron-log');

if (require('electron-squirrel-startup')) {
  app.quit();
}

function saveConfigData(configData) {
  const configPath = path.join(__dirname, 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf-8');
}

ipcMain.on('save-config-data', (event, configData) => {
  saveConfigData(configData);
});


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 360,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const configPath = path.join(__dirname, 'config.json');
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const configData = JSON.parse(configContent);
  mainWindow.webContents.executeJavaScript(`window.postMessage({ type: 'config-data', payload: ${JSON.stringify(configData)} }, '*');`);

  mainWindow.setMenuBarVisibility(false);

  mainWindow.webContents.openDevTools();

  // mainWindow.loadURL('http://localhost:3000');
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

function registerGlobalShortcuts() {
  const configPath = path.join(__dirname, 'config.json');
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const configData = JSON.parse(configContent);
  configData.forEach(item => {
    globalShortcut.register(item.shortcut, () => {
      const folder = item.name;
      captureScreenshot(folder, `${folder} ${getCurrentDate()}`);
    });
  });
}

function unregisterGlobalShortcuts() {
  globalShortcut.unregisterAll();
}


app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('startShortCuts', () => {
  registerGlobalShortcuts();
});

ipcMain.on('stopShortCuts', () => {
  unregisterGlobalShortcuts();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
