import type {
    RefereeOptions,
} from 'lib/model/referee';

import Referee from 'lib/model/referee';
import refereeButtons from 'lib/model/referee/buttons';
import runner from 'scripts/runner';

runner(({
    board,
    owlcms,
    platform,
}) => {
    const options: RefereeOptions = {
        modules: [
            refereeButtons({
                badLiftButton: 3,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 4,
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
});
