import type {
    Board,
    LedOption,
} from 'johnny-five';

import {
    Led,
} from 'johnny-five';

// This order is important since `colors` uses arrays in RGB order
const pinColors = [
    'red',
    'green',
    'blue',
] as const;

type PinColor = typeof pinColors[number];
export type Color =
    PinColor
    | 'aqua'
    | 'cyan'
    | 'fuchsia'
    | 'lime'
    | 'magenta'
    | 'white'
    | 'yellow';

const colors: Record<Color, [number, number, number]> = {
    aqua: [0, 1, 1],
    blue: [0, 0, 1],
    cyan: [0, 1, 1],
    fuchsia: [1, 0, 1],
    green: [0, 1, 0],
    lime: [0, 1, 0],
    magenta: [1, 0, 1],
    red: [1, 0, 0],
    white: [1, 1, 1],
    yellow: [1, 1, 0],
};

export interface DigitalRgbLedOptions {
    anode?: boolean | undefined;
    board?: Board | undefined;
    pins: {
        blue: LedOption['pin'];
        green: LedOption['pin'];
        red: LedOption['pin'];
    }
}

type Leds = Record<PinColor, Led>;

export default class DigitalRgbLed {
    private _color: Color = 'white';

    private interval: ReturnType<typeof setInterval> | null = null;

    private isOn = false;

    private leds: Leds;

    constructor(options: DigitalRgbLedOptions) {
        const baseOptions: Partial<LedOption> = {
            board: options.board,
            isAnode: options.anode,
        };

        this.leds = pinColors.reduce((leds, color) => {
            leds[color] = new Led({
                ...baseOptions,
                pin: options.pins[color],
            });

            return leds;
        }, {} as Partial<Leds>) as Leds;
    }

    private all(
        fn: (
            led: Led,
            data: {
                color: PinColor,
                index: number
            }
        ) => void
    ): this {
        pinColors.forEach((color, index) => {
            fn(this.leds[color], { color, index });
        });

        return this;
    }

    public blink(duration: number): this {
        this.stop();

        this.interval = setInterval(() => {
            this.toggle();
        }, duration);

        return this;
    }

    public color(color: Color): this {
        this._color = color;

        if (this.isOn) {
            this.on();
        }

        return this;
    }

    public cycle({
        colors,
        duration,
        interval,
    }: {
        colors: Color[];
        duration?: number;
        interval: number;
    }): this {
        this.stop();

        let current = 0;
        this.color(colors[current] as Color).on();

        this.interval = setInterval(() => {
            current = (current + 1) % colors.length;
            this.color(colors[current] as Color);
        }, interval);

        if (duration) {
            setTimeout(() => {
                this.stop().off();
            }, duration);
        }

        return this;
    }

    public off(): this {
        this.isOn = false;

        return this.all((led) => led.off());
    }

    public on(): this {
        this.isOn = true;

        return this.all((led, { index }) => {
            led[colors[this._color][index] ? 'on' : 'off']();
        });
    }

    public stop(): this {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        return this;
    }

    public toggle(): this {
        this.isOn = !this.isOn;

        return this[this.isOn ? 'on' : 'off']();
    }
}
