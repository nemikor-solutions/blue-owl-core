import type Jury from 'lib/model/jury';
import type {
    Decision,
    RefereeNumber,
} from 'lib/model/referee';
import type {
    Board,
    LedOption,
} from 'johnny-five';

import {
    decisions,
    referees,
} from 'lib/model/referee';
import {
    Led,
} from 'johnny-five';

type Capitalized<T> = T extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : never;

export interface JuryRefereeLedsOptions {
    board?: Board;
    referee1BadLiftLed: LedOption['pin'];
    referee1GoodLiftLed: LedOption['pin'];
    referee2BadLiftLed: LedOption['pin'];
    referee2GoodLiftLed: LedOption['pin'];
    referee3BadLiftLed: LedOption['pin'];
    referee3GoodLiftLed: LedOption['pin'];
}

type RefereeDecisionProperty = keyof Omit<JuryRefereeLedsOptions, 'board'>;

export default (options: JuryRefereeLedsOptions) => {
    function refereeDecisionProperty({
        decision,
        referee,
    }: {
        decision: Decision;
        referee: RefereeNumber;
    }): RefereeDecisionProperty {
        const capitalizedDecision = decision.replace(
            /^(\w)/,
            (character) => character.toUpperCase()
        ) as Capitalized<Decision>;

        return `referee${referee}${capitalizedDecision}LiftLed`;
    }

    const leds = referees.reduce((_leds, referee) => {
        decisions.forEach((decision) => {
            const ledProperty = refereeDecisionProperty({ decision, referee });
            _leds[ledProperty] = new Led({
                board: options.board,
                pin: options[ledProperty],
            });
        });

        return _leds;
    }, {} as Record<RefereeDecisionProperty, Led>)

    return (jury: Jury) => {
        jury.on('refereeDecision', ({ decision, referee }) => {
            const ledProperty = refereeDecisionProperty({ decision, referee });
            leds[ledProperty].on();

            const otherLedProperty = refereeDecisionProperty({
                decision: decision === 'good' ? 'bad' : 'good',
                referee,
            });
            leds[otherLedProperty].off();
        });

        jury.on('resetRefereeDecisions', () => {
            referees.forEach((referee) => {
                decisions.forEach((decision) => {
                    const ledProperty = refereeDecisionProperty({ decision, referee });
                    leds[ledProperty].off();
                });
            });
        });
    };
}
