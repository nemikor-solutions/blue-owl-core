import type Referee from '@lib/model/referee';
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
    const piezo = new Piezo({
        board: options.board,
        pin: options.piezo,
    });

    function play(song: PiezoTune['song']) {
        piezo.play({
            song,
            tempo: 600,
        }, () => {
            // For some reason, the pin tends to go high after playing,
            // so we manually set it low (off).
            piezo.off();
        });
    }

    return (referee: Referee) => {
        referee.on('decisionRequest', () => {
            play([
                ['c6', 2],
                [null, 1],
                ['c6', 2],
            ]);
        });

        referee.on('summon', () => {
            play([
                ['c4', 1],
                ['c5', 1],
                [null, 1],
                ['c4', 1],
                ['c5', 1],
            ]);
        });
    };
};
