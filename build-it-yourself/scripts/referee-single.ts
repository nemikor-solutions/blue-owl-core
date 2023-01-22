import type {
    RefereeOptions,
} from '../../src/lib/model/referee';
import Referee from '../../src/lib/model/referee';
import refereeButtons from '../../src/lib/model/referee/buttons';
import downRelays from '../../src/lib/model/down/relays'
import runner from './runner';
import type {
    Config,
} from '../../src/scripts/config';
import Down from '../../src/lib/model/down';

export function doSoloReferee(conf?: Config) {
    runner(({
        board,
        owlcms,
        platform,
    }) => {
        const options: RefereeOptions = {
            modules: [
                refereeButtons({
                    badLiftButton: 11,
                    badLiftButtonPullUp: true,
                    board,
                    goodLiftButton: 10,
                    goodLiftButtonPullUp: true,
                }),
            ],
            number: 1,
            owlcms,
            platform,
        };
        new Referee(options);
        new Referee({ ...options, number: 2 });
        new Referee({ ...options, number: 3 });
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
