import type {
    IClientOptions,
} from 'mqtt';
import type {
    JuryMemberNumber,
} from './model/jury';
import type {
    Decision,
    RefereeNumber,
} from './model/referee';

import debug from 'debug';
import EventEmitter from 'node:events';
import mqtt from 'mqtt';

export interface ClockStartEvent {
    platform: string;
}

export interface DecisionEvent {
    decision: Decision;
    platform: string;
    referee: RefereeNumber;
}

export interface DecisionRequestEvent {
    platform: string;
    referee: RefereeNumber;
}

export type Official =
    | RefereeNumber
    | 'all'
    | 'controller';

export interface ResetDecisionsEvent {
    platform: string;
}

export interface SummonEvent {
    platform: string;
    referee: RefereeNumber;
}

interface OwlcmsEvents {
    clockStart: (data: ClockStartEvent) => void;
    decision: (data: DecisionEvent) => void;
    decisionRequest: (data: DecisionRequestEvent) => void;
    resetDecisions: (data: ResetDecisionsEvent) => void;
    summon: (data: SummonEvent) => void;
}

type OwlcmsEventDataMap = {
    [K in keyof OwlcmsEvents]: Parameters<OwlcmsEvents[K]>[0];
}

type OwlcmsEventData = OwlcmsEventDataMap[keyof OwlcmsEvents];

export interface OwlcmsOptions {
    mqttPassword?: string | undefined | null;
    mqttUrl: string;
    mqttUsername?: string | undefined | null;
}

export default class Owlcms extends EventEmitter {
    private debug: debug.Debugger;

    private mqtt: mqtt.Client;

    private static requiredOptions: Array<keyof OwlcmsOptions> = [
        'mqttUrl',
    ];

    public constructor(options: OwlcmsOptions) {
        super();

        Owlcms.requiredOptions.forEach((option) => {
            if (!options[option]) {
                throw new Error(`Missing required option: ${option}`);
            }
        });

        this.debug = debug('blue-owl:owlcms');

        const mqttOptions: IClientOptions = {};
        if (options.mqttUsername) {
            mqttOptions.username = options.mqttUsername;
        }
        if (options.mqttPassword) {
            mqttOptions.password = options.mqttPassword;
        }
        this.mqtt = mqtt.connect(options.mqttUrl, mqttOptions);
    }

    public async connect() {
        this.mqtt.on('message', (topic, _message) => {
            const message = _message.toString();
            this.debug(`${topic}: ${message}`);

            const [, ,action, platform] = topic.split('/') as ['owlcms', 'fop', string, string];
            let data: OwlcmsEventData;

            if (action === 'decision') {
                const [referee, decision] = message.split(' ') as [string, Decision];

                data = {
                    decision,
                    platform,
                    referee: parseInt(referee) as RefereeNumber,
                };
            } else if (action === 'decisionRequest' || action === 'summon') {
                const [referee, status] = message.split(' ') as [string, string];

                if (status === 'off') {
                    return;
                }

                data = {
                    platform,
                    referee: parseInt(referee) as RefereeNumber,
                };
            } else if (action === 'clockStart' || action === 'resetDecisions') {
                data = {
                    platform,
                };
            } else {
                return;
            }

            this.emit(action, data);
        });

        return new Promise<void>((resolve, reject) => {
            this.mqtt.on('connect', () => {
                this.debug('connected');

                this.mqtt.subscribe('owlcms/fop/#', (error) => {
                    if (error) {
                        console.error('Failed to subscribe to owlcms messages.');
                        console.error(error);
                        return;
                    }

                    this.debug('subscribed to owlcms messages');
                    resolve();
                });
            });

            this.mqtt.on('error', (error) => {
                this.debug('client error');
                reject(error);
            });
        });
    }

    public async disconnect() {
        if (!this.mqtt) {
            return;
        }

        return new Promise<void>((resolve) => {
            this.mqtt.end(false, undefined, () => {
                resolve();
            });
        });
    }

    public override on<T extends keyof OwlcmsEvents>(type: T, listener: OwlcmsEvents[T]): this {
        return super.on(type, listener);
    }

    public oneMinuteClock({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/clock/${platform}`, '60');
    }

    public publishJuryDecision({
        decision,
        platform,
    }: {
        decision: Decision;
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/jurybox/decision/${platform}`, decision);
    }

    public publishJuryMemberDecision({
        decision,
        juryMember,
        platform,
    }: {
        decision: Decision;
        juryMember: JuryMemberNumber;
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/jurybox/juryMember/decision/${platform}`, `${juryMember} ${decision}`);
    }

    public publishRefereeDecision({
        decision,
        platform,
        referee,
    }: {
        decision: Decision;
        platform: string;
        referee: number;
    }) {
        this.mqtt.publish(`owlcms/refbox/decision/${platform}`, `${referee} ${decision}`);
    }

    public resumeCompetition({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/jurybox/break/${platform}`, 'stop');
    }

    public startClock({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/clock/${platform}`, 'start');
    }

    public startDeliberation({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/jurybox/break/${platform}`, 'deliberation');
    }

    public startTechnicalBreak({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/jurybox/break/${platform}`, 'technical');
    }

    public stopClock({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/clock/${platform}`, 'stop');
    }

    public summon({
        official,
        platform,
    }: {
        official: Official;
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/jurybox/summon/${platform}`, official.toString());
    }

    public summonAllReferees({
        platform,
    }: {
        platform: string;
    }) {
        this.summon({
            official: 'all',
            platform,
        });
    }

    public summonReferee({
        platform,
        referee,
    }: {
        platform: string;
        referee: RefereeNumber;
    }) {
        this.summon({
            official: referee,
            platform,
        });
    }

    public summonTechnicalController({
        platform,
    }: {
        platform: string;
    }) {
        this.summon({
            official: 'controller',
            platform,
        });
    }

    public twoMinuteClock({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt.publish(`owlcms/clock/${platform}`, '120');
    }
}
