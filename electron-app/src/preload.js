const {contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('config-data', (event, config) => {
    window.postMessage({ type: 'config-data', payload: config }, '*');
});

contextBridge.exposeInMainWorld('api', {
    saveConfigData: (configData) => {
        ipcRenderer.send('save-config-data', configData);
    },
    startShortCuts: () => {
        ipcRenderer.send('startShortCuts');
    },
    stopShortCuts: () => {
        ipcRenderer.send('stopShortCuts');
    }
});