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
    let isRefSleeping = false;

    // Johnny-Five doesn't have a vibration motor component,
    // but it's functionally equivalent to an LED
    const vibrationMotor = new Led({
        board: options.board,
        pin: options.vibrationMotor,
    });

    function reset() {
        vibrationMotor.off();
    }

    async function sleep(duration: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }

    async function vibrate(pattern: number[], action: 'on' | 'off' = 'on') {
        if (!pattern.length) {
            reset();
            return;
        }

        const duration = pattern.shift() as number;
        vibrationMotor[action]();
        await sleep(duration);
        await vibrate(pattern, action === 'on' ? 'off' : 'on');
    }

    async function wakeUp() {
        isRefSleeping = true;

        do {
            await vibrate([200, 100, 200]);

            if (isRefSleeping) {
                await sleep(1_000);
            }
        } while (isRefSleeping);
    }

    return (referee: Referee) => {
        referee.on('initialized', () => {
            vibrate([200, 100, 200]);
        });

        referee.on('decisionPublished', () => {
            isRefSleeping = false;
            reset();
        });

        referee.on('decisionRequest', () => {
            wakeUp();
        });

        referee.on('summon', () => {
            vibrate(Array(15).fill(200));
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
