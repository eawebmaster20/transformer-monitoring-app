document.addEventListener('DOMContentLoaded', async () => {
    const portList = document.getElementById('ports');
    const connectButton = document.getElementById('connect');
  
    const domCurrentElement = document.getElementById('current');
    const domVoltageElement = document.getElementById('voltage');
    const domPowerElement = document.getElementById('power');
    const domTemperatureElement = document.getElementById('temp');
  
    // List available ports
    const ports = await window.serialAPI.listPorts();
    ports.forEach(port => {
      const option = document.createElement('option');
      option.value = port.path;
      option.textContent = `${port.path} (${port.manufacturer || 'Unknown'})`;
      portList.appendChild(option);
    });
  
    // Connect to the selected port
    connectButton.addEventListener('click', async () => {
      const selectedPort = portList.value;
  
      try {
        await window.serialAPI.openPort({ path: selectedPort, baudRate: 9600 });
        alert(`Connected to ${selectedPort}`);
        
        // Start reading data
        window.serialAPI.startReading('\n');
      } catch (error) {
        alert(`Error connecting to port: ${error.message}`);
      }
    });
  
    // Handle incoming serial data
    window.serialAPI.onSerialData(data => {
      const [current, voltage, temperature] = data.split(' ');
  
      domCurrentElement.textContent = `${current} A` || '--';
      domVoltageElement.textContent = `${voltage} V` || '--';
      domPowerElement.textContent = ((+current || 0) * (+voltage || 0)) / 1000 + 'Kw';
      domTemperatureElement.textContent = temperature + '°C' || '--';
    });
  });
  