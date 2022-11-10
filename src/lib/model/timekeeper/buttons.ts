import type Timekeeper from 'lib/model/timekeeper';
import type {
    Board,
    ButtonOption,
} from 'johnny-five';

import {
    Button,
} from 'johnny-five';

type Action =
    | 'oneMinute'
    | 'start'
    | 'stop'
    | 'twoMinute';

export interface TimekeeperButtonsOptions {
    board?: Board;
    oneMinuteButton: ButtonOption['pin'];
    startButton: ButtonOption['pin'];
    stopButton: ButtonOption['pin'];
    twoMinuteButton: ButtonOption['pin'];
}

const actions: Action[] =[
    'oneMinute',
    'start',
    'stop',
    'twoMinute',
];

export default (options: TimekeeperButtonsOptions) => {
    const buttons = actions.reduce((_buttons, action) => {
        _buttons[action] = new Button({
            board: options.board,
            pin: options[`${action}Button`],
        });

        return _buttons;
    }, {} as Record<Action, Button>);

    return (timekeeper: Timekeeper) => {
        actions.forEach((action) => {
            buttons[action].on('press', () => {
                timekeeper[`${action}Clock`]();
            });
        });
    };
};
