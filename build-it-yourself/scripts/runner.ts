import type {
    Board,
} from 'johnny-five';
import type {
    Config,
} from '../../src/scripts/config';

import connectBoard from '../../src/lib/board';
import Owlcms from '../../src/lib/owlcms';
import parseConfig from '../../src/scripts/config';

export type Initializer = (options: InitializerOptions) => void;

export interface InitializerOptions {
    board: Board;
    config: Config;
    owlcms: Owlcms;
    platform: Config['platform'];
}

export default async (initializer: Initializer, config?: Config) => {
    config ||= parseConfig();

    const owlcms = new Owlcms({
        mqttPassword: config.mqttPassword,
        mqttUrl: config.mqttUrl,
        mqttUsername: config.mqttUsername,
    });

    try {
        await owlcms.connect();

        let board;
        if (config.serialPort) {
            board = await connectBoard({
                port: config.serialPort,
            });
        } else {
            board = await connectBoard();
        }

        initializer({
            board,
            config,
            owlcms,
            platform: config.platform,
        });
    } catch (error) {
        console.error(error);
        process.exitCode = 1;

        owlcms.disconnect();

        // If the process does not exit cleanly within five seconds, force close
        setTimeout(() => {
            process.exit(2);
        }, 5000);
    }
}
