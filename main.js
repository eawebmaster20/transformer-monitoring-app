require('dotenv').config();
const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const { SerialPort } = require('serialport');
const admin = require('firebase-admin');
const { DelimiterParser } = require('@serialport/parser-delimiter');
const socketIOClient = require('socket.io-client');
// Create the main window
let mainWindow;
let currentPort;
let socket;


async function connectSocket() {
  return new Promise((resolve, reject) => {
    try {
      socket = socketIOClient(process.env.SOCKET_SERVER_HOST);

      // Success: connected
      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        resolve(true);
      });

      // Fail (e.g. server unreachable)
      socket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
        resolve(false);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
      });

      socket.on('message', (data) => {
        console.log('Message from server:', data);
      });
    } catch (err) {
      console.error('Unexpected connection error:', err);
      resolve(false);
    }
  });
}

// remove the default electron menu
const menu = Menu.buildFromTemplate([])
Menu.setApplicationMenu(menu)

// Create the application's main window when the app is ready. This is the first event
app.on('ready', async() => {
  mainWindow = new BrowserWindow({
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  secondWindow = new BrowserWindow(
    {
      width: 800,
      height: 600,
      minWidth: 800,
      alwaysOnTop: true,
      // parent: mainWindow,
    }
  ).loadURL('https://drive.google.com/file/u/0/d/1lx6S_9oo510jI-ZfYJN8pvMNN9Lad5Tc/view');
  // mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();

  // Create a serial port object and make it available to the renderer
  /* @variable for ports */
  let ports;
  const updatePorts = async () => {
    const newPorts = await SerialPort.list();
    if (ports?.length !== newPorts?.length) {
      ports = newPorts;
      // mainWindow.webContents.send('port-list-updated', ports)
    }
    else{
      // mainWindow.webContents.send('port-list-updated', newPorts)
    }
 };

  // Poll for updates every 5 seconds
  setInterval(updatePorts, 5000);

  const response = await connectSocket();
  console.info('connection res :',response);

});

ipcMain.handle('file-picker', async() => {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  console.log(canceled, filePaths)
});

// ipcMain.handle('connect-to-server', async() => {
//   // console.log('Connecting to server');
//   const response = await connectSocket()
//   console.info(response);
//   // return response
// });

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
      // mainWindow.webContents.send('serial-data', data.toString());
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

