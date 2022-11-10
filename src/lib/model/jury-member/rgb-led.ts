import type JuryMember from 'lib/model/jury-member';
import type {
    Board,
} from 'johnny-five';

import {
    Led,
} from 'johnny-five';

export interface JuryRefereeLedsOptions {
    anode?: Led.RGBOption['isAnode'];
    board?: Board;
    pins: Led.RGBOption['pins'];
}

export default (options: JuryRefereeLedsOptions) => {
    const led = new Led.RGB({
        board: options.board,
        pins: options.pins,
        isAnode: options.anode,
    });

    return (juryMember: JuryMember) => {
        juryMember.on('decision', () => {
            led.color('#00ff00')
            led.on();
        });

        juryMember.on('reset', () => {
            led.off();
        });

        juryMember.on('reveal', ({ decision }) => {
            led.color(decision === 'good' ? '#ffffff' : '#ff0000');
        });
    };
}
