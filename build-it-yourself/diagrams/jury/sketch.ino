// no code is necessary to run Firmata
//
// requires Edge or Chrome

// INITIAL SETUP
// - See https://github.com/owlcms/blue-owl follow instructions in INSTALLING.md
// - Install com0com v2.2.2.0 on Windows 10 or 11 to create a pair of ports
//   * use the setup command prompt to create a pair of ports (e.g. COM5 and COM6)
//       install PortName=COM5 PortName=COM6
//   * Modify the scripts to use the even-numbered member of the pair.
//   
// DOWNLOAD FIRMATA FIRMWARE
// Use a StandardFirmata.ino.with_bootloader.hex generated from Arduino IDE.
// - See https://github.com/owlcms/blue-owl/release and look in the Assets section.
//
//
// RUNNING FIRMATA ON THE DEVICE
// - Click in the sketch.ino tab where you are reading this text.
// - Hit F1 and type "Load h" - select "Load HEX file and start simulation"
// - Select the correct firmware you have downloaded
// - Chrome will prompt for a port, use the odd-numbered port of the pair

// RUNNING THE BLUE-OWL DRIVER SCRIPT
// - go to the windows directory
// - double-click on the .cmd for the device you are simulating.
