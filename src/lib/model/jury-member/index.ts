import type {
    ModelEvents,
    ModelOptions,
} from '@lib/model/index';
import type {
    JuryMemberNumber,
} from '@lib/model/jury/index';
import type {
    Decision,
} from '@lib/model/referee/index';

import Model from '@lib/model/index';

export type JuryMemberDecision =
    | Decision
    | 'hidden';

export interface JuryMemberDecisionEvent {
    decision: JuryMemberDecision;
}

interface JuryMemberEvents extends ModelEvents {
    decisionConfirmed: (data: JuryMemberDecisionEvent) => void;
    reset: () => void;
}

export interface JuryMemberOptions extends ModelOptions<JuryMember> {
    number: JuryMemberNumber;
}

export default class JuryMember extends Model<JuryMemberOptions> {
    protected override get debuggerName(): string {
        return `jury-member:${this.number}`
    }

    public get number() {
        return this.options.number;
    }

    protected _initialize() {
        this.owlcms.on('juryMemberDecision', ({ decision, juryMember, platform }) => {
            if (platform !== this.platform || juryMember !== this.number) {
                return;
            }

            this.decisionConfirmed(decision);
        });

        this.owlcms.on('juryDeliberation', ({ platform }) => {
            if (platform !== this.platform) {
                return;
            }

            this.resetDecision();
        });

        this.owlcms.on('resetDecisions', ({ platform }) => {
            if (platform !== this.platform) {
                return;
            }

            this.resetDecision();
        });

        this.owlcms.on('challenge', ({ platform }) => {
            if (platform !== this.platform) {
                return;
            }

            this.resetDecision();
        });
    }

    private decisionConfirmed(decision: JuryMemberDecision) {
        this.debug(`decision confirmed: ${decision}`);
        this.emit('decisionConfirmed', { decision });
    }

    public override on<T extends keyof JuryMemberEvents>(type: T, listener: JuryMemberEvents[T]): this {
        return super.on(type, listener);
    }

    public publishDecision(decision: Decision) {
        this.debug(decision);

        this.owlcms.publishJuryMemberDecision({
            decision,
            juryMember: this.number,
            platform: this.platform,
        });
    }

    public resetDecision() {
        this.debug('reset');
        this.emit('reset');
    }
}
