import type Referee from '@lib/model/referee/index';
import type {
    Board,
    PiezoOption,
    PiezoTune,
} from 'johnny-five';

import {
    Piezo,
} from 'johnny-five';

export interface RefereeBuzzerOptions {
    board?: Board;
    piezo: PiezoOption['pin'];
}

export default (options: RefereeBuzzerOptions) => {
    let isRefSleeping = false;

    const piezo = new Piezo({
        board: options.board,
        pin: options.piezo,
    });

    async function play(song: PiezoTune['song']) {
        return new Promise<void>((resolve) => {
            piezo.play({
                song,
                tempo: 600,
            }, () => {
                // For some reason, the pin tends to go high after playing,
                // so we manually set it low (off).
                piezo.off();

                resolve();
            });
        });
    }

    function reset() {
        piezo.stop().off();
    }

    async function sleep(duration: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }

    async function wakeUp() {
        isRefSleeping = true;

        do {
            await play([
                ['c5', 2],
                [null, 1],
                ['c5', 2],
            ]);

            if (isRefSleeping) {
                await sleep(1_000);
            }
        } while (isRefSleeping);
    }

    return (referee: Referee) => {
        referee.on('initialized', () => {
            play([
                ['c4', 2],
                ['c5', 2],
                [null, 1],
                ['c5', 2],
            ]);
        });

        referee.on('decisionDisplayed', () => {
            isRefSleeping = false;
            reset();
        });

        referee.on('decisionPublished', () => {
            isRefSleeping = false;
            reset();
        });

        referee.on('decisionRequest', () => {
            wakeUp();
        });

        referee.on('resetDecision', () => {
            isRefSleeping = false;
            reset();
        });

        referee.on('summon', () => {
            play([
                ['c4', 2],
                ['c5', 2],
                [null, 1],
                ['c4', 2],
                ['c5', 2],
                [null, 4],
                ['c4', 2],
                ['c5', 2],
                [null, 1],
                ['c4', 2],
                ['c5', 2],
            ]);
        });
    };
};
