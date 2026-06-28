import config from '@config'
import pino, { type LoggerOptions } from 'pino'

const isProd = config.Server.Environment === 'production'

export const loggerOptions: LoggerOptions = isProd
	? {
			transport: {
				target: 'pino/file',
				options: { destination: config.Server.LogFile },
			},
		}
	: {
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
					// Hide the noisy default bindings (pid/hostname) but keep
					// custom structured log fields visible in dev.
					ignore: 'pid,hostname',
				},
			},
		}

const logger = pino(loggerOptions)
export default logger
