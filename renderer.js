
document.addEventListener('DOMContentLoaded', async () => {
    const portList = document.getElementById('ports');
    const connectButton = document.getElementById('connect');
	const table = $('#transformerTable').DataTable(); 

    const ports = await window.serialAPI.listPorts();
    ports.forEach(port => {
      const option = document.createElement('option');
      if(option){
        option.value = port.path;
        option.textContent = `${port.path} (${port.manufacturer || 'Unknown'})`;
        portList.appendChild(option);
      }
    });

    // Connect to the selected port
    connectButton?.addEventListener('click', async () => {
      const selectedPort = portList.value;
      console.log('selectedPort', selectedPort);

      try {
        console.log(typeof window.serialAPI.openPort);
        await window.serialAPI.openPort({ path: selectedPort, baudRate: 9600 });
        alert(`Connected to ${selectedPort}`);

        // Start reading data
        window.serialAPI.startReading('\n');
        } catch (error) {
          // connectionIcon.style.fill = 'red';
          alert(`Error connecting to port: ${error.message}`);
        }
    });

    // Handle incoming serial data
    window.serialAPI.onSerialData(data => {
      console.log(data)
      const [voltage, current, temperature, undervoltage, overvoltage, overcurrent] = data.split(' ');
     table.clear();
     table.row.add([
      'DT1', 'TTU Capus', current, voltage, temperature
     ])
     table.draw()


     const payload = {
      notification: {
          title:'Registration notification',
          body: 'lets see if it worked or not'
          },
      topic:'general'
      }
      
    });

    window.serialAPI.startPortMonitoring((port) => {
      console.log('Port monitoring started:', port.path);
    });

// Listen for available ports
    window.serialAPI.onPortAvailable((port) => {
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
	
	  document.getElementById('ws-connect').addEventListener('click', async () => {
		await window.serialAPI.connectToServer(); // Connect to the Socket.IO server
		console.log('Connected to server');
	  });
	  
	  document.getElementById('ws-send-message').addEventListener('click', async () => {
		const message = 'Hello from the client!';
		const result = await window.serialAPI.sendMessage(message); // Send message to server
		console.log(result); // Handle response from the main process
	  });
	  
	  document.getElementById('disconnectBtn')?.addEventListener('click', async () => {
		await window.serialAPI.disconnectFromServer(); // Disconnect from the Socket.IO server
		console.log('Disconnected from server');
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
        randomFloat(0, 50) + " A",                             // Current
        randomFloat(200, 240) + " V",                          // Voltage
        randomFloat(20, 80) + " °C",                           // Temperature
      ]);
    }
    console.log(data)
    return data;
  }
