import type {
    ModelEvents,
    ModelOptions,
} from '../model';

import Model from '../model';

interface DownSignalEvents extends ModelEvents {
    down: () => void;
}

export type DownSignalOptions = ModelOptions<DownSignal>;

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
    }

    private down() {
        this.debug('down');
        this.emit('down');
    }

    public override on<T extends keyof DownSignalEvents>(type: T, listener: DownSignalEvents[T]): this {
        return super.on(type, listener);
    }
}
