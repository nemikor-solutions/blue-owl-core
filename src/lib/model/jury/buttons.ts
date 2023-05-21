import type Jury from '@lib/model/jury/index';
import type {
    RefereeNumber,
} from '@lib/model/referee/index';
import type {
    Board,
    ButtonOption,
} from 'johnny-five';

import {
    referees,
} from '@lib/model/referee/index';
import {
    Button,
} from 'johnny-five';

export interface JuryButtonsOptions {
    badLiftButton: ButtonOption['pin'];
    badLiftButtonPullUp?: ButtonOption['isPullup'];
    board?: Board;
    challengeButton?: ButtonOption['pin'];
    challengeButtonPullUp?: ButtonOption['isPullup'];
    deliberationButton: ButtonOption['pin'];
    deliberationButtonPullUp?: ButtonOption['isPullup'];
    goodLiftButton: ButtonOption['pin'];
    goodLiftButtonPullUp?: ButtonOption['isPullup'];
    resumeCompetitionButton: ButtonOption['pin'];
    resumeCompetitionButtonPullUp?: ButtonOption['isPullup'];
    summonAllRefereesButton?: ButtonOption['pin'];
    summonAllRefereesButtonPullUp?: ButtonOption['isPullup'];
    summonReferee1Button: ButtonOption['pin'];
    summonReferee1ButtonPullUp?: ButtonOption['isPullup'];
    summonReferee2Button: ButtonOption['pin'];
    summonReferee2ButtonPullUp?: ButtonOption['isPullup'];
    summonReferee3Button: ButtonOption['pin'];
    summonReferee3ButtonPullUp?: ButtonOption['isPullup'];
    summonTechnicalControllerButton?: ButtonOption['pin'];
    summonTechnicalControllerButtonPullUp?: ButtonOption['isPullup'];
    technicalBreakButton: ButtonOption['pin'];
    technicalBreakButtonPullUp?: ButtonOption['isPullup'];
}

export default (options: JuryButtonsOptions) => {
    const badLift = new Button({
        board: options.board,
        isPullup: options.badLiftButtonPullUp,
        pin: options.badLiftButton,
    });
    const goodLift = new Button({
        board: options.board,
        isPullup: options.goodLiftButtonPullUp,
        pin: options.goodLiftButton,
    });
    const deliberation = new Button({
        board: options.board,
        isPullup: options.deliberationButtonPullUp,
        pin: options.deliberationButton,
    });
    const summonAllReferees = options.summonAllRefereesButton
        ? new Button({
            board: options.board,
            isPullup: options.summonAllRefereesButtonPullUp,
            pin: options.summonAllRefereesButton,
        })
        : null;
    const summonTechnicalController = options.summonTechnicalControllerButton
        ? new Button({
            board: options.board,
            isPullup: options.summonTechnicalControllerButtonPullUp,
            pin: options.summonTechnicalControllerButton,
        })
        : null;
    const resumeCompetition = new Button({
        board: options.board,
        isPullup: options.resumeCompetitionButtonPullUp,
        pin: options.resumeCompetitionButton,
    });
    const technicalBreak = new Button({
        board: options.board,
        isPullup: options.technicalBreakButtonPullUp,
        pin: options.technicalBreakButton,
    });
    const challenge = options.challengeButton
        ? new Button({
            board: options.board,
            isPullup: options.challengeButtonPullUp,
            pin: options.challengeButton,
        })
        : null;

    const refereeButtons = referees.reduce((buttons, referee) => {
        const pinProperty = `summonReferee${referee}Button` as const;
        const pullUpProperty = `summonReferee${referee}ButtonPullUp` as const;
        buttons[referee] = new Button({
            board: options.board,
            isPullup: options[pullUpProperty],
            pin: options[pinProperty],
        });

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

        summonAllReferees?.on('press', () => {
            jury.summonAllReferees();
        });

        summonTechnicalController?.on('press', () => {
            jury.summonTechnicalController();
        });

        technicalBreak.on('press', () => {
            jury.startTechnicalBreak();
        });

        challenge?.on('press', () => {
            jury.startChallenge();
        })

        referees.forEach((referee) => {
            refereeButtons[referee].on('press', () => {
                jury.summonReferee(referee);
            });
        });
    };
};
