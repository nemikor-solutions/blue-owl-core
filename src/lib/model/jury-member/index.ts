import type {
    CoreModelEvents,
    CoreModelOptions,
} from '@lib/model/core';
import type {
    JuryMemberNumber,
} from '@lib/model/jury/index';
import type {
    Decision,
} from '@lib/model/referee/index';

import CoreModel from '@lib/model/core';

export interface JuryMemberDecisionEvent {
    decision: Decision;
}

export interface JuryMemberRevealEvent {
    decision: Decision;
}

interface JuryMemberEvents extends CoreModelEvents {
    decision: (data: JuryMemberDecisionEvent) => void;
    reset: () => void;
    reveal: (data: JuryMemberRevealEvent) => void;
}

export interface JuryMemberOptions extends CoreModelOptions<JuryMember> {
    number: JuryMemberNumber;
}

export default class JuryMember extends CoreModel<JuryMemberOptions> {
    private decision: Decision | null = null;

    protected override get debuggerName(): string {
        return `jury-member:${this.number}`
    }

    public get number() {
        return this.options.number;
    }

    public constructor(options: JuryMemberOptions) {
        super(options);
        this.initialize();
    }

    protected _initialize() {
        // Do nothing
    }

    public override on<T extends keyof JuryMemberEvents>(type: T, listener: JuryMemberEvents[T]): this {
        return super.on(type, listener);
    }

    public publishDecision(decision: Decision) {
        this.debug(decision);

        this.decision = decision;
        this.emit('decision', { decision });
    }

    public resetDecision() {
        this.decision = null;
        this.emit('reset');
    }

    public revealDecision() {
        this.emit('reveal', {
            decision: this.decision,
        });
    }
}
