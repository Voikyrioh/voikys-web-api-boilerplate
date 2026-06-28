import { inspect } from 'node:util'
import { AppError } from '@errors/app.error'
import { ErrorsCodes, HttpCodes } from '@errors/http.error'
import Logger from '@logger'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { ZodError } from 'zod/v4'

/**
 * Centralised error handler. Always responds with a JSON body
 * `{ message, cause? }` so the frontend can parse it consistently.
 */
export function handleHttpErrors(error: unknown, c: Context) {
	if (error instanceof ZodError) {
		return c.json(
			{ message: ErrorsCodes.BAD_REQUEST, cause: error.issues },
			HttpCodes.BAD_REQUEST as ContentfulStatusCode,
		)
	}

	if (error instanceof AppError) {
		return c.json(
			{ message: error.message },
			error.toHttpCode() as ContentfulStatusCode,
		)
	}

	if (error instanceof HTTPException) {
		return c.json(
			{ message: error.message },
			error.status as ContentfulStatusCode,
		)
	}

	Logger.error(`Unhandled error : ${inspect(error)}`)
	return c.json(
		{ message: ErrorsCodes.INTERNAL_SERVER_ERROR },
		HttpCodes.INTERNAL_SERVER_ERROR as ContentfulStatusCode,
	)
}
