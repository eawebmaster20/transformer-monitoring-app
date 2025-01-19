#include <SoftwareSerial.h>

// Create a software serial object for Bluetooth communication
SoftwareSerial BTSerial(11, 12); // RX, TX (Connect to HC-05 TX, RX pins)

void setup() {
  // Initialize hardware serial for debugging
  Serial.begin(9600);

  // Initialize software serial for Bluetooth communication
  BTSerial.begin(9600);

  // Inform that the system is ready
  Serial.println("System Initialized");
  BTSerial.println("Bluetooth transmitter Ready");
}

void loop() {
  // Check if data is available on the Serial monitor
  if (Serial.available()) {
    // Read the input from Serial
    String input = Serial.readStringUntil('\n'); // Read until newline character
    
    // Send the input data to the Bluetooth device
    BTSerial.println(input);

    // Print confirmation to the Serial monitor
    Serial.println("Sent to Bluetooth: " + input);
  }

  // Check if data is available from Bluetooth
  if (BTSerial.available()) {
    // Read the input from Bluetooth
    String btInput = BTSerial.readStringUntil('\n'); // Read until newline character

    // Print the received data to the Serial monitor
    Serial.println("Received from Bluetooth: " + btInput);
  }

  // Add a small delay to avoid flooding the serial communication
  delay(100);
}
