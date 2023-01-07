#!/bin/bash -
export BLUE_OWL_MQTT_PASSWORD=test
export BLUE_OWL_MQTT_URL=mqtt://127.0.0.1:1883
export BLUE_OWL_MQTT_USERNAME=test
export BLUE_OWL_PLATFORM=A
export BLUE_OWL_SERIAL_PORT=COM6

npm run ts ./src/build-it-yourself/jury/jury-5.ts