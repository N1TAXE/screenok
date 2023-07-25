const { contextBridge, ipcRenderer } = require("electron");

let bridge = {
    updateMessage: (callback) => ipcRenderer.on("updateMessage", callback),
    status: (callback) => ipcRenderer.on("status", callback),
    version: (callback) => ipcRenderer.on("version", callback),
};

contextBridge.exposeInMainWorld("bridge", bridge);