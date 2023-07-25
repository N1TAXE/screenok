const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const MainScreen = require("./screens/main/mainScreen");
const path = require('path');
const {saveConfigData, unregisterGlobalShortcuts, registerGlobalShortcuts} = require("./utils/utils");
const {autoUpdater} = require("electron-updater")

let mainWindow;
autoUpdater.autoInstallOnAppQuit = true;

const createWindow = () => {
  mainWindow = new MainScreen();
  mainWindow.loadConfig()
};

app.whenReady().then(() => {
  autoUpdater.checkForUpdates();
  createWindow();
});

autoUpdater.on('update-available', () => {
  autoUpdater.quitAndInstall();
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

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
