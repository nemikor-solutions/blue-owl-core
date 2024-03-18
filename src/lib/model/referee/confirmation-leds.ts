import type Referee from '@lib/model/referee/index';
import type {
    Decision,
} from '@lib/model/referee/index';
import type {
    Board,
    LedOption,
} from 'johnny-five';

import {
    Led,
} from 'johnny-five';

export interface RefereeConfirmationLedsOptions {
    badLiftLed: LedOption['pin'];
    board?: Board;
    goodLiftLed: LedOption['pin'];
}

export default (options: RefereeConfirmationLedsOptions) => {
    const leds: Record<Decision, Led> = {
        bad: new Led({
            board: options.board,
            pin: options.badLiftLed,
        }),
        good: new Led({
            board: options.board,
            pin: options.goodLiftLed,
        }),
    };

    function flash({
        duration = 2_000,
        speed = 300,
    }: {
        duration?: number;
        speed?: number;
    } = {}) {
        leds.bad.blink(speed);
        leds.good.blink(speed);

        setTimeout(reset, duration);
    }

    function reset() {
        leds.bad.stop().off();
        leds.good.stop().off();
    }

    return (referee: Referee) => {
        referee.on('initialized', () => {
            flash();
        });

        referee.on('decisionConfirmed', ({ decision }) => {
            reset();

            leds[decision].on();
            setTimeout(() => {
                leds[decision].off();
            }, 2_000);
        });

        referee.on('resetDecision', () => {
            reset();
        });
    };
};
