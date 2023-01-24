import type JuryMember from '../../model/jury-member';
import type {
    DigitalRgbOptions,
} from '../../johnny-five/digital-rgb';

import DigitalRgb from '../../johnny-five/digital-rgb';

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
            console.log('reset', juryMember.number);
            led.off();
        });

        juryMember.on('reveal', ({ decision }) => {
            led[decision === 'good' ? 'white' : 'red']();
        });
    };
}
