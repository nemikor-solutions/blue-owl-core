## Installing the Blue Owl Refereeing Package

The following steps are required once on every machine that will run Blue Owl (typically the countdown display laptop, the jury laptop, and the timekeeper laptop if one is used -- otherwise the announcer laptop).  The main owlcms machine also needs the prerequisites.

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



#### Installing an MQTT Server

This step is only needed on the owlcms machine.

The refereeing device scripts and owlcms communicate with one another using the MQTT protocol. 

A very simple server can be installed as follows:

```
npm install -g aedes-cli
```

The installation creates an `aedes` command.  You can then add passwords by using a command like the following:

```
aedes adduser owlcms somepassworyouchoose --credentials aedes_passwd.txt
```

If you run the program with the `--credentials` switch and the same password file, it will require passwords. If you don't use the switch, the program will run without passwords and accept all connection attempts (this is useful for testing.)

```
aedes --credentials aedes_passwd.txt
```

> **IMPORTANT**: you will need to authorize port 1883 to be open on your computer. Normally Windows will prompt you to authorize the port.  To troubleshoot, you can always disable the Windows Defender Firewall altogether.



#### Configuring owlcms to call the MQTT Server

> *This will be revised when the MQTT server is configurable from the owlcms interface.*

owlcms needs to connect to your MQTT server.  

1. Go to the installation directory, and locate the `owlcms.l4j.ini` file (depending on your Windows configuration, the `.ini`can be hidden).  
2. For an initial server without any passwords add the following lines at the beginning of the file. Obviously, replace `192.168.0.101` with the actual IP address or name of your server (same as reported by owlcms when it starts up.)

```
-DmqttServer=192.168.0.101
-DmqttUserName=""
-DmqttPassword=""
-DmqttPort=1883
```

3. You can then run `aedes` without the `--credentials` switch to do an initial test.



#### Installing the Blue Owl Packages

This step is not needed on the main owlcms machine unless it is also used by the announcer or timekeeper.

- on Windows, obtain the blue-owl.exe self-extracting zip file from **TBC LOCATION**  Execute the file and unzip it to your desktop.
- on macOS or Linux, obtain the Zip from **TBC LOCATION**  and unzip it to a directory of your choice.

We then use our command line window to go to the directory and make it available.

```
cd Desktop/blue-owl
npm install
```

Edit the .sh or .cmd scripts to have the correct address and login information for your MQTT Server



## Starting the scripts

1. On the owlcms machine, start a command window (`⊞` `R` shortcut, `cmd`)

   ```
   aedes --credentials aedes_passwd.txt
   ```

2. On the owlcms machine, start owlcms

3. Go to the Blue Owl installation area

4. On Windows:

   1. Open a command window
   2. Run the `.\referee.cmd`  or  `.\timekeeper.cmd`  or `.\jury-3.cmd` script depending on the machine you are on.

5. On macOS or Linux

   1. Open a terminal window
   2. Run the `./referee.sh`  or  `./timekeeper.sh` or `./jury-3.cmd sh` depending on the machine you are on.