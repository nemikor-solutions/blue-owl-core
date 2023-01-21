import runner from '../../src/scripts/runner';
import Timekeeper from '../../src/lib/model/timekeeper';
import timekeeperButtons from '../../src/lib/model/timekeeper/buttons';
import type {
    Config,
} from '../../src/scripts/config';

export function doTimekeeper(conf?: Config) {
    runner(
        ({
            board,
            owlcms,
            platform,
        }) => {
            new Timekeeper({
                modules: [
                    timekeeperButtons({
                        board,
                        oneMinuteButton: 4,
                        oneMinuteButtonPullUp: true,
                        startButton: 6,
                        startButtonPullUp: true,
                        stopButton: 5,
                        stopButtonPullUp: true,
                        twoMinuteButton: 3,
                        twoMinuteButtonPullUp: true,
                    }),
                ],
                owlcms,
                platform,
            });
        },
        conf)
}
