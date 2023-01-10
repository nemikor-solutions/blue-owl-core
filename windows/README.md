# Running the devices

1. Edit the config.cmd file to 
  - set the location of the MQTT Server, the username and password
  - set the communication port used to talk to the Arduino.

2. If you are running more than one device from the same computer
  - edit the script to add a line with `set BLUE_OWL_SERIAL_PORT=COMx` before `npm run`