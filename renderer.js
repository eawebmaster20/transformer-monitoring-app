
document.addEventListener('DOMContentLoaded', async () => {
    const portList = document.getElementById('ports');
    const connectButton = document.getElementById('connect');
    const connectionIcon = document.querySelector('#connection');
    const domCurrentElement = document.getElementById('current');
    const domVoltageElement = document.getElementById('voltage');
    const domPowerElement = document.getElementById('power');
    const domTemperatureElement = document.getElementById('temp');

    $('#transformerTable').DataTable({
      data: generateRandomData(20),
      columns: [
        { title: "Name" },
        { title: "Location" },
        { title: "Power" },
        { title: "Current" },
        { title: "Voltage" },
        { title: "Temperature" },
        { title: "Actions" }
      ]
    });

    const ports = await window.serialAPI.listPorts();
    ports.forEach(port => {
      const option = document.createElement('option');
      option.value = port.path;
      option.textContent = `${port.path} (${port.manufacturer || 'Unknown'})`;
      portList.appendChild(option);
    });

    // Connect to the selected port
    connectButton?.addEventListener('click', async () => {
      const selectedPort = portList.value;
      console.log(window.serialAPI);

      try {
        await window.serialAPI.openPort({ path: selectedPort, baudRate: 9600 });
        alert(`Connected to ${selectedPort}`);

        // Start reading data
        window.serialAPI.startReading('\n');
        connectionIcon.style.fill = 'green';

      } catch (error) {
        connectionIcon.style.fill = 'red';
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

    window.serialAPI.startPortMonitoring((port) => {
      console.log('Port monitoring started:', port.path);
    });

// Listen for available ports
    window.serialAPI.onPortAvailable((port) => {
      // console.log('Port available:', port.path);
      let option = document.createElement('option');
      option.value = port.path;
      option.textContent = `${port.path} (${port.manufacturer || 'Unknown'})`;
      portList = Object.values(portList).includes(option)? portList : portList.appendChild(option);
      console.log(typeportList);
    });

    // Listen for disconnections
    window.serialAPI.onPortUnavailable((port) => {
      console.log('Port disconnected');
    });

  });

  function logger(id) {
    window.location.href = './detail.html';
    // console.log(id);
  }

  function generateRandomData(rows) {
    const names = ["TK-Ahodwo24", "TK-Ahodwo24", "TK-Dadieso-01", "TK-Dadieso-02", "TK-Dadieso-03", "TK-Dadieso-04", "TK-Dadieso-05", "TK-Dadieso-06", "TK-Dadieso-07", "TK-Dadieso-08"];
    const locations = ["Ahodwo Warehouse", "Ahodwo Warehouse", "Dadieso Warehouse", "Dadieso Warehouse", "Dadieso Warehouse", "Dadieso Warehouse", "Dadieso Warehouse", "Dadieso Warehouse", "Dadieso Warehouse", "Dadieso Warehouse"];

    const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

    const data = [];
    for (let i = 0; i < rows; i++) {
      data.push([
        names[Math.floor(Math.random() * names.length)],     // Name
        locations[Math.floor(Math.random() * locations.length)], // Location
        randomFloat(100, 1000) + " W",                         // Power
        randomFloat(0, 50) + " A",                             // Current
        randomFloat(200, 240) + " V",                          // Voltage
        randomFloat(20, 80) + " °C",                           // Temperature
        `<button class="view-btn" onClick="logger(event.target.id)" data-id="${i}">View</button>
         <button class="edit-btn" data-id="${i}">Edit</button>
         <button class="delete-btn" data-id="${i}">Delete</button>`
      ]);
    }
    return data;
  }