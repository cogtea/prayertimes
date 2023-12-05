// src/main/utilities/Events.js
const {ipcMain} = require('electron');
const Store = require('electron-store');

ipcMain.on('events-channels', (event, arg) => {
  switch (arg) {
    case 'updateSettings':
       homePage.webContents.send('events-channels-render', 'updateSettings');
      break;
    default:
  }
})

const store = new Store();
ipcMain.on('electron-store-get', async(event, key,defaultVal) => {
  event.returnValue = store.get(key, defaultVal);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});