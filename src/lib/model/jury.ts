import type JuryMember from 'lib/model/jury-member';
import type {
    ModelEvents,
    ModelOptions,
} from 'lib/model';
import type {
    Decision,
    RefereeNumber,
} from 'lib/model/referee';

import Model from 'lib/model';

export type JuryMemberNumber = 1 | 2 | 3 | 4 | 5;

interface JuryEvents extends ModelEvents {
    refereeDecision: (data: RefereeDecisionEvent) => void;
    resetRefereeDecisions: () => void;
}

export interface JuryOptions extends ModelOptions<Jury> {
    members: JuryMember[];
}

interface RefereeDecisionEvent {
    decision: Decision;
    referee: RefereeNumber;
}

export default class Jury extends Model<JuryOptions> {
    private decisions!: Partial<Record<JuryMemberNumber, Decision>>;

    private decisionCount = 0;

    protected get debuggerName() {
        return `jury:${this.platform}`;
    }

    private get members() {
        return this.options.members;
    }

    public constructor(options: JuryOptions) {
        super(options);
        this.initialize();
    }

    protected _initialize() {
        this.decisions = {};

        this.members.forEach((member) => {
            member.on('decision', ({ decision }) => {
                this.juryMemberDecision({
                    decision,
                    number: member.number,
                });
            });
        });

        this.owlcms.on('decision', ({ decision, platform, referee }) => {
            if (platform !== this.platform) {
                return;
            }

            this.refereeDecision({ decision, referee });
        });

        this.owlcms.on('resetDecisions', ({ platform }) => {
            if (platform !== this.platform) {
                return;
            }

            this.resetJuryMemberDecisions();
            this.resetRefereeDecisions();
        });
    }

    private juryMemberDecision({
        decision,
        number,
    }: {
        decision: Decision;
        number: JuryMemberNumber;
    }) {
        if (!this.decisions[number]) {
            this.decisionCount++;
        }

        this.decisions[number] = decision;
        this.owlcms.publishJuryMemberDecision({
            decision,
            juryMember: number,
            platform: this.platform,
        });

        if (this.decisionCount !== this.members.length) {
            return;
        }

        this.members.forEach((member) => {
            member.revealDecision();
        });
    }

    public override on<T extends keyof JuryEvents>(type: T, listener: JuryEvents[T]): this {
        return super.on(type, listener);
    }

    public publishDecision(decision: Decision) {
        this.debug(decision);

        this.owlcms.publishJuryDecision({
            decision,
            platform: this.platform,
        });
    }

    private refereeDecision({
        decision,
        referee,
    }: {
        decision: Decision;
        referee: RefereeNumber;
    }) {
        this.debug(`referee decision ${referee} ${decision}`);
        this.emit('refereeDecision', { decision, referee });
    }

    private resetJuryMemberDecisions() {
        this.decisionCount = 0;
        this.decisions = {};

        this.members.forEach((member) => {
            member.resetDecision();
        });
    }

    private resetRefereeDecisions() {
        this.debug('reset referee decisions');
        this.emit('resetRefereeDecisions');
    }

    public resumeCompetition() {
        this.debug('resume copetition');
        this.owlcms.resumeCompetition({ platform: this.platform });
    }

    public startDeliberation() {
        this.debug('start deliberation');
        this.owlcms.startDeliberation({ platform: this.platform });
    }

    public startTechnicalBreak() {
        this.debug('start technical break');
        this.owlcms.startTechnicalBreak({ platform: this.platform });
    }

    public summonReferee(referee: RefereeNumber) {
        this.debug(`summon referee ${referee}`);
        this.owlcms.summonReferee({
            platform: this.platform,
            referee,
        });
    }

    public summonTechnicalController() {
        this.debug('summon technical controller');
        this.owlcms.summonTechnicalController({ platform: this.platform });
    }
}
