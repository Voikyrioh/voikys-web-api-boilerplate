import {AnyLogger, LoggerLevel} from "@logger";
import {handleErrors} from "./handle-errors";

class Logger<T extends AnyLogger> {
    #logger: AnyLogger;
    constructor(logger: T) {
        this.#logger = logger;
    }

    log(level: LoggerLevel, message: string): void {
        this.#logger[level]("[CUSTOM LOGGER] - " + message);
    }

    handleError(error: Error): void {
        this.#logger.error(handleErrors(error));
    }
}

const logger = new Logger(console);

export default logger;
