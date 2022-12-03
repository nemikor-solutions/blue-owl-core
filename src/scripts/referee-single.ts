import type {
    RefereeOptions,
} from 'lib/model/referee';

import connectBoard from 'lib/board';
import Owlcms from 'lib/owlcms';
import parseConfig from 'scripts/config';
import Referee from 'lib/model/referee';
import refereeButtons from 'lib/model/referee/buttons';

(async () => {
    const {
        mqttUsername,
        mqttUrl,
        mqttPassword,
        platform,
    } = parseConfig();

    const owlcms = new Owlcms({
        mqttPassword,
        mqttUrl,
        mqttUsername,
    });

    try {
        await owlcms.connect();

        const refBox = await connectBoard();

        const options: RefereeOptions = {
            modules: [
                refereeButtons({
                    badLiftButton: 3,
                    badLiftButtonPullUp: true,
                    board: refBox,
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
    } catch (error) {
        console.error(error);
        process.exitCode = 1;

        owlcms.disconnect();
    }
})();
