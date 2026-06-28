import { HttpCodes } from '@errors/http.error'

export type ErrorCodes =
	| 'no-data'
	| 'not-found'
	| 'invalid-payload'
	| 'unauthorized'
	| 'forbidden'
	| 'conflict'
	| 'gone'
	| 'rate-limited'
	| 'service-unavailable'
	| 'internal-server-error'

export class AppError extends Error {
	type: ErrorCodes

	constructor(type: ErrorCodes, message: string) {
		super(message)
		this.type = type
	}

	toHttpCode(): HttpCodes {
		switch (this.type) {
			case 'no-data':
				return HttpCodes.NO_CONTENT
			case 'not-found':
				return HttpCodes.NOT_FOUND
			case 'invalid-payload':
				return HttpCodes.BAD_REQUEST
			case 'unauthorized':
				return HttpCodes.UNAUTHORIZED
			case 'forbidden':
				return HttpCodes.FORBIDDEN
			case 'conflict':
				return HttpCodes.CONFLICT
			case 'gone':
				return HttpCodes.GONE
			case 'rate-limited':
				return HttpCodes.TOO_MANY_REQUESTS
			case 'service-unavailable':
				return HttpCodes.SERVICE_UNAVAILABLE
			default:
				return HttpCodes.INTERNAL_SERVER_ERROR
		}
	}
}
