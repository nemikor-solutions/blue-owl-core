import type JuryMember from '@lib/model/jury-member/index';
import type {
    Board,
    LedOption,
} from 'johnny-five';

import {
    Led,
} from 'johnny-five';

export interface JuryMemberLedsOptions {
    board?: Board;
    badLiftLed: LedOption['pin'];
    goodLiftLed: LedOption['pin'];
    maskedLed: LedOption['pin'];
}

export default (options: JuryMemberLedsOptions) => {
    const badLift = new Led({
        board: options.board,
        pin: options.badLiftLed,
    });
    const goodLift = new Led({
        board: options.board,
        pin: options.goodLiftLed,
    });
    const masked = new Led({
        board: options.board,
        pin: options.maskedLed,
    });

    function off() {
        badLift.off();
        goodLift.off();
        masked.off();
    }

    return (juryMember: JuryMember) => {
        juryMember.on('decisionConfirmed', ({ decision }) => {
            if (decision === 'hidden') {
                masked.on();
            } else if (decision === 'good') {
                goodLift.on();
            } else {
                badLift.on();
            }
        });

        juryMember.on('reset', () => {
            off();
        });
    };
}
