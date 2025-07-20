import Logger from '@logger'
import type { FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify'
import type { RouteShorthandOptions } from 'fastify/types/route'
import type { ZodError, ZodType } from 'zod/v4'
import type { BaseSecurity } from './security/base-security'

const bodylessMethod = ['delete', 'get']
export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'
type CustomRequest<B> = FastifyRequest<{Body: B}>
type RouteHandler<B, R> = (request: CustomRequest<B>, reply: FastifyReply) => Promise<R> | R

/**
 * Custom router for simplification of a global route integration with shared security
 */
export class Router {
    #baseUrl: string
    #fastifyInstance: FastifyInstance

    constructor(fastifyInstance: FastifyInstance, baseUrl: string) {
        this.#baseUrl = this.#formatBaseUrl(baseUrl)
        this.#fastifyInstance = fastifyInstance
    }

    #formatBaseUrl(value: string): string {
        let base = value.trim()
        if (base.endsWith('/')) base = base.slice(0, -1)
        if (!base.startsWith('/')) base = `/${base}`
        return base
    }

    createRoute<Body, Resp>(method: Method, path: string, bodyValidationSchema: ZodType<Body>|null, handler: RouteHandler<Body, Resp>): Router {
        const ops: RouteShorthandOptions = {};
        if (bodyValidationSchema && !bodylessMethod.includes(method)) ops.preValidation = (request, _, done) => {
            try {
                request.body = bodyValidationSchema.parse(request.body)
                done()
            } catch (e) {
                done(e as ZodError)
            }
        }

        this.#fastifyInstance[method](`${this.#baseUrl}/${path}`, ops, handler as RouteHandlerMethod)
        return this
    }

    addSecurity(security: BaseSecurity): Router {
        this.#fastifyInstance.addHook('preHandler', (request, reply, done) => {
            security.securityFn(request, reply).then((value) => {
                if (value) {
                    Logger.warn(`Rejected request [${request.method} - ${request.originalUrl}]  with security ${security.securityName}. rejected message : ${value.message}`)
                    reply.status(value.status).send({ message: value.message, context: value.context })
                }
                else done()
            })

        })
        return this;
    }
}
