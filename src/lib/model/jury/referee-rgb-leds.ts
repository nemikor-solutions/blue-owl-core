import type Jury from '../../model/jury';
import type {
    DigitalRgbOptions,
} from '../../johnny-five/digital-rgb';
import type {
    RefereeNumber,
} from '../../model/referee';

import DigitalRgb from '../../johnny-five/digital-rgb';
import {
    referees,
} from '../../model/referee';

export interface JuryRefereeRgbLedsOptions {
    anode?: DigitalRgbOptions['anode'];
    board?: DigitalRgbOptions['board'];
    referee1Pins: DigitalRgbOptions['pins'];
    referee2Pins: DigitalRgbOptions['pins'];
    referee3Pins: DigitalRgbOptions['pins'];
}

type RefereePinsProperty = keyof Omit<JuryRefereeRgbLedsOptions, 'anode' | 'board'>;

export default (options: JuryRefereeRgbLedsOptions) => {
    function refereePinsProperty(referee: RefereeNumber): RefereePinsProperty {
        return `referee${referee}Pins`;
    }

    const leds = referees.reduce((_leds, referee) => {
        const pinsProperty = refereePinsProperty(referee);
        _leds[pinsProperty] = new DigitalRgb({
            anode: options.anode,
            board: options.board,
            pins: options[pinsProperty],
        });

        return _leds;
    }, {} as Record<RefereePinsProperty, DigitalRgb>)

    return (jury: Jury) => {
        jury.on('refereeDecision', ({ decision, referee }) => {
            const ledProperty = refereePinsProperty(referee);
            leds[ledProperty][decision === 'good' ? 'white' : 'red']();
        });

        jury.on('resetRefereeDecisions', () => {
            referees.forEach((referee) => {
                const ledProperty = refereePinsProperty(referee);
                leds[ledProperty].off();
            });
        });
    };
}
