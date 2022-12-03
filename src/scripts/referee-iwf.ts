import connectBoard from 'lib/board';
import Owlcms from 'lib/owlcms';
import parseConfig from 'scripts/config';
import Referee from 'lib/model/referee';
import refereeButtons from 'lib/model/referee/buttons';
import refereeBuzzer from 'lib/model/referee/buzzer';
import refereeWarningLed from 'lib/model/referee/warning-led';

(async () => {
    const {
        mqttUsername,
        mqttUrl,
        mqttPassword,
        platform,
        serialPort,
    } = parseConfig();

    const owlcms = new Owlcms({
        mqttPassword,
        mqttUrl,
        mqttUsername,
    });

    try {
        await owlcms.connect();

        const refBox = await connectBoard({
            port: serialPort,
        });

        new Referee({
            modules: [
                refereeButtons({
                    badLiftButton: 3,
                    badLiftButtonPullUp: true,
                    board: refBox,
                    goodLiftButton: 4,
                    goodLiftButtonPullUp: true,
                }),
                refereeBuzzer({
                    board: refBox,
                    piezo: 2,
                }),
                refereeWarningLed({
                    board: refBox,
                    led: 'A0',
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
                    badLiftButtonPullUp: true,
                    board: refBox,
                    goodLiftButton: 7,
                    goodLiftButtonPullUp: true,
                }),
                refereeBuzzer({
                    board: refBox,
                    piezo: 5,
                }),
                refereeWarningLed({
                    board: refBox,
                    led: 'A1',
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
                    badLiftButtonPullUp: true,
                    board: refBox,
                    goodLiftButton: 10,
                    goodLiftButtonPullUp: true,
                }),
                refereeBuzzer({
                    board: refBox,
                    piezo: 8,
                }),
                refereeWarningLed({
                    board: refBox,
                    led: 'A2',
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

        // If the process does not exit cleanly within five seconds, force close
        setTimeout(() => {
            process.exit(2);
        }, 5000);
    }
})();
