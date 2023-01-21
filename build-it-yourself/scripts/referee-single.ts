import type {
    RefereeOptions,
} from '../../src/lib/model/referee';
import Referee from '../../src/lib/model/referee';
import refereeButtons from '../../src/lib/model/referee/buttons';
import runner from '../../src/scripts/runner';
import type {
    Config,
} from '../../src/scripts/config';

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
    }, conf)
}
