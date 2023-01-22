import Referee from 'lib/model/referee';
import refereeButtons from 'lib/model/referee/buttons';
import refereeBuzzer from 'lib/model/referee/buzzer';
import refereeWarningLed from 'lib/model/referee/warning-led';
import runner from 'scripts/runner';

runner(({
    board,
    owlcms,
    platform,
}) => {
    new Referee({
        modules: [
            refereeButtons({
                badLiftButton: 12,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 9,
                goodLiftButtonPullUp: true,
            }),
            refereeBuzzer({
                board,
                piezo: 11,
            }),
            refereeWarningLed({
                board,
                led: 10,
            }),
        ],
        number: 1,
        owlcms,
        platform,
    });
    new Referee({
        modules: [
            refereeButtons({
                badLiftButton: 8,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 5,
                goodLiftButtonPullUp: true,
            }),
            refereeBuzzer({
                board,
                piezo: 7,
            }),
            refereeWarningLed({
                board,
                led: 6,
            }),
        ],
        number: 2,
        owlcms,
        platform,
    });
    new Referee({
        modules: [
            refereeButtons({
                badLiftButton: 'A0',
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 'A2',
                goodLiftButtonPullUp: true,
            }),
            refereeBuzzer({
                board,
                piezo: 2,
            }),
            refereeWarningLed({
                board,
                led: 'A1',
            }),
        ],
        number: 3,
        owlcms,
        platform,
    });
});
