import type {
    BoardOption,
} from 'johnny-five';

import {
    Board,
} from 'johnny-five';

export default (options: BoardOption = {}) => {
    const board = new Board({ repl: false, ...options });

    return new Promise<Board>((resolve, reject) => {
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
