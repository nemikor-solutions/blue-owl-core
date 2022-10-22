import type Owlcms from './owlcms';
import type {
    ButtonOption,
    LedOption
} from 'johnny-five';

import debug from 'debug';
import {
    Button,
    Led,
} from 'johnny-five';

export type Decision = 'bad' | 'good';

export type RefereeNumber = 1 | 2 | 3;

export interface RefereeOptions {
    badLiftButton: ButtonOption['pin'];
    badLiftLed?: LedOption['pin'] | null;
    goodLiftButton: ButtonOption['pin'];
    goodLiftLed?: LedOption['pin'] | null;
    number: RefereeNumber;
    owlcms: Owlcms;
    platform: string;
    vibrationMotor?: LedOption['pin'] | null;
}

const decisions = [
    'bad',
    'good',
] as const;

async function sleep(duration: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

export default class Referee {
    private badLiftButton!: Button;

    private badLiftLed?: Led;

    private debug: debug.Debugger;

    private goodLiftButton!: Button;

    private goodLiftLed?: Led;

    private options: RefereeOptions;

    // Johnny-Five doesn't have a vibration motor component,
    // but it's functionally equivalent to an LED
    private vibrationMotor?: Led;

    private static requiredOptions: Array<keyof RefereeOptions> = [
        'badLiftButton',
        'goodLiftButton',
        'number',
        'owlcms',
        'platform',
    ];

    public constructor(options: RefereeOptions) {
        this.options = options;

        Referee.requiredOptions.forEach((option) => {
            if (!options[option]) {
                throw new Error(`Missing required option: ${option}`);
            }
        });

        this.debug = debug(`referee:${options.platform}:${options.number}`);

        this.initialize();
    }

    private get number() {
        return this.options.number;
    }

    private get owlcms() {
        return this.options.owlcms;
    }

    private get platform() {
        return this.options.platform;
    }

    private initialize() {
        this.initializeComponents();
        this.setUpButtons();

        this.owlcms.on('decisionRequest', ({ platform, referee }) => {
            if (platform !== this.platform || referee !== this.number) {
                return;
            }

            this.decisionRequest();
        })

        this.debug('initialized');
    }

    private initializeComponents() {
        this.badLiftButton = new Button(this.options.badLiftButton);
        this.goodLiftButton = new Button(this.options.goodLiftButton);

        if (this.options.goodLiftLed) {
            this.goodLiftLed = new Led(this.options.goodLiftLed);
        }

        if (this.options.badLiftLed) {
            this.badLiftLed = new Led(this.options.badLiftLed);
        }

        if (this.options.vibrationMotor) {
            this.vibrationMotor = new Led(this.options.vibrationMotor);
        }
    }

    private resetLeds() {
        this.badLiftLed?.stop();
        this.badLiftLed?.off();
        this.goodLiftLed?.stop();
        this.goodLiftLed?.off();
    }

    private setUpButtons() {
        decisions.forEach((decision) => {
            const button = this[`${decision}LiftButton`];
            const led = this[`${decision}LiftLed`];

            button.on('press', () => {
                this.debug(decision);

                this.owlcms.publishDecision({
                    decision,
                    platform: this.platform,
                    referee: this.number,
                });

                if (led) {
                    this.resetLeds();
                    led.on();
                    setTimeout(() => {
                        led.off();
                    }, 2000);
                }
            });
        });
    }

    public blinkLeds() {
        this.badLiftLed?.blink(300);
        this.goodLiftLed?.blink(300);

        setTimeout(() => {
            this.resetLeds();
        }, 2000);
    }

    public async decisionRequest() {
        this.debug('decision requested');

        if (!this.vibrationMotor) {
            return;
        }

        this.vibrationMotor.on();
        await sleep(200);
        this.vibrationMotor.off();
        await sleep(100);
        this.vibrationMotor.on();
        await sleep(200);
        this.vibrationMotor.off();
    }
}
