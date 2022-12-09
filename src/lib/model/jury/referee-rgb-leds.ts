import type Jury from 'lib/model/jury';
import type {
    RefereeNumber,
} from 'lib/model/referee';
import type {
    Board,
} from 'johnny-five';

import {
    referees,
} from 'lib/model/referee';
import {
    Led,
} from 'johnny-five';

export interface JuryRefereeRgbLedsOptions {
    anode?: Led.RGBOption['isAnode'];
    board?: Board;
    referee1Pins: Led.RGBOption['pins'];
    referee2Pins: Led.RGBOption['pins'];
    referee3Pins: Led.RGBOption['pins'];
}

type RefereePinsProperty = keyof Omit<JuryRefereeRgbLedsOptions, 'anode' | 'board'>;

export default (options: JuryRefereeRgbLedsOptions) => {
    function refereePinsProperty(referee: RefereeNumber): RefereePinsProperty {
        return `referee${referee}Pins`;
    }

    const leds = referees.reduce((_leds, referee) => {
        const pinsProperty = refereePinsProperty(referee);
        _leds[pinsProperty] = new Led.RGB({
            board: options.board,
            isAnode: options.anode,
            pins: options[pinsProperty],
        });

        return _leds;
    }, {} as Record<RefereePinsProperty, Led.RGB>)

    return (jury: Jury) => {
        jury.on('refereeDecision', ({ decision, referee }) => {
            const ledProperty = refereePinsProperty(referee);
            leds[ledProperty].color(decision === 'good' ? '#ffffff' : '#ff0000');
            leds[ledProperty].on();
        });

        jury.on('resetRefereeDecisions', () => {
            referees.forEach((referee) => {
                const ledProperty = refereePinsProperty(referee);
                leds[ledProperty].off();
            });
        });
    };
}
