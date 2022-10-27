import type {
    ControllerOptions,
} from './controller';
import type {
    OwlcmsOptions,
} from './owlcms';
import type {
    RefereeNumber,
} from './referee';

import * as dotenv from 'dotenv';

type RefereeConfig = NonNullable<ControllerOptions['referees']>[number];
type TimekeeperConfig = NonNullable<ControllerOptions['timekeeper']>;

export type Config =
    Pick<
        OwlcmsOptions,
        | 'url'
    >
    & Pick<
        ControllerOptions,
        | 'platform'
    >
    & {
        referees: RefereeConfig[] | null;
        timekeeper: TimekeeperConfig | null;
    };

export default function parseConfig(): Config {
    dotenv.config();

    const platform = process.env['PLATFORM'] || 'A';
    const url = process.env['MQTT_URL'] || 'mqtt://127.0.0.1:1883';

    const referees = parseReferees();
    const timekeeper = parseTimekeeper();

    return {
        platform,
        referees,
        timekeeper,
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

function parseReferees(): RefereeConfig[] | null {
    let referees: RefereeConfig[] = [];
    const referee1 = parseReferee(1);
    const referee2 = parseReferee(2);
    const referee3 = parseReferee(3);

    if (!referee1) {
        return null;
    }

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

    return referees;
}

function parseTimekeeper(): TimekeeperConfig | null {
    const oneMinute = process.env['TIMEKEEPER_ONE_MINUTE_BUTTON'] || null;
    const start = process.env['TIMEKEEPER_START_BUTTON'] || '';
    const stop = process.env['TIMEKEEPER_STOP_BUTTON'] || '';
    const twoMinute = process.env['TIMEKEEPER_TWO_MINUTE_BUTTON'] || null;

    if (!start && !stop) {
        return null;
    }

    return {
        oneMinute,
        start,
        stop,
        twoMinute,
    };
}
