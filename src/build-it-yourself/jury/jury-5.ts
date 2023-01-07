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
                        badLiftButton: 23,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 25,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 22,
                            green: 24,
                            red: 26,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 2,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 27,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 29,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 28,
                            green: 30,
                            red: 32,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 3,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 31,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 33,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 34,
                            green: 36,
                            red: 38,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 4,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 35,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 37,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 40,
                            green: 42,
                            red: 44,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 5,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 39,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 41,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        board,
                        pins: {
                            blue: 46,
                            green: 48,
                            red: 50,
                        },
                    }),
                ],
            }),
        ],
        modules: [
            juryRefereeRgbLeds({
                board,
                referee1Pins: {
                    red: 2,
                    green: 3,
                    blue: 4,
                },
                referee2Pins: {
                    red: 5,
                    green: 6,
                    blue: 7,
                },
                referee3Pins: {
                    red: 8,
                    green: 9,
                    blue: 10,
                },
            }),
            juryButtons({
                badLiftButton: 45,
                badLiftButtonPullUp: true,
                board,
                deliberationButton: 43,
                deliberationButtonPullUp: true,
                goodLiftButton: 47,
                goodLiftButtonPullUp: true,
                resumeCompetitionButton: 53,
                resumeCompetitionButtonPullUp: true,
                summonAllRefereesButton: 17,
                summonAllRefereesButtonPullUp: true,
                summonReferee1Button: 14,
                summonReferee1ButtonPullUp: true,
                summonReferee2Button: 15,
                summonReferee2ButtonPullUp: true,
                summonReferee3Button: 16,
                summonReferee3ButtonPullUp: true,
                summonTechnicalControllerButton: 49,
                summonTechnicalControllerButtonPullUp: true,
                technicalBreakButton: 51,
                technicalBreakButtonPullUp: true,
            }),
        ],
        owlcms,
        platform,
    });
});
