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
                badLiftButton: 3,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 4,
                goodLiftButtonPullUp: true,
            }),
            refereeBuzzer({
                board,
                piezo: 2,
            }),
            refereeWarningLed({
                board,
                led: 'A0',
            }),
        ],
        number: 1,
        owlcms,
        platform,
    });
    new Referee({
        modules: [
            refereeButtons({
                badLiftButton: 6,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 7,
                goodLiftButtonPullUp: true,
            }),
            refereeBuzzer({
                board,
                piezo: 5,
            }),
            refereeWarningLed({
                board,
                led: 'A1',
            }),
        ],
        number: 2,
        owlcms,
        platform,
    });
    new Referee({
        modules: [
            refereeButtons({
                badLiftButton: 9,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 10,
                goodLiftButtonPullUp: true,
            }),
            refereeBuzzer({
                board,
                piezo: 8,
            }),
            refereeWarningLed({
                board,
                led: 'A2',
            }),
        ],
        number: 3,
        owlcms,
        platform,
    });
});
