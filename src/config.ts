import type {
    ControllerOptions
} from './controller';
import type {
    OwlcmsOptions
} from './owlcms';
import type {
    RefereeNumber
} from './referee';

import * as dotenv from 'dotenv';

export type Config =
    Pick<
        OwlcmsOptions,
        | 'url'
    >
    & Pick<
        ControllerOptions,
        | 'platform'
        | 'referees'
    >;

export default function parseConfig(): Config {
    dotenv.config();

    return {
        platform: process.env.PLATFORM || 'A',
        referees: [
            parseReferee(1),
            parseReferee(2),
            parseReferee(3),
        ],
        url: process.env.MQTT_URL || 'mqtt://127.0.0.1:1883',
    };
}

function parseReferee(number: RefereeNumber): Config['referees'][0] {
    return {
        badLiftButton: process.env[`REFEREE${number}_BAD_LIFT_BUTTON`],
        badLiftLed: process.env[`REFEREE${number}_BAD_LIFT_LED`],
        goodLiftButton: process.env[`REFEREE${number}_GOOD_LIFT_BUTTON`],
        goodLiftLed: process.env[`REFEREE${number}_GOOD_LIFT_LED`],
        number,
        vibrationMotor: process.env[`REFEREE${number}_VIBRATION_MOTOR`],
    };
}
