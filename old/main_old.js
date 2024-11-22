const {app, BrowserWindow,Menu} = require ('electron');
const path = require('node:path')
const createWindow = ()=>{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true, // to allow require
            contextIsolation: false, 
            preload:path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
}

/******************************
 * create custom menu bar
 ******************************/
const isMac =process.platform === 'darwin';
const template = [
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]
  
//   const menu = Menu.buildFromTemplate(template)
  const menu = Menu.buildFromTemplate([{
    label: 'View',
    submenu: [
      { role: 'toggleDevTools' }
    ]
  },])
  Menu.setApplicationMenu(menu)
  /*****************************************
   * end menu creation
   ****************************************/

  
app.whenReady().then(()=>{
    createWindow();
    app.on('activate',()=>{
        BrowserWindow.getAllWindows().length ===0 ? createWindow(): '';
    })
})
app.on('window-all-closed', ()=>{
    process.platform === 'darwin' ? '':app.quit()
})