import type { FastifyInstance } from 'fastify'
import { z } from 'zod/v4'
import { Router } from '../class/router'
import { BearerToken } from '../class/security/bearer-token'

/**
 * Example of custom router implementation
 */
export default (instance: FastifyInstance) => {
    new Router(instance, '/route-example')
        .addSecurity(new BearerToken('token'))
        .createRoute<null, {status: string}>(
            'get',
            '',
            null,
            async () => { return { status: 'ok' } }
        )
        .createRoute<{myName: string}, string>(
            'post',
            '',
            z.object({myName: z.string()}),
            async (request) => { return `your name is ${request.body.myName}` }
        )
}
