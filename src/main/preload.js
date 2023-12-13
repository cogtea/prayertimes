const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    store: {
        get(key, defaultValue) {
            return ipcRenderer.sendSync('electron-store-get', key, defaultValue);
        },
        set(key, val) {
            ipcRenderer.send('electron-store-set', key, val);
        },
    },
});