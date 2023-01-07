#!/bin/bash -

# force the use of the local node if one is present, else use
# installed version hoping it is the same release.
SCRIPTDIR=$(dirname -- "$(readlink -f "${BASH_SOURCE}")")
PATH="$SCRIPTDIR/../../../node;$PATH"

export BLUE_OWL_MQTT_PASSWORD=test
export BLUE_OWL_MQTT_URL=mqtt://127.0.0.1:1883
export BLUE_OWL_MQTT_USERNAME=test
export BLUE_OWL_PLATFORM=A
export BLUE_OWL_SERIAL_PORT=COM6

which npm
npm run ts ./src/build-it-yourself/timekeeper/timekeeper.ts