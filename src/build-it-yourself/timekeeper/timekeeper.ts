import runner from 'scripts/runner';
import Timekeeper from 'lib/model/timekeeper';
import timekeeperButtons from 'lib/model/timekeeper/buttons';

runner(({
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
});
