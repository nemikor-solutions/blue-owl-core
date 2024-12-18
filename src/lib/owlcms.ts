import type {
    Logger,
} from '@lib/logger';
import type {
    IClientOptions,
    MqttClient,
} from 'mqtt';
import type {
    TimeRemaining,
} from '@lib/model/down-signal';
import type {
    JuryMemberNumber,
} from '@lib/model/jury/index';
import type {
    JuryMemberDecision,
} from '@lib/model/jury-member/index';
import {
    createLogger,
} from '@lib/logger';
import type {
    Decision,
    RefereeNumber,
} from '@lib/model/referee/index';

import EventEmitter from 'node:events';
import mqtt from 'mqtt';

export type Official =
    | RefereeNumber
    | 'all'
    | 'controller';

export interface OwlcmsChallengeEvent {
    platform: string;
}

export interface OwlcmsClockStartEvent {
    platform: string;
}

export interface OwlcmsConfigEvent {
    jurySize: 3 | 5;
    platforms: string[];
    version: string;
}

export interface OwlcmsDecisionEvent {
    decision: Decision;
    platform: string;
    referee: RefereeNumber;
}

export interface OwlcmsDecisionRequestEvent {
    platform: string;
    referee: RefereeNumber;
}

export interface OwlcmsDownEvent {
    platform: string;
}

export interface OwlcmsJuryDeliberationEvent {
    platform: string;
}

export interface OwlcmsJuryMemberDecisionEvent {
    decision: JuryMemberDecision;
    juryMember: JuryMemberNumber;
    platform: string;
}

export interface OwlcmsRefereesDecisionEvent {
    decision: Decision;
    platform: string;
}

export interface OwlcmsResetDecisionsEvent {
    platform: string;
}

export interface OwlcmsSummonEvent {
    platform: string;
    referee: RefereeNumber;
}

export interface OwlcmsTimeRemainingEvent {
    platform: string;
    time: TimeRemaining;
}

interface OwlcmsEvents {
    challenge: (data: OwlcmsChallengeEvent) => void;
    clockStart: (data: OwlcmsClockStartEvent) => void;
    config: (data: OwlcmsConfigEvent) => void;
    connect: () => void;
    decision: (data: OwlcmsDecisionEvent) => void;
    decisionRequest: (data: OwlcmsDecisionRequestEvent) => void;
    disconnect: () => void;
    down: (data: OwlcmsDownEvent) => void;
    juryDeliberation: (data: OwlcmsJuryDeliberationEvent) => void;
    juryMemberDecision: (data: OwlcmsJuryMemberDecisionEvent) => void;
    refereesDecision: (data: OwlcmsRefereesDecisionEvent) => void;
    resetDecisions: (data: OwlcmsResetDecisionsEvent) => void;
    summon: (data: OwlcmsSummonEvent) => void;
    timeRemaining: (data: OwlcmsTimeRemainingEvent) => void;
}

type OwlcmsEventDataMap = {
    [K in keyof OwlcmsEvents]: Parameters<OwlcmsEvents[K]>[0];
}

type OwlcmsEventData = OwlcmsEventDataMap[keyof OwlcmsEvents];

export interface OwlcmsOptions {
    mqttHost: string;
    mqttPassword?: string | undefined | null;
    mqttPort?: string;
    mqttUsername?: string | undefined | null;
}

const FOP_TOPICS = 'owlcms/fop/#';

export default class Owlcms extends EventEmitter {
    private debug: Logger;

    private mqtt?: MqttClient;

    private options: OwlcmsOptions;

    private static requiredOptions: Array<keyof OwlcmsOptions> = [
        'mqttHost',
    ];

    public constructor(options: OwlcmsOptions) {
        super();

        Owlcms.requiredOptions.forEach((option) => {
            if (!options[option]) {
                throw new Error(`Missing required option: ${option}`);
            }
        });

        this.debug = createLogger('owlcms');
        this.options = options;
    }

