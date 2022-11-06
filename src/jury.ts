import type Owlcms from './owlcms';
import type {
    Decision,
    RefereeNumber
} from './referee';
import type {
    ButtonOption,
    LedOption,
} from 'johnny-five';

import debug from 'debug';
import {
    decisions,
    referees,
} from './referee';
import {
    Button,
    Led,
} from 'johnny-five';

type Capitalized<T> = T extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : never;

export interface JuryOptions {
    deliberation: ButtonOption['pin'];
    owlcms: Owlcms;
    platform: string;
    referee1BadLift: LedOption['pin'];
    referee1GoodLift: LedOption['pin'];
    referee2BadLift: LedOption['pin'];
    referee2GoodLift: LedOption['pin'];
    referee3BadLift: LedOption['pin'];
    referee3GoodLift: LedOption['pin'];
    resumeCompetition: ButtonOption['pin'];
    summonReferee1: ButtonOption['pin'];
    summonReferee2: ButtonOption['pin'];
    summonReferee3: ButtonOption['pin'];
    summonTechnicalController: ButtonOption['pin'];
    technicalBreak: ButtonOption['pin'];
}

export default class Jury {
    private deliberation!: Button;

    private options: JuryOptions;

    private referee1BadLift!: Led;

    private referee1GoodLift!: Led;

    private referee2BadLift!: Led;

    private referee2GoodLift!: Led;

    private referee3BadLift!: Led;

    private referee3GoodLift!: Led;

    private resumeCompetition!: Button;

    private summonReferee1!: Button;

    private summonReferee2!: Button;

    private summonReferee3!: Button;

    private summonTechnicalController!: Button;

    private technicalBreak!: Button;

    private debug: debug.Debugger;

    private static requiredOptions: Array<keyof JuryOptions> = [
        'deliberation',
        'referee1BadLift',
        'referee1GoodLift',
        'referee2BadLift',
        'referee2GoodLift',
        'referee3BadLift',
        'referee3GoodLift',
        'resumeCompetition',
        'summonReferee1',
        'summonReferee2',
        'summonReferee3',
        'summonTechnicalController',
        'technicalBreak',
    ];

    public constructor(options: JuryOptions) {
        this.options = options;

        Jury.requiredOptions.forEach((option) => {
            if (!options[option]) {
                throw new Error(`Missing required option: ${option}`);
            }
        });

        this.debug = debug(`jury:${options.platform}`);

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

        this.owlcms.on('decision', ({ decision, platform, referee }) => {
            if (platform !== this.platform) {
                return;
            }

            // Turn the decision light on
            const ledProperty = this.refereeDecisionProperty({ decision, referee });
            this[ledProperty].stop().on();

            // If the referee is changing their decision, blink the previous decision light
            // to make it obvious that a change occurred.
            const otherLedProperty = this.refereeDecisionProperty({
                decision: decision === 'good' ? 'bad' : 'good',
                referee,
            });
            if (this[otherLedProperty].isOn) {
                this[otherLedProperty].blink();
                setTimeout(() => {
                    this[otherLedProperty].stop().off();
                }, 600);
            }
        });

        this.owlcms.on('resetDecisions', ({ platform }) => {
            if (platform !== this.platform) {
                return;
            }

            this.resetRefereeDecisions();
        });

        this.owlcms.on('clockStart', ({ platform }) => {
            if (platform !== this.platform) {
                return;
            }

            this.resetRefereeDecisions();
        });
    }

    private initializeComponents() {
        this.deliberation = new Button(this.options.deliberation);
        this.deliberation.on('press', () => {
            this.debug('start deliberation');
            this.owlcms.startDeliberation({ platform: this.platform });
        });

        this.technicalBreak = new Button(this.options.technicalBreak);
        this.technicalBreak.on('press', () => {
            this.debug('start technical break');
            this.owlcms.startTechnicalBreak({ platform: this.platform });
        });

        this.resumeCompetition = new Button(this.options.resumeCompetition);
        this.resumeCompetition.on('press', () => {
            this.debug('resume copetition');
            this.owlcms.resumeCompetition({ platform: this.platform });
        });

        this.summonTechnicalController = new Button(this.options.summonTechnicalController);
        this.summonTechnicalController.on('press', () => {
            this.debug('summon technical controller');
            this.owlcms.summonTechnicalController({ platform: this.platform });
        });

        referees.forEach((referee) => {
            const summonProperty = `summonReferee${referee}` as const;
            this[summonProperty] = new Button(this.options[summonProperty]);
            this[summonProperty].on('press', () => {
                this.debug(`summon referee ${referee}`);
                this.owlcms.summonReferee({
                    platform: this.platform,
                    referee,
                });
            });

            decisions.forEach((decision) => {
                const ledProperty = this.refereeDecisionProperty({ decision, referee });
                this[ledProperty] = new Led(this.options[ledProperty]);
            });
        });
    }

    private refereeDecisionProperty({
        decision,
        referee,
    }: {
        decision: Decision;
        referee: RefereeNumber;
    }) {
        const capitalizedDecision = decision.replace(
            /^(\w)/,
            (character) => character.toUpperCase()
        ) as Capitalized<Decision>;

        return `referee${referee}${capitalizedDecision}Lift` as const;
    }

    resetRefereeDecisions() {
        referees.forEach((referee) => {
            decisions.forEach((decision) => {
                const ledProperty = this.refereeDecisionProperty({ decision, referee });
                this[ledProperty].off();
            });
        });
    }
}
