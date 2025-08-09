import type { HttpError } from '@errors/http.error'
import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Custom-made Security base class used to add security to a Router.
 */
export abstract class BaseSecurity {
    #securityName: string = 'BaseSecurity';
    protected constructor(name: string) {
        this.#securityName = name;
        if (!this.#securityName) throw new Error('Security name not defined')
        if (!this.#securityName.trim()) throw new Error('Security name cannot be empty')
        if (this.#securityName === 'BaseSecurity') throw new Error('Security name cannot be BaseSecurity')
    }

    get securityName(): string {
        return this.#securityName;
    }

    abstract securityFn(request: FastifyRequest, reply: FastifyReply): Promise<HttpError|null>
}
