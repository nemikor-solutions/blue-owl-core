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

    const owlcms = new Owlcms({
        url: config.url,
    });

    try {
        await owlcms.connect();

        const controller = new Controller({
            ...config,
            owlcms,
        });
        await controller.connect();
    } catch (error) {
        console.error(error);
        process.exitCode = 1;

        owlcms.disconnect();
    }
})();
