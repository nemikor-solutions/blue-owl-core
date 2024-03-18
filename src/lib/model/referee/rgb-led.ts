import type Referee from '@lib/model/referee/index';
import type {
    Color,
    DigitalRgbLedOptions,
} from '@lib/johnny-five/digital-rgb-led';

import DigitalRgbLed from '@lib/johnny-five/digital-rgb-led';

export interface RefereeRgbLedOptions {
    anode?: DigitalRgbLedOptions['anode'];
    board?: DigitalRgbLedOptions['board'];
    decisionRequestColor?: Color;
    pins: DigitalRgbLedOptions['pins'];
    summonColor?: Color,
}

export default (options: RefereeRgbLedOptions) => {
    const led = new DigitalRgbLed({
        anode: options.anode,
        board: options.board,
        pins: options.pins,
    });

    const decisionRequestColor = options.decisionRequestColor || 'blue';
    const summonColor = options.summonColor || 'yellow';

    return (referee: Referee) => {
        referee.on('initialized', () => {
            led.cycle({
                colors: ['red', 'white', decisionRequestColor, summonColor],
                duration: 2_000,
                interval: 300,
            });
        });

        referee.on('decisionConfirmed', ({ decision }) => {
            led
                .stop()
                .color(decision === 'good' ? 'white' : 'red')
                .on();

            setTimeout(() => {
                led.off();
            }, 5_000);
        });

        referee.on('decisionDisplayed', () => {
            led.stop().off();
        });

        referee.on('decisionRequest', () => {
            led
                .stop()
                .color(decisionRequestColor)
                .blink(300);

            setTimeout(() => {
                led.stop().off();
            }, 5_000);
        });

        referee.on('resetDecision', () => {
            led.stop().off();
        });

        referee.on('summon', () => {
            led
                .stop()
                .color(summonColor)
                .blink(100);

            setTimeout(() => {
                led.stop().off();
            }, 5_000);
        });
    };
};
