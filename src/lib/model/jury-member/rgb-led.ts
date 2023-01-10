import type JuryMember from 'lib/model/jury-member';
import type {
    DigitalRgbOptions,
} from 'lib/johnny-five/digital-rgb';

import DigitalRgb from 'lib/johnny-five/digital-rgb';

export interface JuryRefereeLedsOptions {
    anode?: DigitalRgbOptions['anode'];
    board?: DigitalRgbOptions['board'];
    pins: DigitalRgbOptions['pins'];
}

export default (options: JuryRefereeLedsOptions) => {
    const led = new DigitalRgb({
        anode: options.anode,
        board: options.board,
        pins: options.pins,
    });

    return (juryMember: JuryMember) => {
        juryMember.on('decision', () => {
            console.log('decision', juryMember.number);
            led.green();
        });

        juryMember.on('reset', () => {
            console.log('reset', juryMember.number);
            led.off();
        });

        juryMember.on('reveal', ({ decision }) => {
            console.log('reveal', decision, juryMember.number);
            led[decision === 'good' ? 'white' : 'red']();
        });
    };
}
