call %~dp0/config.cmd

rem remove rem from the following line to set the port explicitly
set BLUE_OWL_SERIAL_PORT=COM10

npm run ts build-it-yourself/scripts/timekeeper.ts