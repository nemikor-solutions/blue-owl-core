import type {
    BoardOption,
} from 'johnny-five';

import {
    Board,
} from 'johnny-five';

export default (options: BoardOption = {}) => {
    let board: Board;
    try {
        board = new Board({ repl: false, ...options });
    } catch (error) {
        console.log()
        if (! options.port) {
            console.error("Error: Could not autodetect the device. Please provide the communication port name.")
        } else {
            console.error("Error: "+error)
        }
        console.log()
        // give time to read messages when running in a command window
        setTimeout(() => {process.exit();}, 10000)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise<Board>((_resolve, _reject) => {return;})
    }
    
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
