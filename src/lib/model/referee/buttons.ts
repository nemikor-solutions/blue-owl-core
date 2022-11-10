import type Referee from 'lib/model/referee';
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

export interface RefereeButtonsOptions {
    board?: Board;
    badLiftButton: ButtonOption['pin'];
    goodLiftButton: ButtonOption['pin'];
}

export default (options: RefereeButtonsOptions) => {
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

    return (referee: Referee) => {
        decisions.forEach((decision) => {
            buttons[decision].on('press', () => {
                referee.publishDecision(decision);
            });
        });
    };
};
