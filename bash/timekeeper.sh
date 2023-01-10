#!/bin/bash -

SCRIPTDIR=$(dirname -- "$(readlink -f "${BASH_SOURCE}")")
source $SCRIPTDIR/config.sh

npm run ts build-it-yourself/scripts/timekeeper.ts