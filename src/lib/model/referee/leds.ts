import type Referee from 'lib/model/referee';
import type {
    Decision,
} from 'lib/model/referee';
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

    function reset() {
        leds.bad.off();
        leds.good.off();
    }

    return (referee: Referee) => {
        // TODO: Blink LEDs on startup
        // referee.on('', () => {
        //     leds.bad.blink(300);
        //     leds.good.blink(300);

        //     setTimeout(reset, 2000);
        // });

        referee.on('decisionConfirmed', ({ decision }) => {
            reset();

            leds[decision].on();
            setTimeout(() => {
                leds[decision].off();
            }, 2000);
        });
    };
};
