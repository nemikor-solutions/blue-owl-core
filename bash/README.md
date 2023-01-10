# Running the devices

1. Edit the config.sh file to 
  - set the location of the MQTT Server, the username and password
  - set the communication port used to talk to the Arduino.

2. If you are running more than one device from the same computer
  - edit the script to add a line with `export BLUE_OWL_SERIAL_PORT=COMx` before `npm run`