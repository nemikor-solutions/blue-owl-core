import type {
    CoreModelEvents,
    CoreModelOptions,
} from '../model/core';
import type {
    JuryMemberNumber,
} from '../model/jury';
import type {
    Decision,
} from '../model/referee';

import CoreModel from 'lib/model/core';

interface DecisionEvent {
    decision: Decision;
}

interface RevealEvent {
    decision: Decision;
}

interface JuryMemberEvents extends CoreModelEvents {
    decision: (data: DecisionEvent) => void;
    reset: () => void;
    reveal: (data: RevealEvent) => void;
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
