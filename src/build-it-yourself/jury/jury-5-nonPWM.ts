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
                        badLiftButton: 'A9',
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 'A8',
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 29,
                            green: 27,
                            red: 25,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 2,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 'A7',
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 'A6',
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 35,
                            green: 33,
                            red: 31,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 3,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 'A5',
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 'A4',
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 41,
                            green: 39,
                            red: 37,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 4,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 'A3',
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 'A2',
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 47,
                            green: 42,
                            red: 40,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 5,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 'A1',
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 'A0',
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 53,
                            green: 51,
                            red: 49,
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
