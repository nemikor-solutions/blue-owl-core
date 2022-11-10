import type JuryMember from 'lib/model/jury-member';
import type {
    Decision,
} from 'lib/model/referee';
import type {
    Board,
    ButtonOption,
} from 'johnny-five';

import {
    decisions,
} from 'lib/model/referee';
import {
    Button,
} from 'johnny-five';

export interface JuryMemberButtonsOptions {
    board?: Board;
    badLiftButton: ButtonOption['pin'];
    goodLiftButton: ButtonOption['pin'];
}

export default (options: JuryMemberButtonsOptions) => {
    const buttons: Record<Decision, Button> = {
        bad: new Button({
            board: options.board,
            pin: options.badLiftButton,
        }),
        good: new Button({
            board: options.board,
            pin: options.goodLiftButton,
        }),
    };

    return (juryMember: JuryMember) => {
        decisions.forEach((decision) => {
            buttons[decision].on('press', () => {
                juryMember.publishDecision(decision);
            });
        });
    };
};
