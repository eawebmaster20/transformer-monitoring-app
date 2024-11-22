#include <SoftwareSerial.h>

// Create a software serial object for Bluetooth communication
SoftwareSerial BTSerial(11, 12); // RX, TX (Connect to HC-05 TX, RX pins)

int I = 0; // Current in milliamps
int V = 0; // Voltage in millivolts
int P = 0; // Power in milliwatts

void setup() {
  // Initialize hardware serial for debugging
  Serial.begin(9600);

  // Initialize software serial for Bluetooth communication
  BTSerial.begin(9600);

  // Inform that the system is ready
  // Serial.println("System Initialized");
  BTSerial.println("Bluetooth Ready");
}

void loop() {
  // Generate random values for current and voltage
  I = random(10, 20); // Random current between 10mA and 20mA
  V = random(220, 240); // Random voltage between 220mV and 240mV
  P = random(31, 45); // Random voltage between 220mV and 240mV

  // Calculate power (P = I * V / 1000 to convert to milliwatts)

  // Create a data string to send
  String data = String(I) + " " + String(V) + " " + String(P);

  // Print the values to the serial monitor
  Serial.println(data);

  // Send the data over Bluetooth
  BTSerial.println(data);

  // Wait for 2 seconds before the next iteration
  delay(15000);
}
