import type Down from '../../model/down';
import type {
    Board,
    RelayOption,
} from 'johnny-five';

import {
    Relay,
} from 'johnny-five';

export interface DownRelayOptions {
    board?: Board;
    lightRelay: RelayOption['pin'];
    soundRelay: RelayOption['pin'];
    soundDuration?: number;
    lightDuration?: number;
}

export default (options: DownRelayOptions) => {
    const soundRelay = new Relay({
        board: options.board,
        pin: options.soundRelay,
        type: "NC",
    });
    const lightRelay = new Relay({
        board: options.board,
        pin: options.lightRelay,
        type: "NC",
    });

    function triggerRelays() {
        lightRelay.close();
        soundRelay.close();
        setTimeout(() => lightRelay.open(), options.lightDuration ||= 2000);
        setTimeout(() => soundRelay.open(), options.soundDuration ||= 500);
    }

    return (down: Down) => {
        down.on('initialized', () => {
            // beep to confirm when starting up.
            triggerRelays();
        });
        down.on('triggerRelays', () => {
            triggerRelays()
        });
    };
};