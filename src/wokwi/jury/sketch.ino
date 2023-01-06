// no code is necessary to run Firmata
//
// requires Edge or Chrome

// INITIAL SETUP
// - Install Node.js 16 - On Windows make sure that you choose the option to install the C++ tools.
// - Install com0com v2.2.2.0 on Windows 10 or 11 to create a pair of ports
//   * use the setup command prompt to create a pair of ports (e.g. COM5 and COM6)
//       install PortName=COM5 PortName=COM6
// - Check out https://github.com/jflamy/blue-owl (or download the zip)
//   
// DOWNLOAD FIRMATA FIRMWARE
// Use a StandardFirmata.ino.with_bootloader.hex generated from Arduino IDE.
// WokwiUno appears to require using the UnoMini confit.
//
// For Wokwi Mega: https://www.dropbox.com/s/ye3gajzfoenkk5v/Mega_StandardFirmata.ino.with_bootloader.hex?dl=0
// For Wokwi Uno: https://www.dropbox.com/s/pb0aryykchb3tgw/Uno_StandardFirmata.ino.with_bootloader.hex?dl=0
//
// RUNNING FIRMATA ON THE DEVICE
// - Click in this area -- where you are reading this text.
// - Hit F1 and type "Load" - select "Load HEX file and start simulation"
// - Select the correct firmware you have downloaded
// - Chrome will prompt for a port, use one of the pair created (e.g. COM5)
//
// RUNNING THE BLUE-OWL DRIVER SCRIPT
// - Go to the src/scripts/wokwi/jury directory
// - Edit the jury.sh script to use owlcms.jflamy.dev as the MQTT server
// - contact jf at jflamy.dev to get a password (for a short test you can use test as both the user and password)
// - run ./jury-3.sh
// 
