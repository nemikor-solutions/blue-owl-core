import type Owlcms from './owlcms';
import type {
    RefereeOptions,
} from './referee';
import type {
    TimekeeperOptions,
} from './timekeeper';

import debug from 'debug';
import Referee from './referee';
import Timekeeper from './timekeeper';
import {
    Board,
} from 'johnny-five';

type CommonOptions = {
    owlcms: Owlcms;
    platform: string;
};

type RemoveCommonOptions<T> = Omit<T, keyof CommonOptions>;

export interface ControllerOptions extends CommonOptions {
    referees?: Array<RemoveCommonOptions<RefereeOptions>> | null;
    timekeeper?: RemoveCommonOptions<TimekeeperOptions> | null;
}

export default class Controller {
    public static defaultOptions: Partial<ControllerOptions> = {
        platform: 'A',
    };

    private static requiredOptions: Array<keyof ControllerOptions> = [
        'owlcms',
        'platform',
    ];

    private debug: debug.Debugger;

    private options: ControllerOptions;

    private referees?: Referee[];

    public constructor(options: ControllerOptions) {
        this.options = {
            ...Controller.defaultOptions,
            ...options,
        };

        Controller.requiredOptions.forEach((option) => {
            if (!this.options[option]) {
                throw new Error(`Missing required option: ${option}`);
            }
        });

        this.debug = debug(`controller:${options.platform}`);
    }

    private get commonOptions(): CommonOptions {
        return {
            owlcms: this.owlcms,
            platform: this.options.platform,
        };
    }

    private get owlcms() {
        return this.options.owlcms;
    }

    private async setUpBoard() {
        const board = new Board({ repl: false });

        return new Promise<void>((resolve, reject) => {
            board.on('ready', () => {
                if (this.options.referees) {
                    this.referees = this.options.referees.map((refereeOptions) => {
                        return new Referee({
                            ...refereeOptions,
                            ...this.commonOptions,
                        });
                    });
                }

                if (this.options.timekeeper) {
                    new Timekeeper({
                        ...this.options.timekeeper,
                        ...this.commonOptions,
                    });
                }

                this.debug('board ready');
                resolve();
            });

            board.on('fail', ({ message}) => {
                this.debug('failed to connect');
                reject(new Error(message));
            });

            board.on('error', (error) => {
                this.debug('board error');
                reject(error);
            });
        });
    }

    public blinkLeds() {
        this.referees?.forEach((referee) => {
            referee.blinkLeds();
        });
    }

    public async connect() {
        await this.setUpBoard();

        this.blinkLeds();
    }
}
