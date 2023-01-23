import type Referee from '../../model/referee';
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

    function flash({
        duration = 2000,
        speed = 300,
    }: {
        duration?: number;
        speed?: number;
    } = {}) {
        led.blink(speed);
        setTimeout(reset, duration);
    }

    function reset() {
        led.stop().off();
    }

    return (referee: Referee) => {
        referee.on('initialized', () => {
            flash();
        });

        referee.on('decisionRequest', () => {
            flash();
        });

        referee.on('summon', () => {
            flash({ duration: 5000, speed: 100 });
        });
    };
};
