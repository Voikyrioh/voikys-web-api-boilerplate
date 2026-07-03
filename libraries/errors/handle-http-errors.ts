import { AppError, DomainError } from '@errors/app.error'
import { ErrorsCodes } from '@errors/http.error'
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { ZodError } from 'zod'

/** Generic (front-safe) messages for the hidden families. */
const GENERIC: Record<'domain' | 'service', string> = {
	domain: ErrorsCodes.INTERNAL_SERVER_ERROR,
	service: ErrorsCodes.BAD_GATEWAY,
}

/**
 * Centralised error handler. Only functional errors relay their code + message
 * (+ validation details) to the front; domain (500) and service (502) answer a
 * generic message. A ZodError reaching here is not endpoint validation (that is
 * converted to a FunctionalError by betterZodValidator) but an internal parse
 * (entity) → domain. Anything unclassified is wrapped as a domain error.
 */
export function handleHttpErrors(error: unknown, c: Context) {
	if (error instanceof AppError) {
		if (error.family === 'functional') {
			return c.json(
				{
					code: error.code,
					message: error.message,
					...(error.details !== undefined ? { details: error.details } : {}),
				},
				error.httpCode as ContentfulStatusCode,
			)
		}
		return c.json(
			{ message: GENERIC[error.family as 'domain' | 'service'] },
			error.httpCode as ContentfulStatusCode,
		)
	}

	if (error instanceof ZodError) {
		const domain = new DomainError('Unexpected schema violation', error)
		return c.json(
			{ message: GENERIC.domain },
			domain.httpCode as ContentfulStatusCode,
		)
	}

	const unknown = new DomainError('Unhandled error', error)
	return c.json(
		{ message: GENERIC.domain },
		unknown.httpCode as ContentfulStatusCode,
	)
}
