import type Owlcms from './owlcms';
import type {
    ButtonOption,
} from 'johnny-five';

import debug from 'debug';
import {
    Button,
} from 'johnny-five';

export interface TimekeeperOptions {
    oneMinute?: ButtonOption['pin'] | null;
    owlcms: Owlcms;
    platform: string;
    start: ButtonOption['pin'];
    stop: ButtonOption['pin'];
    twoMinute?: ButtonOption['pin'] | null;
}

const actions = [
    'oneMinute',
    'start',
    'stop',
    'twoMinute',
] as const;

export default class Timekeeper {
    private oneMinute?: Button;

    private options: TimekeeperOptions;

    private start!: Button;

    private stop!: Button;

    private twoMinute?: Button;

    private debug: debug.Debugger;

    private static requiredOptions: Array<keyof TimekeeperOptions> = [
        'start',
        'stop',
    ];

    public constructor(options: TimekeeperOptions) {
        this.options = options;

        Timekeeper.requiredOptions.forEach((option) => {
            if (!options[option]) {
                throw new Error(`Missing required option: ${option}`);
            }
        });

        this.debug = debug(`timekeeper:${options.platform}`);

        this.initialize();
    }

    private get owlcms() {
        return this.options.owlcms;
    }

    private get platform() {
        return this.options.platform;
    }

    private initialize() {
        this.initializeComponents();

        this.debug('initialized');
    }

    private initializeComponents() {
        actions.forEach((action) => {
            if (!this.options[action]) {
                return;
            }

            this[action] = new Button(this.options[action] as ButtonOption['pin']);
            this[action]?.on('press', () => {
                this.debug(action);
                this.owlcms[`${action}Clock`]({ platform: this.platform });
            });
        });
    }
}
