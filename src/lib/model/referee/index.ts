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
    decisionRequest: () => void;
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
    protected override get debuggerName(): string {
        return `referee:${this.platform}:${this.number}`
    }

    private get number() {
        return this.options.number;
    }

    public constructor(options: RefereeOptions) {
        super(options);
        this.initialize();
    }

    private decisionConfirmed(decision: Decision) {
        this.debug(`decision confirmed: ${decision}`);
        this.emit('decisionConfirmed', { decision });
    }

    private decisionRequest() {
        this.debug('decision requested');
        this.emit('decisionRequest');
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
        this.debug(decision);

        this.owlcms.publishRefereeDecision({
            decision,
            platform: this.platform,
            referee: this.number,
        });
    }

    private summon() {
        this.debug('summon');
        this.emit('summon');
    }
}
