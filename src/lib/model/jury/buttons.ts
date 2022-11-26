import type Jury from 'lib/model/jury';
import type {
    RefereeNumber,
} from 'lib/model/referee';
import type {
    Board,
    ButtonOption,
} from 'johnny-five';

import {
    referees,
} from 'lib/model/referee';
import {
    Button,
} from 'johnny-five';

export interface JuryButtonsOptions {
    badLiftButton: ButtonOption['pin'];
    board?: Board;
    deliberationButton: ButtonOption['pin'];
    goodLiftButton: ButtonOption['pin'];
    resumeCompetitionButton: ButtonOption['pin'];
    summonReferee1Button: ButtonOption['pin'];
    summonReferee2Button: ButtonOption['pin'];
    summonReferee3Button: ButtonOption['pin'];
    summonTechnicalControllerButton: ButtonOption['pin'];
    technicalBreakButton: ButtonOption['pin'];
}

export default (options: JuryButtonsOptions) => {
    const badLift = new Button(options.badLiftButton);
    const goodLift = new Button(options.goodLiftButton);
    const deliberation = new Button(options.deliberationButton);
    const summonTechnicalController = new Button(options.summonTechnicalControllerButton);
    const resumeCompetition = new Button(options.resumeCompetitionButton);
    const technicalBreak = new Button(options.technicalBreakButton);

    const refereeButtons = referees.reduce((buttons, referee) => {
        const summonProperty = `summonReferee${referee}Button` as const;
        buttons[referee] = new Button(options[summonProperty]);

        return buttons;
    }, {} as Record<RefereeNumber, Button>);

    return (jury: Jury) => {
        badLift.on('press', () => {
            jury.publishDecision('bad');
        });

        goodLift.on('press', () => {
            jury.publishDecision('good');
        });

        deliberation.on('press', () => {
            jury.startDeliberation();
        });

        resumeCompetition.on('press', () => {
            jury.resumeCompetition();
        });

        summonTechnicalController.on('press', () => {
            jury.summonTechnicalController();
        });

        technicalBreak.on('press', () => {
            jury.startTechnicalBreak();
        });

        referees.forEach((referee) => {
            refereeButtons[referee].on('press', () => {
                jury.summonReferee(referee);
            });
        });
    };
};
