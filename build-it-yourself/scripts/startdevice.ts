import type {
    Config,
} from '../../src/scripts/config';
import promptSync from 'prompt-sync';
import { doTimekeeper } from './timekeeper';
import { doReferee } from './referee';
import { doSoloReferee } from './referee-single';
import { doJury3 } from './jury-3';
import { doJury5 } from './jury-5';

const prompt = promptSync({ sigint: true });
const selectedDevice = selectDevice();

let selectedSerialPort = prompt("communication port [automatic detection] ")
selectedSerialPort ||= '';
let selectedPlatform = prompt("platform [A] ")
selectedPlatform ||= "A";
let selectedMQTTServer = prompt("MQTT server address [192.168.1.254] ")
selectedMQTTServer ||= "192.168.1.254";
let selectedMQTTPort = prompt("MQTT server port [1883] ");
selectedMQTTPort ||= "1883"
let selectedMQTTUsername = prompt("MQTT username [] ")
selectedMQTTUsername ||= "";
let selectedMQTTPassword = prompt("MQTT password [] ")
selectedMQTTPassword ||= "";

const configuration: Config = {
    mqttPassword: selectedMQTTPassword,
    mqttUsername: selectedMQTTUsername,
    mqttUrl: "mqtt://" + selectedMQTTServer + ":" + selectedMQTTPort,
    platform: selectedPlatform,
    serialPort: selectedSerialPort,
}

if (process.env) process.env['DEBUG'] = "blue-owl:*"

switch (selectedDevice) {
    case "T": {
        doTimekeeper(configuration);
        break;
    }
    case "R": {
        doReferee(configuration);
        break;
    }
    case "S": {
        doSoloReferee(configuration);
        break;
    }
    case "3": {
        doJury3(configuration);
        break;
    }
    case "5": {
        doJury5(configuration);
        break;
    }
    default: {
        console.log("Error: Expected R S T 3 or 5")
        break;
    }
}


function selectDevice() {
    const valid = new RegExp('[RST35]');

    console.log("Please select the desired settings. ENTER selects the [default value]");
    console.log("");
    let selectedDevice = null;
    while (selectedDevice == null || !valid.test(selectedDevice)) {
        if (selectedDevice != null) {
            console.log("");
            console.log("Error: Invalid device choice.");
            console.log("");
        }
        console.log("Device types:");
        console.log("  R = 3 referees");
        console.log("  S = Single referee");
        console.log("  T = Timekeeper");
        console.log("  3 = 3-person Jury");
        console.log("  5 = 5-person Jury");
        selectedDevice = prompt("Type of device ? [T] ");
        selectedDevice ||= "T";
    }
    console.log("");
    return selectedDevice;
}

