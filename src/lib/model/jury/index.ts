import type {
    ModelEvents,
    ModelOptions,
} from '@lib/model/index';
import type {
    Decision,
    RefereeNumber,
} from '@lib/model/referee/index';

import Model from '@lib/model/index';

export type JuryMemberNumber = 1 | 2 | 3 | 4 | 5;

interface JuryEvents extends ModelEvents {
    refereeDecision: (data: JuryRefereeDecisionEvent) => void;
    resetRefereeDecisions: () => void;
}

export type JuryOptions = ModelOptions<Jury>;

export interface JuryRefereeDecisionEvent {
    decision: Decision;
    referee: RefereeNumber;
}

export default class Jury extends Model<JuryOptions> {
    protected get debuggerName() {
        return `jury:${this.platform}`;
    }

    public constructor(options: JuryOptions) {
        super(options);
        this.initialize();
    }

    protected _initialize() {
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

            this.resetRefereeDecisions();
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

    private resetRefereeDecisions() {
        this.debug('reset referee decisions');
        this.emit('resetRefereeDecisions');
    }

    public resumeCompetition() {
        this.debug('resume copetition');
        this.owlcms.resumeCompetition({ platform: this.platform });
    }

    public startChallenge() {
        this.debug('start challenge');
        this.owlcms.startChallenge({ platform: this.platform });
    }

    public startDeliberation() {
        this.debug('start deliberation');
        this.owlcms.startDeliberation({ platform: this.platform });
    }

    public startTechnicalBreak() {
        this.debug('start technical break');
        this.owlcms.startTechnicalBreak({ platform: this.platform });
    }

    public summonAllReferees() {
        this.debug('summon all referees');
        this.owlcms.summonAllReferees({
            platform: this.platform,
        });
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
