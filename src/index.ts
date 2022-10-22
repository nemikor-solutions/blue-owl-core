import Controller from './controller';
import Owlcms from './owlcms';
import parseConfig from './config';

(async () => {
    const { platform, referees, url } = parseConfig();
    const owlcms = new Owlcms({
        url,
    });

    try {
        await owlcms.connect();

        const controller = new Controller({
            owlcms,
            platform,
            referees,
        });
        await controller.connect();
    } catch (error) {
        console.error(error);
        process.exitCode = 1;

        owlcms.disconnect();
    }
})();
