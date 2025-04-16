const { contextBridge, ipcRenderer } = require('electron');

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('serialAPI', {
  listPorts: () => ipcRenderer.invoke('list-ports'),

  onPortListChange: (callback) => {
    ipcRenderer.on('port-list-updated', (_, ports) => callback(ports));
  },

  // Cleanup function to remove listener
  removePortListListener: () => {
    ipcRenderer.removeAllListeners('port-list-updated');
  },
  openPort: (options) => ipcRenderer.invoke('open-port', options),
  startReading: (delimiter) => ipcRenderer.send('start-reading', delimiter),
  onSerialData: (callback) => ipcRenderer.on('serial-data', (event, data) => callback(data)),
  onDisconnect: (callback) => ipcRenderer.on('serial-disconnect', (event) => callback(event)),
  
  startPortMonitoring: () => ipcRenderer.send('start-port-monitoring'),
  stopPortMonitoring: () => ipcRenderer.send('stop-port-monitoring'),
  onPortAvailable: (callback) => ipcRenderer.on('port-available', (event, port) => callback(port)),
  onPortUnavailable: (callback) => ipcRenderer.on('port-unavailable', (event, port) => callback(port)),
  fbadmin: () => ipcRenderer.invoke('init-fb'),
  
  connectToServer: async() => ipcRenderer.invoke('connect-to-server'),
  sendMessage: (message) => ipcRenderer.invoke('send-message', message),
  disconnectFromServer: () => ipcRenderer.invoke('disconnect-from-server'),
});
