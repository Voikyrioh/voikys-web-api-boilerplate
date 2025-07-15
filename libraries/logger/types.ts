export enum LoggerLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

export type AnyLogger = {
    [key in LoggerLevel]: (message: string) => void;
};
