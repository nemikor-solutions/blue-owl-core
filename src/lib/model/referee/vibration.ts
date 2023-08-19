import type Referee from '@lib/model/referee/index';
import type {
    Board,
    LedOption,
} from 'johnny-five';

import {
    Led,
} from 'johnny-five';

export interface RefereeVibrationOptions {
    board?: Board;
    confirmation?: boolean;
    vibrationMotor: LedOption['pin'];
}

export default (options: RefereeVibrationOptions) => {
    // Johnny-Five doesn't have a vibration motor component,
    // but it's functionally equivalent to an LED
    const vibrationMotor = new Led({
        board: options.board,
        pin: options.vibrationMotor,
    });

    async function sleep(duration: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }

    async function vibrate(pattern: number[], action: 'on' | 'off' = 'on') {
        if (!pattern.length) {
            vibrationMotor.off();
            return;
        }

        const duration = pattern.shift() as number;
        vibrationMotor[action]();
        await sleep(duration);
        vibrate(pattern, action === 'on' ? 'off' : 'on');
    }

    return (referee: Referee) => {
        referee.on('initialized', () => {
            vibrate([200, 100, 200]);
        });

        referee.on('decisionRequest', () => {
            vibrate([200, 100, 200]);
        });

        referee.on('summon', () => {
            vibrate([200, 100, 200]);
        });

        if (options.confirmation) {
            referee.on('decisionConfirmed', ({ decision }) => {
                if (decision === 'good') {
                    vibrate([100]);
                } else {
                    vibrate([100, 100, 100]);
                }
            });
        }
    };
};
