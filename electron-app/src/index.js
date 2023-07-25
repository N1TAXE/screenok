const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const MainScreen = require("./screens/main/mainScreen");
const UpdateScreen = require("./screens/updater/updateScreen");
const path = require('path');
const {saveConfigData, unregisterGlobalShortcuts, registerGlobalShortcuts} = require("./utils/utils");
const {autoUpdater} = require("electron-updater")

let mainWindow,
    updateWindow;

autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.autoDownload = false;

const createWindow = () => {
  mainWindow = new MainScreen();
  mainWindow.loadConfig()
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
});

autoUpdater.on("error", (info) => {
  updateWindow.showMessage(info);
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});