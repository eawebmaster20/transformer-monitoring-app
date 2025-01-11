const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SerialPort } = require('serialport');
const { DelimiterParser } = require('@serialport/parser-delimiter');

// Create the main window
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
});

// Handle port listing
ipcMain.handle('list-ports', async () => {
  const ports = await SerialPort.list();
  return ports.map(port => ({ path: port.path, manufacturer: port.manufacturer }));
});

// Handle port opening
let currentPort;

ipcMain.handle('open-port', async (event, { path, baudRate }) => {
  if (currentPort) currentPort.close(); // Close any previously opened port

  currentPort = new SerialPort({ path, baudRate });

  return new Promise((resolve, reject) => {
    currentPort.on('open', () => resolve({ success: true }));
    currentPort.on('error', err => reject({ success: false, error: err.message }));
  });
});

// Relay serial data to renderer
ipcMain.on('start-reading', (event, delimiter) => {
    if (!currentPort) {
      event.sender.send('error', 'No port is open');
      return;
    }
  
    const { DelimiterParser } = require('@serialport/parser-delimiter');
    const parser = currentPort.pipe(new DelimiterParser({ delimiter }));
  
    parser.on('data', data => {
      mainWindow.webContents.send('serial-data', data.toString());
      console.log(data);
    });
  });


 let portMonitorInterval;
ipcMain.on('start-port-monitoring', () => {
 // Check ports every second
 portMonitorInterval = setInterval(async () => {
   try {
     const ports = await SerialPort.list();
     ports.forEach(port => {
       mainWindow.webContents.send('port-available', port);
     });
   } catch (error) {
     console.error('Error monitoring ports:', error);
   }
 }, 1000);
} );
ipcMain.on('stop-port-monitoring', () => {
 if (portMonitorInterval) {
   clearInterval(portMonitorInterval);
 }
});

