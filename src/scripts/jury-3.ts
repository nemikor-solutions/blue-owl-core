import Jury from '@lib/model/jury/index';
import JuryMember from '@lib/model/jury-member/index';
import juryMemberButtons from '@lib/model/jury-member/buttons';
import juryMemberRgbLed from '@lib/model/jury-member/rgb-led';
import juryButtons from '@lib/model/jury/buttons';
import juryRefereeRgbLeds from '@lib/model/jury/referee-rgb-leds';
import runner from '@scripts/runner';

runner(({
    board,
    owlcms,
    platform,
}) => {
    new Jury({
        modules: [
            juryRefereeRgbLeds({
                board,
                referee1Pins: {
                    red: 10,
                    green: 9,
                    blue: 8,
                },
                referee2Pins: {
                    red: 7,
                    green: 6,
                    blue: 5,
                },
                referee3Pins: {
                    red: 4,
                    green: 3,
                    blue: 2,
                },
            }),
            juryButtons({
                badLiftButton: 30,
                badLiftButtonPullUp: true,
                board,
                challengeButton: 37,
                challengeButtonPullUp: true,
                deliberationButton: 29,
                deliberationButtonPullUp: true,
                goodLiftButton: 31,
                goodLiftButtonPullUp: true,
                resumeCompetitionButton: 35,
                resumeCompetitionButtonPullUp: true,
                summonAllRefereesButton: 38,
                summonAllRefereesButtonPullUp: true,
                summonReferee1Button: 32,
                summonReferee1ButtonPullUp: true,
                summonReferee2Button: 33,
                summonReferee2ButtonPullUp: true,
                summonReferee3Button: 34,
                summonReferee3ButtonPullUp: true,
                technicalBreakButton: 36,
                technicalBreakButtonPullUp: true,
            }),
        ],
        owlcms,
        platform,
    });
    new JuryMember({
        modules: [
            juryMemberButtons({
                badLiftButton: 22,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 23,
                goodLiftButtonPullUp: true,
            }),
            juryMemberRgbLed({
                board,
                pins: {
                    blue: 44,
                    green: 43,
                    red: 42,
                },
            }),
        ],
        number: 1,
        owlcms,
        platform,
    });
    new JuryMember({
        modules: [
            juryMemberButtons({
                badLiftButton: 18,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 19,
                goodLiftButtonPullUp: true,
            }),
            juryMemberRgbLed({
                board,
                pins: {
                    blue: 52,
                    green: 53,
                    red: 45,
                },
            }),
        ],
        number: 2,
        owlcms,
        platform,
    });
    new JuryMember({
        modules: [
            juryMemberButtons({
                badLiftButton: 16,
                badLiftButtonPullUp: true,
                board,
                goodLiftButton: 17,
                goodLiftButtonPullUp: true,
            }),
            juryMemberRgbLed({
                board,
                pins: {
                    blue: 49,
                    green: 50,
                    red: 51,
                },
            }),
        ],
        number: 3,
        owlcms,
        platform,
    });
});
