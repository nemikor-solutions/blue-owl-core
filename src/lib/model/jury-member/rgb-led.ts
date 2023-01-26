import type JuryMember from '@lib/model/jury-member';
import type {
    DigitalRgbLedOptions,
} from '@lib/johnny-five/digital-rgb-led';

import DigitalRgbLed from '@lib/johnny-five/digital-rgb-led';

export interface JuryMemberRgbLedOptions {
    anode?: DigitalRgbLedOptions['anode'];
    board?: DigitalRgbLedOptions['board'];
    pins: DigitalRgbLedOptions['pins'];
}

export default (options: JuryMemberRgbLedOptions) => {
    const led = new DigitalRgbLed({
        anode: options.anode,
        board: options.board,
        pins: options.pins,
    });

    return (juryMember: JuryMember) => {
        juryMember.on('initialized', () => {
            led.cycle({
                colors: ['green', 'red', 'white'],
                duration: 2000,
                interval: 300,
            });
        });

        juryMember.on('decision', () => {
            led.color('green').on();
        });

        juryMember.on('reset', () => {
            led.off();
        });

        juryMember.on('reveal', ({ decision }) => {
            led.color(decision === 'good' ? 'white' : 'red');
        });
    };
}
