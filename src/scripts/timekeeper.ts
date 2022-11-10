import connectBoard from 'lib/board';
import Owlcms from 'lib/owlcms';
import parseConfig from 'scripts/config';
import Timekeeper from 'lib/model/timekeeper';
import timekeeperButtons from 'lib/model/timekeeper/buttons';

(async () => {
    const { mqttUrl: url, platform} = parseConfig();
    const owlcms = new Owlcms({
        url,
    });

    try {
        await owlcms.connect();

        const timekeeperBox = await connectBoard();

        new Timekeeper({
            modules: [
                timekeeperButtons({
                    board: timekeeperBox,
                    oneMinuteButton: 11,
                    startButton: 9,
                    stopButton: 10,
                    twoMinuteButton: 12,
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
