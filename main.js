const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SerialPort } = require('serialport');
const admin = require('firebase-admin');
const { DelimiterParser } = require('@serialport/parser-delimiter');
const socketIOClient = require('socket.io-client');
// Create the main window
let mainWindow;
let currentPort;
let socket;

function connectSocket() {
  socket = socketIOClient('https://node-socketio-production-cf7a.up.railway.app'); // Connect to Socket.IO server on localhost:3000

  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
  });

  socket.on('message', (data) => {
    console.log('Message from server:', data);
  });
}
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();
});

ipcMain.handle('connect-to-server', () => {
  connectSocket();
});

ipcMain.handle('send-message', (event, message) => {
  if (socket) {
    socket.emit('message', message); // Emit message to the server
  }
  return { success: true };
});

ipcMain.handle('disconnect-from-server', () => {
  if (socket) {
    socket.disconnect();
  }
  return { success: true };
});

// Handle port listing
ipcMain.handle('list-ports', async () => {
  let ports = await SerialPort.list();
  return ports.map(port => ({ path: port.path, manufacturer: port.manufacturer }));
});

ipcMain.handle('init-fb', async () => {
  let ports = await SerialPort.list();
  return ports.map(port => ({ path: port.path, manufacturer: port.manufacturer }));
});



ipcMain.handle('open-port', async (event, { path, baudRate }) => {
  try {
    if (currentPort) await currentPort.close(); // Close any previously opened port

   currentPort = new SerialPort({ path, baudRate });

  await currentPort.open();
  return 'Port Openned successfully'
  } catch (error) {
    console.log('error happened here', error)
  }
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
      console.log(data.toString());
    });
  });


 let portMonitorInterval;
ipcMain.on('start-port-monitoring', async() => {
//  // Check ports every second
//  portMonitorInterval = setInterval(async () => {
//    try {
     let ports = await SerialPort.list();
     console.log(ports)
//      ports.forEach(port => {
//        mainWindow.webContents.send('port-available', port);
//      });
//    } catch (error) {
//      console.error('Error monitoring ports:');
//    }
//  }, 1000);
} );
ipcMain.on('stop-port-monitoring', () => {
 if (portMonitorInterval) {
   clearInterval(portMonitorInterval);
 }
});

