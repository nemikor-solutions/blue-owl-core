import Referee from '../../src/lib/model/referee';
import refereeButtons from '../../src/lib/model/referee/buttons';
import refereeBuzzer from '../../src/lib/model/referee/buzzer';
import downRelays from '../../src/lib/model/down/relays'
import refereeWarningLed from '../../src/lib/model/referee/warning-led';
import runner from '../../src/scripts/runner';
import type {
    Config,
} from '../../src/scripts/config';
import Down from 'lib/model/down';

export function doReferees(conf?: Config) {
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
        new Down({
            modules: [
                downRelays({
                    board,
                    lightDuration: 1500,
                    lightRelay: 'A0',   
                    soundDuration: 500,
                    soundRelay: 'A1',
                }),
            ],
            owlcms,
            platform,
        })
    }, conf)
}
