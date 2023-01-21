import type Referee from '../../model/referee';
import type {
    Decision,
} from '../../model/referee';
import type {
    Board,
    ButtonOption,
} from 'johnny-five';

import {
    decisions,
} from '../../model/referee';
import {
    Button,
} from 'johnny-five';

export interface RefereeButtonsOptions {
    board?: Board;
    badLiftButton: ButtonOption['pin'];
    badLiftButtonPullUp?: ButtonOption['isPullup'];
    goodLiftButton: ButtonOption['pin'];
    goodLiftButtonPullUp?: ButtonOption['isPullup'];
}

export default (options: RefereeButtonsOptions) => {
    const buttons: Record<Decision, Button> = {
        bad: new Button({
            board: options.board,
            isPullup: options.badLiftButtonPullUp,
            pin: options.badLiftButton,
        }),
        good: new Button({
            board: options.board,
            isPullup: options.goodLiftButtonPullUp,
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
