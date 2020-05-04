const {app, ipcMain, BrowserWindow, Tray, session} = require('electron');
const path = require('path');
const url = require('url');
const settings = require('electron-settings');
const Positioner = require('electron-positioner');

module.exports = {
  createWindow: function () {
    homePage = new BrowserWindow({
        width: 560,
        height: 420,
        minWidth: 560,
        minHeight: 420,
        icon: path.join(__dirname, '../../assets/icons/png/64x64.png'),
        webPreferences: {
          nodeIntegration: true //This window has node integration enabled by default. In Electron 5.0.0, node integration will be disabled by default. To prepare for this change, set {nodeIntegration: true} in the webPreferences for this window, or ensure that this window does not rely on node integration and set {nodeIntegration: false}.

        }
      })
    
    // and load the index.html of the app.
    homePage.loadURL(url.format({
      pathname: path.join(__dirname, '../../render/layouts/app.html'),
      protocol: 'file:',
      slashes: true
    }))

    // Open the DevTools.
    if(process.env.DEBUG == 'true')
       homePage.webContents.openDevTools();

    // Emitted when the window is closed.
    homePage.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
    
    // Show  Tray icon
    let iconPath = path.join(__dirname, '../../assets/icons/png/24x24.png')
    var trayIcon = new Tray(iconPath);
    trayIcon.setToolTip('PrayerTimes');
    trayIcon.on('click', (e, bounds) => {
      if ( homePage.isVisible() ) {
        homePage.hide();
      } else {
        let positioner = new Positioner(homePage);
        positioner.move('trayCenter', bounds)

        homePage.show();
      }
    });
    
    require('../menu/common.js');
    require('../utilities/Events.js');

  }
}
