const screenshot = require("screenshot-desktop");
const path = require("path");
const fs = require('fs');
const { app } = require('electron');

function captureScreenshot(folder, name) {
    const exeDir = path.dirname(process.execPath);
    const folderPath = path.join(exeDir, 'screenshots', folder);
    const screenshotPath = path.join(folderPath, `${name}.png`);

    if (!fs.existsSync(folderPath)) {
        try {
            fs.mkdirSync(folderPath, { recursive: true });
        } catch (err) {
            console.error('Failed to create folder:', err);
            return;
        }
    }

    screenshot().then(imageBuffer => {
        fs.writeFile(screenshotPath, imageBuffer, err => {
            if (err) {
                console.error('Failed to save screenshot:', err);
            } else {
                console.log('Screenshot saved:', screenshotPath);
            }
        });
    }).catch(err => {
        console.error('Failed to capture screenshot:', err);
    });
}

function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Обратите внимание, что месяцы идут с 0 до 11, поэтому добавляем 1
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const milliseconds = currentDate.getMilliseconds();
    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`
}

module.exports = { captureScreenshot, getCurrentDate };