    public async connect() {
        const mqttOptions: IClientOptions = {
            connectTimeout: 5_000,
        };
        if (this.options.mqttUsername) {
            mqttOptions.username = this.options.mqttUsername;
        }
        if (this.options.mqttPassword) {
            mqttOptions.password = this.options.mqttPassword;
        }

        const mqttUrl = [
            'mqtt://',
            this.options.mqttHost,
            ':',
            this.options.mqttPort || '1883',
        ].join('');
        this.mqtt = mqtt.connect(mqttUrl, mqttOptions);

        this.mqtt.on('message', (topic, _message) => {
            const message = _message.toString();
            this.debug(`${topic}: ${message}`);

            const [, ,action, platform] = topic.split('/') as ['owlcms', 'fop', string, string];
            let data: OwlcmsEventData;

            if (action === 'config') {
                data = JSON.parse(message);
            } else if (action === 'decision') {
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
            } else if (action === 'juryMemberDecision') {
                const [juryMember, decision] = message.split(' ') as [string, JuryMemberDecision];

                data = {
                    decision,
                    juryMember: parseInt(juryMember) as JuryMemberNumber,
                    platform,
                };
            } else if (action === 'refereesDecision') {
                const [decision] = message.split(' ') as [Decision];

                data = {
                    decision,
                    platform,
                };
            } else if (action === 'timeRemaining') {
                const [time] = message.split(' ') as [string];

                data = {
                    platform,
                    time: parseInt(time) as TimeRemaining,
                };
            } else if (
                action === 'challenge'
                || action === 'clockStart'
                || action === 'down'
                || action === 'juryDeliberation'
                || action === 'resetDecisions'
            ) {
                data = {
                    platform,
                };
            } else {
                return;
            }

            this.emit(action, data);
        });

        return new Promise<void>((resolve, reject) => {
            this.mqtt?.on('connect', () => {
                this.debug('connected');

                this.emit('connect');
                this.mqtt?.subscribe(FOP_TOPICS, (error) => {
                    if (error) {
                        console.error('Failed to subscribe to owlcms messages.');
                        console.error(error);
                        return;
                    }

                    this.debug('subscribed to owlcms messages');
                    resolve();
                });

                this.requestConfig();
            });

            this.mqtt?.on('error', (error) => {
                this.debug('client error');
                reject(error);
            });

            this.mqtt?.once('offline', () => {
                reject(new Error('MQTT server offline'));
            });

            this.mqtt?.on('offline', () => {
                this.debug('client offline');

                this.emit('disconnect');
            });

            this.mqtt?.on('reconnect', () => {
                this.debug('reconnect');
            });
        });
    }

    public async disconnect() {
        if (!this.mqtt) {
            return;
        }

        return new Promise<void>((resolve) => {
            this.mqtt?.end(false, () => {
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
        this.mqtt?.publish(`owlcms/clock/${platform}`, '60');
    }

    public publishJuryDecision({
        decision,
        platform,
    }: {
        decision: Decision;
        platform: string;
    }) {
        this.mqtt?.publish(`owlcms/jurybox/decision/${platform}`, decision);
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
        this.mqtt?.publish(`owlcms/jurybox/juryMember/decision/${platform}`, `${juryMember} ${decision}`);
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
        this.mqtt?.publish(`owlcms/refbox/decision/${platform}`, `${referee} ${decision}`);
    }

    public requestConfig() {
        // Raspberry Pi OS 12 throws EFAULT if trying to publish an empty string
        // for the message, so we must send a space
        this.mqtt?.publish('owlcms/config', ' ');
    }

    public resumeCompetition({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt?.publish(`owlcms/jurybox/break/${platform}`, 'stop');
    }

    public startChallenge({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt?.publish(`owlcms/jurybox/break/${platform}`, 'challenge');
    }

    public startClock({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt?.publish(`owlcms/clock/${platform}`, 'start');
    }

    public startDeliberation({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt?.publish(`owlcms/jurybox/break/${platform}`, 'deliberation');
    }

    public startTechnicalBreak({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt?.publish(`owlcms/jurybox/break/${platform}`, 'technical');
    }

    public stopClock({
        platform,
    }: {
        platform: string;
    }) {
        this.mqtt?.publish(`owlcms/clock/${platform}`, 'stop');
    }

    public summon({
        official,
        platform,
    }: {
        official: Official;
        platform: string;
    }) {
        this.mqtt?.publish(`owlcms/jurybox/summon/${platform}`, official.toString());
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
        this.mqtt?.publish(`owlcms/clock/${platform}`, '120');
    }
}
