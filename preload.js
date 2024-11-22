const { contextBridge, ipcRenderer } = require('electron');

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('serialAPI', {
  listPorts: () => ipcRenderer.invoke('list-ports'),
  openPort: (options) => ipcRenderer.invoke('open-port', options),
  startReading: (delimiter) => ipcRenderer.send('start-reading', delimiter),
  onSerialData: (callback) => ipcRenderer.on('serial-data', (event, data) => callback(data)),
});
