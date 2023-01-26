import type Jury from '@lib/model/jury';
import type {
    DigitalRgbLedOptions,
} from '@lib/johnny-five/digital-rgb-led';
import type {
    RefereeNumber,
} from '@lib/model/referee';

import DigitalRgbLed from '@lib/johnny-five/digital-rgb-led';
import {
    referees,
} from '@lib/model/referee';

export interface JuryRefereeRgbLedsOptions {
    anode?: DigitalRgbLedOptions['anode'];
    board?: DigitalRgbLedOptions['board'];
    referee1Pins: DigitalRgbLedOptions['pins'];
    referee2Pins: DigitalRgbLedOptions['pins'];
    referee3Pins: DigitalRgbLedOptions['pins'];
}

type RefereePinsProperty = keyof Omit<JuryRefereeRgbLedsOptions, 'anode' | 'board'>;

export default (options: JuryRefereeRgbLedsOptions) => {
    function refereePinsProperty(referee: RefereeNumber): RefereePinsProperty {
        return `referee${referee}Pins`;
    }

    const leds = referees.reduce((_leds, referee) => {
        const pinsProperty = refereePinsProperty(referee);
        _leds[pinsProperty] = new DigitalRgbLed({
            anode: options.anode,
            board: options.board,
            pins: options[pinsProperty],
        });

        return _leds;
    }, {} as Record<RefereePinsProperty, DigitalRgbLed>)

    return (jury: Jury) => {
        jury.on('initialized', () => {
            referees.forEach((referee) => {
                const pinsProperty = refereePinsProperty(referee);
                leds[pinsProperty].cycle({
                    colors: ['red', 'white'],
                    duration: 2000,
                    interval: 300,
                });
            });
        });

        jury.on('refereeDecision', ({ decision, referee }) => {
            const ledProperty = refereePinsProperty(referee);
            leds[ledProperty].color(decision === 'good' ? 'white' : 'red').on();
        });

        jury.on('resetRefereeDecisions', () => {
            referees.forEach((referee) => {
                const ledProperty = refereePinsProperty(referee);
                leds[ledProperty].off();
            });
        });
    };
}
