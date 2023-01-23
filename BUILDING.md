# Building your own interactive executable

- The files in the `src` directory are the same as in the official Blue-Owl package EXCEPT that all the paths have been made relative ("./" or "../")

  - This is necessary for the `pkg` program to work.

- The files in `build-it-yourself/scripts` are as follows

  - There is a single `startdevice`  script which is interactive
  - The other scripts are just definitions included in `startdevice` 
  - To modify the pinouts, you change the definitions in the various scripts.

- To test the interactive script after modifications

  - npm run ts build-it-yourself/scripts/startdevice
  - This will work with Wokwi if you have started the simulation in Chrome or Edge and opened a virtual port (see the instructions in build-it-yourself/diagrams/README.md)

- To build an executable

  - Install the typescript compiler.  Or use Visual Code to compile with tsc. (Ctrl-Shift B)
    ```
    npm install -g typescript
    ```
  
  - Make sure you have a `dist` directory with all the translated js files. 
  
    ```
    tsc
    ```
  
  - install pkg:
  
    ```
    npm install -g pkg
    ```
  
  - Run pkg -- note that the required instructions are in `package.json`, which is why we run `pkg .`  This command will take the js from the `dist` folder and also include the binary files necessary to do serial communications.
  
    ```
    pkg . -C Brotli
    ```
  
  
  - You may get warnings if the files have non-relative paths.  You need to fix the paths and re-run tsc until pkg gives no warnings.
  - This will create a blue-owl.exe .  It takes a little while because of the compression.  Rename it to what you want.

