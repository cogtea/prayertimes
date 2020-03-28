const {app, Menu} = require('electron')

const template = [
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Get Application Source Code',
        click () { require('electron').shell.openExternal('https://github.com/gardencoder') }
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