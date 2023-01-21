import type Referee from '../../model/referee';
import type {
    Decision,
} from '../../model/referee';
import type {
    Board,
    LedOption,
} from 'johnny-five';

import {
    Led,
} from 'johnny-five';

export interface RefereeLedsOptions {
    badLiftLed: LedOption['pin'];
    board?: Board;
    goodLiftLed: LedOption['pin'];
}

export default (options: RefereeLedsOptions) => {
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
        duration = 2000,
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
            }, 2000);
        });
    };
};
