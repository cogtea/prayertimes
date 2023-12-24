const {app} = require('electron')
const HomePage =require('./windows/home.js');

const Sentry = require("@sentry/electron/main");
Sentry.init({
  dsn: 'https://feec67241bf837a3c4b26daefd57630a@o4506450306990080.ingest.sentry.io/4506450308956160',
});

require('dotenv').config();

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
