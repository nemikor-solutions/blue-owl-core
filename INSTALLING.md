# Installing and Running the Blue Owl Device Package

> #### Note: these are ***Early Adopter Instructions***
>
> The following instructions are NOT what to expect in the final package.  The final package will NOT require installing Node on the machines, and will NOT require editing a configuration file.  A self-contained application will do all that with a graphical user interface.
>

Starting with release 37.2 owlcms no longer requires an external MQTT server.  It provides one.  We need to configure the devices so they have the necessary software to run Blue Owl, and configure them to reach owlcms using MQTT.

## Configuring the Device-hosting laptops

> The devices need to be connected to a laptop that provides power over USB. Blue Owl runs on the laptop and controls the physical device, also over USB.
>
> **These steps are necessary  on each machine that will have devices connected to it**



We will install two pieces of software, nvm and npm

- nvm  which is a tool for installing the Node.js software that actually executes Blue Owl.
- npm ("Node Package Manager") which is what we will be using to make sure Blue Owl has all its required pieces installed and to actually start things.

#### Installing NVM

- On Windows, Download the [latest release](https://github.com/coreybutler/nvm-windows/releases/latest/download/nvm-setup.exe) and execute it.
- For macOS, see [this article](https://collabnix.com/how-to-install-and-configure-nvm-on-mac-os/) .

- On Linux, there are different methods based on the distribution. For Ubuntu, see [this article](https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/)



#### Installing Node.js and NPM

nvm is now used to install npm. 

You now need to start a command shell.  On Windows 10/11 left-click *once* on `⊞` and type `cmd` (or use the  `⊞` `R` shortcut to run a command. and then type `cmd`). On a Mac or Linux, start a Terminal session.

Type the following commands to install the required version (16) and make it the default version.

```
nvm install 16
nvm use 16
nvm alias default 16
```



#### Installing the Blue Owl Packages

This step is not needed on the main owlcms machine unless it is also used by the announcer or timekeeper.

- on Windows, obtain the blue-owl.exe self-extracting zip file from **[https://github.com/owlcms/blue-owl/releases](https://github.com/owlcms/blue-owl/releases)**  Execute the file and unzip it to your desktop.
- on macOS or Linux, obtain the blue-owl.zip from **https://github.com/owlcms/blue-owl/releases**  and unzip it to a directory of your choice.

We then use our command line window to go to the directory and make it available.

```
cd Desktop/blue-owl
npm install
```

Edit the `bash/config.sh` or `windows\config.cmd` scripts in to have the correct address and login information for your MQTT Server



## Starting the device on Windows

1. Go to the Blue Owl installation area

2. On a Windows machine

   1. FInd the directory where blue-node.exe was unpacked, double-click on it
   1. Open the `windows` directory
   1. Open the `config.cmd` and make sure that the addresses and passwords are correct for the MQTT server
   1. Double-click on the script you want to run

3. If Blue Owl does not detect the device, or if you have more than one device, edit the script with Notepad and *remove* the `rem` ("remark") word at the beginning of the line that sets the port.  The line should look something like (and you would of course put the proper port name on the line)

   ```
   set BLUE_OWL_SERIAL_PORT=COM6
   ```



## Starting the device on macOS or Linux

1. Go to the Blue Owl installation area

2. On a Windows machine

   1. FInd the directory where blue-node.exe was unpacked, double-click on it
   1. Open the `bash` directory
   1. Open the `config.sh` and make sure that the adresses and passwords are correct for the MQTT server
   1. Double-click on the script you want to run

3. If Blue Owl does not detect the device, or if you have more than one device, edit the script with Notepad and *remove* the `#`  comment marker at the beginning of the line that sets the port.  The line should look something like (and you would of course put the proper port name on the line)

   ```
   export BLUE_OWL_SERIAL_PORT=/dev/xyz
   ```