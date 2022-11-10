import connectBoard from 'lib/board';
import Jury from 'lib/model/jury';
import JuryMember from 'lib/model/jury-member';
import juryMemberButtons from 'lib/model/jury-member/buttons';
import juryMemberRgbLed from 'lib/model/jury-member/rgb-led';
import juryButtons from 'lib/model/jury/buttons';
import juryRefereeLeds from 'lib/model/jury/referee-leds';
import Owlcms from 'lib/owlcms';
import parseConfig from 'scripts/config';

(async () => {
    const { mqttUrl: url, platform} = parseConfig();
    const owlcms = new Owlcms({
        url,
    });

    try {
        await owlcms.connect();

        const juryBox = await connectBoard();

        new Jury({
            members: [
                new JuryMember({
                    number: 1,
                    modules: [
                        juryMemberButtons({
                            badLiftButton: 24,
                            board: juryBox,
                            goodLiftButton: 26,
                        }),
                        juryMemberRgbLed({
                            anode: true,
                            board: juryBox,
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
                            board: juryBox,
                            goodLiftButton: 30,
                        }),
                        juryMemberRgbLed({
                            anode: true,
                            board: juryBox,
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
                            board: juryBox,
                            goodLiftButton: 34,
                        }),
                        juryMemberRgbLed({
                            anode: true,
                            board: juryBox,
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
                    board: juryBox,
                    referee1BadLiftLed: 33,
                    referee1GoodLiftLed: 31,
                    referee2BadLiftLed: 37,
                    referee2GoodLiftLed: 35,
                    referee3BadLiftLed: 41,
                    referee3GoodLiftLed: 39,
                }),
                juryButtons({
                    board: juryBox,
                    deliberationButton: 53,
                    resumeCompetitionButton: 47,
                    summonReferee1Button: 22,
                    summonReferee2Button: 23,
                    summonReferee3Button: 25,
                    summonTechnicalControllerButton: 51,
                    technicalBreakButton: 49,
                }),
            ],
            owlcms,
            platform,
        });
    } catch (error) {
        console.error(error);
        process.exitCode = 1;

        owlcms.disconnect();
    }
})();
