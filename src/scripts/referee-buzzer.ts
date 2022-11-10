import connectBoard from 'lib/board';
import Owlcms from 'lib/owlcms';
import parseConfig from 'scripts/config';
import Referee from 'lib/model/referee';
import refereeButtons from 'lib/model/referee/buttons';
import refereeBuzzer from 'lib/model/referee/buzzer';

(async () => {
    const { mqttUrl: url, platform} = parseConfig();
    const owlcms = new Owlcms({
        url,
    });

    try {
        await owlcms.connect();

        const refBox = await connectBoard();

        new Referee({
            modules: [
                refereeButtons({
                    badLiftButton: 3,
                    board: refBox,
                    goodLiftButton: 4,
                }),
                refereeBuzzer({
                    board: refBox,
                    piezo: 2,
                }),
            ],
            number: 1,
            owlcms,
            platform,
        });
        new Referee({
            modules: [
                refereeButtons({
                    badLiftButton: 6,
                    board: refBox,
                    goodLiftButton: 7,
                }),
                refereeBuzzer({
                    board: refBox,
                    piezo: 5,
                }),
            ],
            number: 2,
            owlcms,
            platform,
        });
        new Referee({
            modules: [
                refereeButtons({
                    badLiftButton: 9,
                    board: refBox,
                    goodLiftButton: 10,
                }),
                refereeBuzzer({
                    board: refBox,
                    piezo: 7,
                }),
            ],
            number: 3,
            owlcms,
            platform,
        });
    } catch (error) {
        console.error(error);
        process.exitCode = 1;

        owlcms.disconnect();
    }
})();
