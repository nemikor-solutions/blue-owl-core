import type DownSignal from '@lib/model/down-signal/index';
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

    async function sleep(duration: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }

    async function toggle(pattern: number[], action: 'close' | 'open' = 'close') {
        if (!pattern.length) {
            relay.open();
            return;
        }

        const duration = pattern.shift() as number;
        relay[action]();
        await sleep(duration);
        await toggle(pattern, action === 'close' ? 'open' : 'close');
    }

    return (downSignal: DownSignal) => {
        downSignal.on('initialized', () => {
            toggle([200, 200, 200]);
        });

        downSignal.on('down', () => {
            toggle([options.duration])
        });
    };
};
