import type {
    ModelEvents,
    ModelOptions,
} from '@lib/model';

import Model from '@lib/model/index';

export type Decision = 'bad' | 'good';

export interface RefereeDecisionEvent {
    decision: Decision;
}

interface RefereeEvents extends ModelEvents {
    decisionConfirmed: (data: RefereeDecisionEvent) => void;
    decisionDisplayed: (data: RefereeDecisionEvent) => void;
    decisionPublished: (data: RefereeDecisionEvent) => void;
    decisionRequest: () => void;
    resetDecision: () => void;
    summon: () => void;
}

export type RefereeNumber = 1 | 2 | 3;

export interface RefereeOptions extends ModelOptions<Referee> {
    number: RefereeNumber;
}

export const decisions: Decision[] = [
    'bad',
    'good',
];

export const referees: RefereeNumber[] = [
    1,
    2,
    3,
];

export default class Referee extends Model<RefereeOptions> {
    protected confirmed = false;

    protected sleeping = false;

    protected override get debuggerName(): string {
        return `referee:${this.platform}:${this.number}`
    }

    public get isSleeping() {
        return this.sleeping;
    }

    private get number() {
        return this.options.number;
    }

    private decisionConfirmed(decision: Decision) {
        this.sleeping = false;

        // Each time any referee submits a decision, owlcms will publish
        // a confirmation for each referee that has already submitted a
        // decision. We want to ensure that only one confirmation is
        // published per decision.
        if (!this.confirmed) {
            this.debug(`decision confirmed: ${decision}`);
            this.emit('decisionConfirmed', { decision });
        }

        this.confirmed = true;
    }

    private decisionDisplayed(decision: Decision) {
        this.sleeping = false;

        this.debug(`decision displayed: ${decision}`);
        this.emit('decisionDisplayed', { decision });
    }

    private decisionRequest() {
        if (!this.sleeping) {
            this.debug('decision requested');
            this.emit('decisionRequest');
        }

        this.sleeping = true;
    }

    protected _initialize() {
        this.owlcms.on('decision', ({ decision, platform, referee }) => {
            if (platform !== this.platform || referee !== this.number) {
                return;
            }

            this.decisionConfirmed(decision);
        });

        this.owlcms.on('decisionRequest', ({ platform, referee }) => {
            if (platform !== this.platform || referee !== this.number) {
                return;
            }

            this.decisionRequest();
        });

        this.owlcms.on('refereesDecision', ({ decision, platform }) => {
            if (platform !== this.platform) {
                return;
            }

            this.decisionDisplayed(decision);
        });

        this.owlcms.on('resetDecisions', ({ platform }) => {
            if (platform !== this.platform) {
                return;
            }

            this.resetDecision();
        });

        this.owlcms.on('summon', ({ platform, referee }) => {
            if (platform !== this.platform || referee !== this.number) {
                return;
            }

            this.summon();
        });
    }

    public override on<T extends keyof RefereeEvents>(type: T, listener: RefereeEvents[T]): this {
        return super.on(type, listener);
    }

    public publishDecision(decision: Decision) {
        this.confirmed = false;

        this.debug(decision);
        this.emit('decisionPublished', { decision });

        this.owlcms.publishRefereeDecision({
            decision,
            platform: this.platform,
            referee: this.number,
        });
    }

    private resetDecision() {
        this.sleeping = false;

        this.debug('reset decision');
        this.emit('resetDecision');
    }

    private summon() {
        this.sleeping = false;

        this.debug('summon');
        this.emit('summon');
    }
}
