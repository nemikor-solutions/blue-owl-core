import type {
    Board,
    LedOption,
} from 'johnny-five';

import {
    Led,
} from 'johnny-five';

const colors = [
    'blue',
    'green',
    'red',
] as const;

export interface DigitalRgbOptions {
    anode?: boolean | undefined;
    board?: Board | undefined;
    pins: {
        blue: LedOption['pin'];
        green: LedOption['pin'];
        red: LedOption['pin'];
    }
}

type Leds = Record<typeof colors[number], Led>;

export default class DigitalRgb {
    leds: Leds;

    constructor(options: DigitalRgbOptions) {
        const baseOptions: Partial<LedOption> = {
            board: options.board,
            isAnode: options.anode,
        };

        this.leds = colors.reduce((leds, color) => {
            leds[color] = new Led({
                ...baseOptions,
                pin: options.pins[color],
            });

            return leds;
        }, {} as Partial<Leds>) as Leds;
    }

    green() {
        this.off();
        this.leds.green.on();
    }

    off() {
        this.leds.blue.off();
        this.leds.green.off();
        this.leds.red.off();
    }

    red() {
        this.off();
        this.leds.red.on();
    }

    white() {
        this.leds.blue.on();
        this.leds.green.on();
        this.leds.red.on();
    }
}
