// no code is necessary to run Firmata
//
// requires Edge or Chrome

// INITIAL SETUP
// - Install Node.js 16 - On Windows make sure that you choose the option to install the C++ tools.
// - Install com0com v2.2.2.0 on Windows 10 or 11 to create a pair of ports
//   * use the setup command prompt to create a pair of ports (e.g. COM5 and COM6)
//       install PortName=COM5 PortName=COM6
//   
// DOWNLOAD FIRMATA FIRMWARE
// Use a StandardFirmata.ino.with_bootloader.hex generated from Arduino IDE.
// WokwiUno appears to require using the UnoMini confit.
//
// For Wokwi Mega: https://www.dropbox.com/s/ye3gajzfoenkk5v/Mega_StandardFirmata.ino.with_bootloader.hex?dl=0
// For Wokwi Uno: https://www.dropbox.com/s/pb0aryykchb3tgw/Uno_StandardFirmata.ino.with_bootloader.hex?dl=0
//
// RUNNING FIRMATA
// - Click in this area -- where you are reading this text.
// - Hit F1 and type "Load" - select "Load HEX file and start simulation"
// - Select the correct firmware you have downloaded
// - Chrome will prompt for a port, use one of the pair created (e.g. COM5)
// - Connect your firmata script to the other (e.g COM6)
