import Referee from '../../src/lib/model/referee';
import refereeButtons from '../../src/lib/model/referee/buttons';
import refereeBuzzer from '../../src/lib/model/referee/buzzer';
import downSignalRelay from '../../src/lib/model/down-signal/relay'
import refereeWarningLed from '../../src/lib/model/referee/warning-led';
import runner from './runner';
import type {
    Config,
} from '../../src/scripts/config';
import DownSignal from '../../src/lib/model/down-signal';

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
        new DownSignal({
            modules: [
                downSignalRelay({
                    board,
                    duration: 1500,
                    pin: 'A0',   
                }),
                downSignalRelay({
                    board,
                    duration: 500,
                    pin: 'A1',
                }),
            ],
            owlcms,
            platform,
        })
    }, conf)
}
