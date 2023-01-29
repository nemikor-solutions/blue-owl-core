import type Timekeeper from '@lib/model/timekeeper/index';
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
    oneMinuteButtonPullUp?: ButtonOption['isPullup'];
    startButton: ButtonOption['pin'];
    startButtonPullUp?: ButtonOption['isPullup'];
    stopButton: ButtonOption['pin'];
    stopButtonPullUp?: ButtonOption['isPullup'];
    twoMinuteButton: ButtonOption['pin'];
    twoMinuteButtonPullUp?: ButtonOption['isPullup'];
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
            isPullup: options[`${action}ButtonPullUp`],
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
