import { FunctionalError } from '@Voikyrioh/observability'
import { zValidator } from '@hono/zod-validator'
import type { ValidationTargets } from 'hono'
import type { z } from 'zod'

/**
 * Endpoint input validator. On failure it throws a FunctionalError (never lets a
 * ZodError escape), so the front receives `invalid-payload` + per-field details,
 * and any raw ZodError reaching the handler is treated as a domain error.
 */
export function betterZodValidator<
	T extends z.ZodSchema,
	Target extends keyof ValidationTargets,
>(target: Target, schema: T) {
	return zValidator(target, schema, (result) => {
		if (!result.success) {
			const details = result.error.issues.map((issue) => ({
				field: issue.path.join('.'),
				code: issue.code,
				message: issue.message,
			}))
			throw new FunctionalError('invalid-payload', 'Bad request', details)
		}
	})
}
