import type JuryMember from '@lib/model/jury-member/index';
import type {
    JuryMemberDecision,
} from '@lib/model/jury-member/index';
import type {
    Color,
    DigitalRgbLedOptions,
} from '@lib/johnny-five/digital-rgb-led';

import DigitalRgbLed from '@lib/johnny-five/digital-rgb-led';

export interface JuryMemberRgbLedOptions {
    anode?: DigitalRgbLedOptions['anode'];
    board?: DigitalRgbLedOptions['board'];
    pins: DigitalRgbLedOptions['pins'];
}

const decisionColor: Record<JuryMemberDecision, Color> = {
    hidden: 'green',
    good: 'white',
    bad: 'red',
};

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

        juryMember.on('decisionConfirmed', ({ decision }) => {
            led.color(decisionColor[decision]).on();
        });

        juryMember.on('reset', () => {
            led.off();
        });
    };
}
