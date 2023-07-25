const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

class UpdateScreen {
    window;

    position = {
        width: 200,
        height: 300,
        maximized: false,
    };

    constructor() {
        this.window = new BrowserWindow({
            width: this.position.width,
            height: this.position.height,
            title: "GetBinder",
            show: false,
            removeMenu: true,
            acceptFirstMouse: true,
            autoHideMenuBar: true,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: true,
                preload: path.join(__dirname, "./updatePreload.js"),
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
        // wc.openDevTools({ mode: "undocked" });

        try {
            // this.window.loadURL('http://localhost:3000');
            this.window.loadFile("./src/screens/updater/updater.html");
        } catch (e) {
            console.log(e)
        }
    }

    showMessage(message) {
        console.log("showMessage trapped");
        console.log(message);
        this.window.webContents.send("updateMessage", message);
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

module.exports = UpdateScreen;