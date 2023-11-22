import type Referee from '@lib/model/referee/index';
import type {
    Board,
    LedOption,
} from 'johnny-five';

import {
    Led,
} from 'johnny-five';

export interface RefereeWarningLedOptions {
    board?: Board;
    led: LedOption['pin'];
}

export default (options: RefereeWarningLedOptions) => {
    let isRefSleeping = false;

    const led = new Led({
        board: options.board,
        pin: options.led,
    });

    function reset() {
        led.stop().off();
    }

    async function sleep(duration: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }

    async function flash(pattern: number[], action: 'on' | 'off' = 'on') {
        if (!pattern.length) {
            reset();
            return;
        }

        const duration = pattern.shift() as number;
        led[action]();
        await sleep(duration);
        await flash(pattern, action === 'on' ? 'off' : 'on');
    }

    async function wakeUp() {
        isRefSleeping = true;

        do {
            await flash([300]);

            if (isRefSleeping) {
                await sleep(600);
            }
        } while (isRefSleeping);
    }

    return (referee: Referee) => {
        referee.on('initialized', () => {
            flash([300, 300, 300]);
        });

        referee.on('decisionPublished', () => {
            isRefSleeping = false;
            reset();
        });

        referee.on('decisionRequest', () => {
            wakeUp();
        });

        referee.on('summon', () => {
            flash(Array(50).fill(100));
        });
    };
};
