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

    async function wakeUp(referee: Referee) {
        do {
            await flash([300]);

            if (referee.isSleeping) {
                await sleep(900);
            }
        } while (referee.isSleeping);
    }

    return (referee: Referee) => {
        referee.on('initialized', () => {
            flash([300, 300, 300]);
        });

        referee.on('decisionDisplayed', () => {
            reset();
        });

        referee.on('decisionPublished', () => {
            reset();
        });

        referee.on('decisionRequest', () => {
            wakeUp(referee);
        });

        referee.on('resetDecision', () => {
            reset();
        });

        referee.on('summon', () => {
            flash(Array(50).fill(100));
        });
    };
};
