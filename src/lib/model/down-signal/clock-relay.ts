import type DownSignal from '@lib/model/down-signal/index';
import type {
    Board,
    RelayOption,
} from 'johnny-five';

import {
    Relay,
} from 'johnny-five';

export interface DownSignalClockRelayOptions {
    board?: Board;
    pin: RelayOption['pin'];
    type?: RelayOption['type'];
}

function sleep(duration: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

export default (options: DownSignalClockRelayOptions) => {
    const relay = new Relay({
        board: options.board,
        pin: options.pin,
        type: options.type || 'NO',
    });

    return (downSignal: DownSignal) => {
        downSignal.on('timeRemaining', async ({ time }) => {
            if (time === 90) {
                relay.close();
                await sleep(200);
                relay.open();
                await sleep(100);
                relay.close();
                await sleep(200);
                relay.open();
                await sleep(100);
                relay.close();
                await sleep(200);
                relay.open();
            } else if (time === 30) {
                relay.close();
                await sleep(200);
                relay.open();
                await sleep(100);
                relay.close();
                await sleep(200);
                relay.open();
            } else {
                relay.close();
                await sleep(1000);
                relay.open();
            }
        });
    };
};
