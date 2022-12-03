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
                oneMinuteButton: 11,
                oneMinuteButtonPullUp: true,
                startButton: 9,
                startButtonPullUp: true,
                stopButton: 10,
                stopButtonPullUp: true,
                twoMinuteButton: 12,
                twoMinuteButtonPullUp: true,
            }),
        ],
        owlcms,
        platform,
    });
});
