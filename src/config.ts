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

type RefereeConfig = Config['referees'][0];

export default function parseConfig(): Config {
    dotenv.config();

    const platform = process.env['PLATFORM'] || 'A';
    const url = process.env['MQTT_URL'] || 'mqtt://127.0.0.1:1883';

    let referees: RefereeConfig[] = [];
    const referee1 = parseReferee(1);
    const referee2 = parseReferee(2);
    const referee3 = parseReferee(3);

    if (referee1) {
        // Single referee mode
        if (!referee2 && !referee3) {
            referees = [
                referee1,
                { ...referee1, number: 2 },
                { ...referee1, number: 3 },
            ];
        // Standard referee mode
        } else {
            if (!referee2) {
                throw new Error('Missing configuration for referee 2');
            }

            if (!referee3) {
                throw new Error('Missing configuration for referee 3');
            }

            referees = [
                referee1,
                referee2,
                referee3,
            ];
        }
    }

    return {
        platform,
        referees,
        url,
    };
}

function parseReferee(number: RefereeNumber): RefereeConfig | null {
    const badLiftButton = process.env[`REFEREE${number}_BAD_LIFT_BUTTON`] || '';
    const badLiftLed = process.env[`REFEREE${number}_BAD_LIFT_LED`] || null;
    const goodLiftButton = process.env[`REFEREE${number}_GOOD_LIFT_BUTTON`] || '';
    const goodLiftLed = process.env[`REFEREE${number}_GOOD_LIFT_LED`] || null;
    const piezo = Number(process.env[`REFEREE${number}_PIEZO`]) || null;
    const vibrationMotor = process.env[`REFEREE${number}_VIBRATION_MOTOR`] || null;

    if (!badLiftButton && !goodLiftButton) {
        return null;
    }

    return {
        badLiftButton,
        badLiftLed,
        goodLiftButton,
        goodLiftLed,
        number,
        piezo,
        vibrationMotor,
    };
}
