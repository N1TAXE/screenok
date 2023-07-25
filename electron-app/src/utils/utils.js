const path = require("path");
const fs = require('fs');
const log = require('electron-log');
const {desktopCapturer, screen, globalShortcut, app} = require('electron')

// Путь для хранения логов (в примере это папка "logs" в корне приложения)
const exeDir = path.dirname(process.execPath);
const logDir = path.join(exeDir, 'logs');
const logFilePath = path.join(logDir, 'log.txt');

// Создаем папку для хранения логов, если она не существует
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Настройка уровня логирования (опционально)
log.transports.file.level = 'info'; // или 'debug', 'warn', 'error', 'verbose'

// Запрещаем вывод логов в консоль разработчика (DevTools)
log.transports.console.level = false;

// Настройка формата записи логов в файл (новый подход)
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

// Запись лога в файл
function saveToLog(text) {
    return fs.appendFile(logFilePath, `\n${text}`, err => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Logs saved:', logFilePath);
        }
    });
}


async function takeScreenshot(folder, name) {
    // Get the primary display
    const primaryDisplay = screen.getPrimaryDisplay();

    // Get its size
    const { width, height } = primaryDisplay.size;

    // Set up the options for the desktopCapturer
    const options = {
        types: ['screen'],
        thumbnailSize: { width, height },
    };

    // Get the sources
    const sources = await desktopCapturer.getSources(options);

    // Find the primary display's source
    const primarySource = sources.find(({display_id}) => display_id == primaryDisplay.id)

    // Get the image
    const image = primarySource.thumbnail;

    // Return image data
    const exeDir = path.dirname(process.execPath);
    const folderPath = path.join(exeDir, 'screenshots', folder);
    const screenshotPath = path.join(folderPath, `${name}.png`);

    if (!fs.existsSync(folderPath)) {
        try {
            fs.mkdirSync(folderPath, { recursive: true });
        } catch (err) {
            saveToLog(`Произошла ошибка: ${err}`);
            console.error('Failed to create folder:', err);
            return;
        }
    }

    fs.writeFile(screenshotPath, image.toPNG(), err => {
        if (err) {
            saveToLog(`Произошла ошибка: ${err}`);
            console.error('Failed to save screenshot:', err);
        } else {
            saveToLog(`Скриншот сохранен!`);
            console.log('Screenshot saved:', screenshotPath);
        }
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
    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`
}

function getConfigPath() {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'config.json');
}

function saveConfigData(configData) {
    try {
        const configPath = getConfigPath();
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf-8');
        console.log('Config saved:', configPath)
    } catch (e) {
        console.log('Config save error:', e)
    }
}

function registerGlobalShortcuts() {
    try {
        const configPath = getConfigPath();
        const configContent = fs.readFileSync(configPath, 'utf-8');
        console.log('Config loaded:', configPath)
        const configData = JSON.parse(configContent);
        configData.forEach(item => {
            if (item.shortcut !== null) {
                globalShortcut.register(item.shortcut, () => {
                    const folder = item.name;
                    takeScreenshot(folder, `${folder} ${getCurrentDate()}`);
                });
            }
        });
    } catch (e) {
        console.log(e)
    }
}

function unregisterGlobalShortcuts() {
    globalShortcut.unregisterAll();
}

module.exports = {
    getCurrentDate,
    takeScreenshot,
    saveConfigData,
    registerGlobalShortcuts,
    unregisterGlobalShortcuts,
    getConfigPath
};