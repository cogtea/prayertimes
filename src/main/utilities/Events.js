const {ipcMain} = require('electron')

ipcMain.on('events-channels', (event, arg) => {
  switch (arg) {
    case 'updateSettings':
       homePage.webContents.send('events-channels-render', 'updateSettings');
      break;
    default:
  }
})
