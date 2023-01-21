import type Owlcms from './owlcms';
import type {
    CoreModelEvents,
    CoreModelOptions,
} from 'lib/model/core';

import CoreModel from './model/core';

export interface ModelOptions<T> extends CoreModelOptions<T> {
    owlcms: Owlcms;
    platform: string;
}

export type ModelEvents = CoreModelEvents;

export default abstract class Model<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OptionsT extends ModelOptions<any>,
    // EventsT extends ModelEvents,
> extends CoreModel<OptionsT> {
    protected get owlcms() {
        return this.options.owlcms;
    }

    protected get platform() {
        return this.options.platform;
    }
}
