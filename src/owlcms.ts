import type {
    Decision,
    RefereeNumber
} from './referee';

import debug from 'debug';
import EventEmitter from 'node:events';
import mqtt from 'mqtt';

export interface DecisionRequestEvent {
    platform: string;
    referee: RefereeNumber;
}

interface OwlcmsEvents {
    decisionRequest: (data: DecisionRequestEvent) => void;
}

export interface OwlcmsOptions {
    url: string;
}

export default class Owlcms
    extends EventEmitter
{
    private debug: debug.Debugger;

    private mqtt: mqtt.Client;

    private static requiredOptions: Array<keyof OwlcmsOptions> = [
        'url',
    ];

    public constructor(options: OwlcmsOptions) {
        super();

        Owlcms.requiredOptions.forEach((option) => {
            if (!options[option]) {
                throw new Error(`Missing required option: ${option}`);
            }
        });

        this.debug = debug('owlcms');
        this.mqtt = mqtt.connect(options.url);
    }

    public async connect() {
        this.mqtt.on('message', (topic, _message) => {
            const message = _message.toString();
            this.debug(`${topic}: ${message}`);

            const [, action, ...topicParts] = topic.split('/');
            let data: DecisionRequestEvent;

            switch (action) {
            case 'decisionRequest':
                if (message === 'off') {
                    return;
                }

                const [platform, referee] = topicParts as [string, string];

                data = {
                    platform,
                    referee: parseInt(referee) as RefereeNumber,
                };
                break;
            default:
                return;
            }

            this.emit(action, data);
        });

        return new Promise<void>((resolve, reject) => {
            this.mqtt.on('connect', () => {
                this.debug('connected');

                this.mqtt.subscribe('owlcms/#', (error) => {
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

    public publishDecision({
        decision,
        platform,
        referee,
    }: {
        decision: Decision;
        platform: string;
        referee: number;
    }) {
        this.mqtt.publish(`owlcms/decision/${platform}`, `${referee} ${decision}`);
    }
}
