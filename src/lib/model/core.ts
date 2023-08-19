import type {
    Logger,
} from '@lib/logger';
import {
    createLogger,
} from '@lib/logger';
import EventEmitter from 'node:events';

export interface CoreModelOptions<T> {
    modules: Array<(model: T) => void>;
}

export interface CoreModelEvents {
    initialized: () => void;
}

export default abstract class CoreModel<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OptionsT extends CoreModelOptions<any>,
    // EventsT extends CoreModelEvents,
> extends EventEmitter {
    protected debug!: Logger;

    protected abstract get debuggerName(): string;

    protected get modules() {
        return this.options.modules;
    }

    protected options: OptionsT;

    public constructor(options: OptionsT) {
        super();

        this.options = options;

        // Johnny-Five does not seem to ensure that the MCU pins are in
        // a proper state immediately upon initialization. Introduce a
        // slight delay for module initialization to prevent processing
        // phantom input signals such as button presses.
        setTimeout(() => {
            this.modules.forEach((module) => {
                module(this);
            });

            this.initialize();
        }, 200);
    }

    protected abstract _initialize(): void

    protected initialize() {
        this.debug = createLogger(this.debuggerName);

        this._initialize();

        this.debug('initialized');
        this.emit('initialized');
    }

    // public override on<T extends keyof EventsT>(type: T, listener: EventsT[T]): this {
    //     return super.on(type, listener);
    // }
}
