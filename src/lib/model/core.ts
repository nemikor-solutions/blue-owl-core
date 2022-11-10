import debug from 'debug';
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
    protected debug!: debug.Debugger;

    protected abstract get debuggerName(): string;

    protected get modules() {
        return this.options.modules;
    }

    protected options: OptionsT;

    public constructor(options: OptionsT) {
        super();

        this.options = options;
        this.modules.forEach((module) => {
            module(this);
        });
    }

    protected abstract _initialize(): void

    protected initialize() {
        this.debug = debug(`blue-owl:${this.debuggerName}`);

        this._initialize();

        this.debug('initialized');
        this.emit('initialized');
    }

    // public override on<T extends keyof EventsT>(type: T, listener: EventsT[T]): this {
    //     return super.on(type, listener);
    // }
}
