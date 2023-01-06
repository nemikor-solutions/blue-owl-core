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
                goodLiftButton: 2,
                goodLiftButtonPullUp: true,
            }),
            refereeBuzzer({
                board,
                piezo: 4,
            }),
            refereeWarningLed({
                board,
                led: 5,
            }),
        ],
        number: 3,
        owlcms,
        platform,
    });
    new Referee({
        modules: [
            refereeButtons({
                badLiftButton: 7,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 6,
                goodLiftButtonPullUp: true,
            }),
            refereeBuzzer({
                board,
                piezo: 8,
            }),
            refereeWarningLed({
                board,
                led: 9,
            }),
        ],
        number: 2,
        owlcms,
        platform,
    });
    new Referee({
        modules: [
            refereeButtons({
                badLiftButton: 11,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 10,
                goodLiftButtonPullUp: true,
            }),
            refereeBuzzer({
                board,
                piezo: 12,
            }),
            refereeWarningLed({
                board,
                led: 13,
            }),
        ],
        number: 1,
        owlcms,
        platform,
    });
});
