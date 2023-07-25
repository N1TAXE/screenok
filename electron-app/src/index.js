const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const {getCurrentDate, takeScreenshot, saveConfigData} = require("./utils/utils");
const {autoUpdater, AppUpdater} = require("electron-updater")

let updaterWindow;
autoUpdater.autoInstallOnAppQuit = true;

// Проверьте обновления при старте приложения
app.on('ready', () => {
  createUpdaterWindow(); // Создание окна обновления
});

function createUpdaterWindow() {
  updaterWindow = new BrowserWindow({
    width: 360,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  updaterWindow.setMenuBarVisibility(false);
  updaterWindow.loadFile(path.join(__dirname, 'updater.html')); // Имя файла HTML с информацией об обновлении

  autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", (info) => {
    if (updaterWindow) {
      updaterWindow.webContents.send("update-available", info);
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on('update-not-available', (info) => {
    updaterWindow.webContents.send("update-not-available", info);
    if (updaterWindow) {
      updaterWindow.close();
    }
    createWindow();
  });
}



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

  // mainWindow.webContents.openDevTools();

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
      takeScreenshot(folder, `${folder} ${getCurrentDate()}`);
    });
  });
}

function unregisterGlobalShortcuts() {
  globalShortcut.unregisterAll();
}

ipcMain.on('save-config-data', (event, configData) => {
  saveConfigData(configData);
});

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
