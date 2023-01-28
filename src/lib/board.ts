import type {
    BoardOption as BoardOptions,
} from 'johnny-five';

import {
    Board,
} from 'johnny-five';

export type {
    Board,
    BoardOptions,
};

export default (options: BoardOptions = {}): Promise<Board> => {
    return new Promise<Board>((resolve, reject) => {
        const board = new Board({ repl: false, ...options });

        board.on('ready', () => {
            resolve(board);
        });

        board.on('fail', ({ message }) => {
            reject(new Error(message));
        });

        board.on('error', (error) => {
            reject(error);
        });
    });
};
