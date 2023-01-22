import type {
    ModelEvents,
    ModelOptions,
} from '../model';

import Model from '../model';

interface DownEvents extends ModelEvents {
    triggerRelays: () => void;
}

export type DownOptions = ModelOptions<Down>;

export default class Down extends Model<DownOptions> {
    protected override get debuggerName() {
        return `down:${this.platform}`;
    }

    public constructor(options: DownOptions) {
        super(options);
        this.initialize();
    }

    protected _initialize() {
        this.owlcms.on('down', ({ platform }) => {
            if (platform !== this.platform) {
                return;
            }
            console.log("owlcms down event received")
            this.triggerDown();
        });
    }

    private triggerDown() {
        this.debug('down signal. triggering relays.');
        this.emit('triggerRelays');
    }

    public override on<T extends keyof DownEvents>(type: T, listener: DownEvents[T]): this {
        return super.on(type, listener);
    }
}
