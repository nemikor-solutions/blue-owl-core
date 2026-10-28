// Jury display of referee decisions for devices that use separate LEDs per referee instead of a 
// single RGB LED (see referee-rgb-leds.ts): a red LED for bad lifts, a white LED for good lifts, 
// and an optional green LED for decisions that have been received but are hidden.

import type Jury from '@lib/model/jury/index';
import type {
    RefereeDecisionState,
    RefereeNumber,
} from '@lib/model/referee/index';
import type {
    Board,
    LedOption,
} from 'johnny-five';

import {
    decisions,
    referees,
} from '@lib/model/referee/index';
import {
    Led,
} from 'johnny-five';

type Capitalized<T> = T extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : never;

// The hidden lift LEDs are optional (backward compatibility)
export interface JuryRefereeLedsOptions {
    board?: Board;
    referee1BadLiftLed: LedOption['pin'];
    referee1GoodLiftLed: LedOption['pin'];
    referee1HiddenLiftLed?: LedOption['pin'];
    referee2BadLiftLed: LedOption['pin'];
    referee2GoodLiftLed: LedOption['pin'];
    referee2HiddenLiftLed?: LedOption['pin'];
    referee3BadLiftLed: LedOption['pin'];
    referee3GoodLiftLed: LedOption['pin'];
    referee3HiddenLiftLed?: LedOption['pin'];
}

type RefereeDecisionProperty = keyof Omit<JuryRefereeLedsOptions, 'board'>;

const decisionStates: RefereeDecisionState[] = [
    ...decisions,
    'hidden',
];

export default (options: JuryRefereeLedsOptions) => {
    function refereeDecisionProperty({
        decision,
        referee,
    }: {
        decision: RefereeDecisionState;
        referee: RefereeNumber;
    }): RefereeDecisionProperty {
        const capitalizedDecision = decision.replace(
            /^(\w)/,
            (character) => character.toUpperCase()
        ) as Capitalized<RefereeDecisionState>;

        return `referee${referee}${capitalizedDecision}LiftLed`;
    }

    // The hidden lift LEDs are optional. Without one, a hidden decision
    // leaves the referee's LEDs off until the decision is revealed.
    const leds = referees.reduce((_leds, referee) => {
        decisionStates.forEach((decision) => {
            const ledProperty = refereeDecisionProperty({ decision, referee });
            const pin = options[ledProperty];

            if (pin === undefined) {
                return;
            }

            _leds[ledProperty] = new Led({
                board: options.board,
                pin,
            });
        });

        return _leds;
    }, {} as Partial<Record<RefereeDecisionProperty, Led>>)

    return (jury: Jury) => {
        jury.on('refereeDecision', ({ decision, referee }) => {
            decisionStates.forEach((_decision) => {
                const led = leds[refereeDecisionProperty({ decision: _decision, referee })];

                if (_decision === decision) {
                    led?.on();
                } else {
                    led?.off();
                }
            });
        });

        jury.on('resetRefereeDecisions', () => {
            referees.forEach((referee) => {
                decisionStates.forEach((decision) => {
                    const ledProperty = refereeDecisionProperty({ decision, referee });
                    leds[ledProperty]?.off();
                });
            });
        });
    };
}
