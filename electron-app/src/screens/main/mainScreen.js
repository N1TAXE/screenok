const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { app } = require('electron');
const {getConfigPath} = require("../../utils/utils");

class MainScreen {
    window;

    position = {
        width: 360,
        height: 600,
        maximized: false,
    };

    constructor() {
        this.window = new BrowserWindow({
            width: this.position.width,
            height: this.position.height,
            icon: './src/screens/main/build/favicon.ico',
            title: "GetBinder",
            show: false,
            frame: false,
            titleBarStyle: 'hidden',
            resizable: false,
            removeMenu: true,
            acceptFirstMouse: true,
            autoHideMenuBar: true,
            webPreferences: {
                preload: path.join(__dirname, "./mainPreload.js"),
                nodeIntegration: true,
            },
        });

        this.window.once("ready-to-show", () => {
            this.window.show();

            if (this.position.maximized) {
                this.window.maximize();
            }
        });

        this.handleMessages();

        let wc = this.window.webContents;

        try {
            // this.window.loadURL('http://localhost:3000');
            if (process.env.NODE_ENV === "development") {
                console.log(__dirname)
                this.window.loadURL('http://localhost:5173').then(() => {
                    console.log('React dev server loaded');
                    this.window.webContents.openDevTools();
                })
                    .catch(e => console.error('Failed to load React:', e));
            } else {
                this.window.loadFile("./src/screens/main/build/index.html");
            }
        } catch (e) {
            console.log(e)
        }
    }

    loadConfig() {
        try {
            const configContent = fs.readFileSync(getConfigPath(), 'utf-8');
            const configData = JSON.parse(configContent);
            this.window.webContents.executeJavaScript(`window.postMessage({ type: 'config-data', payload: ${JSON.stringify(configData)} }, '*');`);
        } catch (e) {
            console.log(e)
        }
    }

    showMessage(message) {
        console.log("showMessage trapped");
        console.log(message);
        this.window.webContents.send("updateMessage", message);
    }

    minimize() {
        this.window.minimize();
    }

    close() {
        this.window.close();
        ipcMain.removeAllListeners();
    }

    hide() {
        this.window.hide();
    }

    handleMessages() {
        //Ipc functions go here.
    }
}

module.exports = MainScreen;