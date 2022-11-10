import connectBoard from 'lib/board';
import Owlcms from 'lib/owlcms';
import parseConfig from 'scripts/config';
import Referee from 'lib/model/referee';
import refereeButtons from 'lib/model/referee/buttons';

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
