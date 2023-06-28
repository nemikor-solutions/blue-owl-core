import type {
    ModelEvents,
    ModelOptions,
} from '@lib/model/index';

import Model from '@lib/model/index';

interface DownSignalEvents extends ModelEvents {
    down: () => void;
    timeRemaining: (data: DownSignalTimeRemainingEvent) => void;
}

export type DownSignalOptions = ModelOptions<DownSignal>;

export interface DownSignalTimeRemainingEvent {
    time: TimeRemaining;
}

export type TimeRemaining =
    | 0
    | 30
    | 90;

export default class DownSignal extends Model<DownSignalOptions> {
    protected override get debuggerName() {
        return `down-signal:${this.platform}`;
    }

    public constructor(options: DownSignalOptions) {
        super(options);
        this.initialize();
    }

    protected _initialize() {
        this.owlcms.on('down', ({ platform }) => {
            if (platform !== this.platform) {
                return;
            }

            this.down();
        });

        this.owlcms.on('timeRemaining', ({ platform, time }) => {
            if (platform !== this.platform) {
                return;
            }

            this.timeRemaining(time);
        })
    }

    private down() {
        this.debug('down');
        this.emit('down');
    }

    public override on<T extends keyof DownSignalEvents>(type: T, listener: DownSignalEvents[T]): this {
        return super.on(type, listener);
    }

    private timeRemaining(time: TimeRemaining) {
        this.debug(`time remaining: ${time}`);
        this.emit('timeRemaining', { time });
    }
}
