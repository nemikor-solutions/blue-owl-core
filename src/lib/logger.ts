import createDebugger from 'debug';

export interface LogEventData {
    date: Date;
    message: string;
    name: string;
}

export type LogSubscriber = (data: LogEventData) => void;

export type Logger = (message: string) => void;

const subscribers: LogSubscriber[] = [];

export function createLogger(name: string): Logger {
    const debug = createDebugger(`blue-owl:${name}`);

    return (message: string) => {
        const date = new Date();
        debug(message);

        subscribers.forEach((subscriber) => {
            subscriber({
                date,
                message,
                name,
            });
        });
    }
}

export function onMessage(subscriber: LogSubscriber): void {
    subscribers.push(subscriber);
}
