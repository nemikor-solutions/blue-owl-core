import Jury from 'lib/model/jury';
import JuryMember from 'lib/model/jury-member';
import juryMemberButtons from 'lib/model/jury-member/buttons';
import juryMemberRgbLed from 'lib/model/jury-member/rgb-led';
import juryButtons from 'lib/model/jury/buttons';
import juryRefereeLeds from 'lib/model/jury/referee-leds';
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
                        badLiftButton: 24,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 26,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        anode: true,
                        board,
                        pins: {
                            blue: 5,
                            green: 6,
                            red: 7,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 2,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 28,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 30,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        anode: true,
                        board,
                        pins: {
                            blue: 8,
                            green: 9,
                            red: 10,
                        },
                    }),
                ],
            }),
            new JuryMember({
                number: 3,
                modules: [
                    juryMemberButtons({
                        badLiftButton: 32,
                        badLiftButtonPullUp: true,
                        board,
                        goodLiftButton: 34,
                        goodLiftButtonPullUp: true,
                    }),
                    juryMemberRgbLed({
                        anode: true,
                        board,
                        pins: {
                            blue: 11,
                            green: 12,
                            red: 13,
                        },
                    }),
                ],
            }),
        ],
        modules: [
            juryRefereeLeds({
                board,
                referee1BadLiftLed: 33,
                referee1GoodLiftLed: 31,
                referee2BadLiftLed: 37,
                referee2GoodLiftLed: 35,
                referee3BadLiftLed: 41,
                referee3GoodLiftLed: 39,
            }),
            juryButtons({
                badLiftButton: 44,
                badLiftButtonPullUp: true,
                board,
                deliberationButton: 53,
                deliberationButtonPullUp: true,
                goodLiftButton: 46,
                goodLiftButtonPullUp: true,
                resumeCompetitionButton: 47,
                resumeCompetitionButtonPullUp: true,
                summonReferee1Button: 22,
                summonReferee1ButtonPullUp: true,
                summonReferee2Button: 23,
                summonReferee2ButtonPullUp: true,
                summonReferee3Button: 25,
                summonReferee3ButtonPullUp: true,
                summonTechnicalControllerButton: 51,
                summonTechnicalControllerButtonPullUp: true,
                technicalBreakButton: 49,
                technicalBreakButtonPullUp: true,
            }),
        ],
        owlcms,
        platform,
    });
});
