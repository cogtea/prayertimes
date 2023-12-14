const {app, BrowserWindow, Menu} = require('electron')

const template = [
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: function () {
          // Get the currently focused window
          const focusedWindow = BrowserWindow.getFocusedWindow();

          // Check if there is a focused window and if it has a webContents
          if (focusedWindow && focusedWindow.webContents) {
            focusedWindow.webContents.toggleDevTools();
          }
        },
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Get Application Source Code',
        click () { require('electron').shell.openExternal('https://github.com/cogtea') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {label: 'about', click () {  }},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  template[1].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}

if (process.platform === 'win32') {
  Menu.setApplicationMenu(null)
}else{
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}