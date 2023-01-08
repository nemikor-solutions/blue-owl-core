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
                            blue: 54,
                            green: 55,
                            red: 56,
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
                            blue: 57,
                            green: 58,
                            red: 59,
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
                            blue: 60,
                            green: 61,
                            red: 62,
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
                            blue: 63,
                            green: 64,
                            red: 65,
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
                            blue: 66,
                            green: 67,
                            red: 68,
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
