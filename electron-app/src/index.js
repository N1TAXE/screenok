const { app, BrowserWindow, ipcMain } = require('electron');
const MainScreen = require("./screens/main/mainScreen");
const UpdateScreen = require("./screens/updater/updateScreen");
const {saveConfigData, unregisterGlobalShortcuts, registerGlobalShortcuts} = require("./utils/utils");
const {autoUpdater} = require("electron-updater")

let mainWindow,
    updateWindow;

autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.autoDownload = false;

const createWindow = () => {
  mainWindow = new MainScreen();
  mainWindow.loadConfig()

  ipcMain.on('minimizeAppWindow', () => {
    mainWindow.minimize();
  });

  ipcMain.on('closeAppWindow', () => {
    mainWindow.close();
    mainWindow = null;
  });

  ipcMain.on('save-config-data', (event, configData) => {
    saveConfigData(configData);
  });

  ipcMain.on('startShortCuts', () => {
    registerGlobalShortcuts();
  });

  ipcMain.on('stopShortCuts', () => {
    unregisterGlobalShortcuts();
  });

};

const createUpdateWindow = () => {
  updateWindow = new UpdateScreen();
};

app.whenReady().then(() => {
  createUpdateWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createUpdateWindow();
    }
  });

  autoUpdater.checkForUpdates();

  setTimeout(() => {
    updateWindow.close();
    updateWindow = null;
    createWindow();
  }, 1000);
});

autoUpdater.on("checking-for-update", (info) => {
  updateWindow.showMessage(`Проверка обновлений...`);
  updateWindow.setVersion(`${app.getVersion()}`);
  updateWindow.setStatus(`check-for-updates`);
});

autoUpdater.on("update-available", (info) => {
  updateWindow.showMessage(`Качаем обновление...`);
  let pth = autoUpdater.downloadUpdate();
  updateWindow.showMessage(pth);
  updateWindow.setStatus(`update-available`);
});

autoUpdater.on('update-not-available', (info) => {
  updateWindow.showMessage(`Последняя версия.`);
  updateWindow.setStatus(`update-not-available`);
  setTimeout(() => {
    updateWindow.close();
    updateWindow = null;
    createWindow();
  }, 1000)
});

autoUpdater.on("update-downloaded", (info) => {
  updateWindow.showMessage(`Обновление скачано, устанавливаем...`);
  updateWindow.setStatus(`update-downloaded`);
  setTimeout(() => {
    updateWindow.close();
    updateWindow = null;
  }, 1000)
});

autoUpdater.on("error", (info) => {
  updateWindow.showMessage(info);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});