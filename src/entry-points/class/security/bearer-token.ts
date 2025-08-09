import { ErrorsCodes, HttpCodes, HttpError } from '@errors/http.error'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { BaseSecurity } from './base-security'

/**
 * Example of my custom-made Security implementation for a basic Bearer Token in accordance with RFC n°6750
 */
export class BearerToken extends BaseSecurity {
    #validToken: string | string[];
    constructor(token: string | string[]) {
        super('BearerToken')
        this.#validToken = token;
    }

    async securityFn(request: FastifyRequest, reply: FastifyReply): Promise<HttpError|null> {
        const requestAuthorization = request.headers.authorization
        if (!requestAuthorization) {
            reply.header('WWW-Authenticate', `Bearer realm="${this.securityName}, error="invalid_request", error_description="Missing authorization header"`)
            return new HttpError(HttpCodes.BAD_REQUEST, ErrorsCodes.BAD_REQUEST, {error: 'Missing authorization header'})
        }
        const [type, token] = requestAuthorization.split(' ')

        if (type === 'Bearer' && token) {
            if (typeof this.#validToken === 'string' && token === this.#validToken) {
                return null
            } else if (Array.isArray(this.#validToken) && this.#validToken.includes(token)) {
                return null
            } else {
                reply.header('WWW-Authenticate', `Bearer realm="${this.securityName}, error="invalid_token", error_description="Missing authorization header"`)
                return new HttpError(HttpCodes.UNAUTHORIZED, ErrorsCodes.UNAUTHORIZED, {error: 'Invalid token'});
            }
        }

        reply.header('WWW-Authenticate', `Bearer realm="${this.securityName}, error="invalid_request", error_description="Invalid authorization header"`)
        return new HttpError(HttpCodes.BAD_REQUEST, ErrorsCodes.BAD_REQUEST, {error: 'Invalid authorization header'});
    }

}
