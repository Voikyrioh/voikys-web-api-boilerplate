import { inspect } from 'node:util'
import { ErrorsCodes, HttpCodes, HttpError } from '@errors/http.error'
import Logger from '@logger'
import { ZodError } from 'zod/v4'

export function handleHttpErrors(error: unknown): HttpError {
    if (error instanceof Error) {
        if (error instanceof HttpError) return error
        if (error instanceof ZodError) return new HttpError(HttpCodes.BAD_REQUEST,  ErrorsCodes.BAD_REQUEST, error.issues)
        if (error.name === 'AppError' ) return new HttpError(HttpCodes.INTERNAL_SERVER_ERROR,  ErrorsCodes.INTERNAL_SERVER_ERROR, {error: error.message})
        Logger.error(`Unhandled error : ${inspect(error)}`)
        return new HttpError(HttpCodes.INTERNAL_SERVER_ERROR,  ErrorsCodes.INTERNAL_SERVER_ERROR)
    }
    Logger.error(`Unknown error : ${inspect(error)}`)
    return new HttpError(HttpCodes.INTERNAL_SERVER_ERROR,  ErrorsCodes.UNKNOWN_ERROR)
}
