import type DownSignal from 'lib/model/down-signal';
import type {
    Board,
    RelayOption,
} from 'johnny-five';

import {
    Relay,
} from 'johnny-five';

export interface DownSignalRelayOptions {
    board?: Board;
    duration: number;
    pin: RelayOption['pin'];
    type?: RelayOption['type'];
}

export default (options: DownSignalRelayOptions) => {
    const relay = new Relay({
        board: options.board,
        pin: options.pin,
        type: options.type || 'NO',
    });

    function toggle() {
        relay.close();
        setTimeout(() => {
            relay.open();
        }, options.duration);
    }

    return (downSignal: DownSignal) => {
        downSignal.on('initialized', () => {
            toggle();
        });

        downSignal.on('down', () => {
            toggle()
        });
    };
};
