#include <SoftwareSerial.h>

// Define software serial pins for Bluetooth communication
SoftwareSerial BTSerial(11, 12); // RX (11) | TX (12)

void setup() {
  // Initialize hardware serial for debugging
  Serial.begin(9600);

  // Initialize software serial for Bluetooth communication
  BTSerial.begin(9600); // Match the baud rate of the HC-05 module

  // Inform that the system is ready
  Serial.println("Bluetooth Receiver Ready");
}

void loop() {
  // Check if data is available from the Bluetooth module
  if (BTSerial.available()) {
    // Read data from Bluetooth module
    char receivedChar = BTSerial.read();

    // Write data to the serial monitor
    Serial.write(receivedChar);
  }
}
