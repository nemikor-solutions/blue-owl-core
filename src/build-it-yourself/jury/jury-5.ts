import Jury from 'lib/model/jury';
import JuryMember from 'lib/model/jury-member';
import juryMemberButtons from 'lib/model/jury-member/buttons';
import juryMemberRgbLed from 'lib/model/jury-member/rgb-led';
import juryButtons from 'lib/model/jury/buttons';
import juryRefereeRgbLeds from 'lib/model/jury/referee-rgb-leds';
import runner from 'scripts/runner';

runner(({
    board,
    owlcms,
    platform,
}) => {
    new Jury({
        members: [
            new JuryMember({
                number: 1,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 53,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 51,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 'A0',
                            green: 'A1',
                            red: 'A2',
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 2,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 49,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 47,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 'A3',
                            green: 'A4',
                            red: 'A5',
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 3,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 45,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 43,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 'A6',
                            green: 'A7',
                            red: 'A8',
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 4,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 41,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 39,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 'A9',
                            green: 'A10',
                            red: 'A11',
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 5,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 37,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 35,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 'A12',
                            green: 'A13',
                            red: 'A14',
                        },
                    }),
                ],
            }),
        ],
        modules: [
            juryRefereeRgbLeds({
                board,
                referee1Pins: {
                    red: 13,
                    green: 12,
                    blue: 11,
                },
                referee2Pins: {
                    red: 9,
                    green: 8,
                    blue: 7,
                },
                referee3Pins: {
                    red: 5,
                    green: 4,
                    blue: 3,
                },
            }),
            juryButtons({
                badLiftButton: 21,
                badLiftButtonPullUp: true,
                board,
                deliberationButton: 19,
                deliberationButtonPullUp: true,
                goodLiftButton: 20,
                goodLiftButtonPullUp: true,
                resumeCompetitionButton: 17,
                resumeCompetitionButtonPullUp: true,
                summonAllRefereesButton: 14,
                summonAllRefereesButtonPullUp: true,
                summonReferee1Button: 10,
                summonReferee1ButtonPullUp: true,
                summonReferee2Button: 6,
                summonReferee2ButtonPullUp: true,
                summonReferee3Button: 2,
                summonReferee3ButtonPullUp: true,
                summonTechnicalControllerButton: 15,
                summonTechnicalControllerButtonPullUp: true,
                technicalBreakButton: 18,
                technicalBreakButtonPullUp: true,
            }),
        ],
        owlcms,
        platform,
    });
});
