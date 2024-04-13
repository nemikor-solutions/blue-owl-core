import createDebugger from 'debug';

export interface LogEventData {
    date: Date;
    message: string;
    name: string;
}

export type LogSubscriber = (data: LogEventData) => void;

export type Logger = (message: string) => void;

const loggers = new Map<string, Logger>();
const subscribers: LogSubscriber[] = [];

export function createLogger(name: string): Logger {
    if (loggers.has(name)) {
        return loggers.get(name) as Logger;
    }

    const debug = createDebugger(`blue-owl:${name}`);
    const logger = (message: string) => {
        const date = new Date();
        debug(message);

        subscribers.forEach((subscriber) => {
            subscriber({
                date,
                message,
                name,
            });
        });
    };

    loggers.set(name, debug);
    return logger;
}

export function onMessage(subscriber: LogSubscriber): void {
    subscribers.push(subscriber);
}
