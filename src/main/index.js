const {app, BrowserWindow, Notification, session, crashReporter} = require('electron')
const path = require('path')
const url = require('url')
const HomePage =require('./windows/home.js');
const remote = require('electron').remote;
require('dotenv').config();
// Don't crash please
crashReporter.start({
  productName: 'PrayerTimes',
  companyName: 'Garden Coder',
  submitURL: 'https://webhook.site/d12acb58-e406-4dfd-a10b-98124bbc1977',
  uploadToServer: true
});
// process.crash(); // Testing Crash

// Autoplay Policy 
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let homePage;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', HomePage.createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (homePage === null) {
    homePage = HomePage.createWindow();
  }
})
