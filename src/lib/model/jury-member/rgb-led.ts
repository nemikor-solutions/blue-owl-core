import type JuryMember from 'lib/model/jury-member';
import type {
    DigitalRgbOptions,
} from 'lib/johnny-five/digital-rgb';

import DigitalRgb from 'lib/johnny-five/digital-rgb';

export interface JuryMemberRgbLedOptions {
    anode?: DigitalRgbOptions['anode'];
    board?: DigitalRgbOptions['board'];
    pins: DigitalRgbOptions['pins'];
}

export default (options: JuryMemberRgbLedOptions) => {
    const led = new DigitalRgb({
        anode: options.anode,
        board: options.board,
        pins: options.pins,
    });

    return (juryMember: JuryMember) => {
        juryMember.on('decision', () => {
            led.green();
        });

        juryMember.on('reset', () => {
            led.off();
        });

        juryMember.on('reveal', ({ decision }) => {
            led[decision === 'good' ? 'white' : 'red']();
        });
    };
}
