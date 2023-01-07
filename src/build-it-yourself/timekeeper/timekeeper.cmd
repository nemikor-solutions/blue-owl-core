rem Windows - try to use  our copy of node which has the right binary version
set PATH=%~dp0\..\..\..\node;%PATH%

set BLUE_OWL_MQTT_PASSWORD=test
set BLUE_OWL_MQTT_URL=mqtt://127.0.0.1:1883
set BLUE_OWL_MQTT_USERNAME=test
set BLUE_OWL_PLATFORM=A
set BLUE_OWL_SERIAL_PORT=COM6

npm run ts ./src/wokwi/timekeeper/timekeeper.ts