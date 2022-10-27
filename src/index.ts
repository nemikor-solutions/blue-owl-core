import type {
    Config
} from './config';

import Controller from './controller';
import Owlcms from './owlcms';
import parseConfig from './config';

(async () => {
    let config: Config;

    try {
        config = parseConfig();
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
        return;
    }

    const {
        platform,
        referees,
        timekeeper,
        url,
    } = config;
    const owlcms = new Owlcms({
        url,
    });

    try {
        await owlcms.connect();

        const controller = new Controller({
            owlcms,
            platform,
            referees,
            timekeeper,
        });
        await controller.connect();
    } catch (error) {
        console.error(error);
        process.exitCode = 1;

        owlcms.disconnect();
    }
})();
