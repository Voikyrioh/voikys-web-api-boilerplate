import pino, { type LoggerOptions } from "pino"

export const loggerOptions: LoggerOptions = {
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            include: 'level,time',
            levelKey: 'level'
        }
    },
}
const logger = pino(loggerOptions)

export default logger
