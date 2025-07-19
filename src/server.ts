import { inspect } from 'node:util'
import Config from '@config'
import { handleHttpErrors } from '@errors/handle-http-errors'
import Logger from '@logger'
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { loggerOptions } from '../libraries/logger/source/logger'

function handleErrorMiddleware(error: unknown, _: FastifyRequest, reply: FastifyReply) {
    const [status, response] = handleHttpErrors(error).toResponse();
    reply.status(status).send(response);
}

class Server {
    #app: FastifyInstance;

    constructor() {
        this.#app = Fastify({
            logger: {
                ...loggerOptions,
            },
            disableRequestLogging: true,
        });
        this.#app.setErrorHandler(handleErrorMiddleware)

        this.#app.get('/', async () => {
            return { hello: 'world' }
        })
        this.#app.get('/err', async () => {
            return z.number().parse('a')
        })
    }

    async start() {
        try {
            await this.#app.listen({ port: Config.Server.Port})
        } catch (err) {
            Logger.fatal(`Unhandled fatal error : ${inspect(err)}`)
            process.exit(1)
        }
    }

    async stop() {
        await this.#app.close()
    }
}
const server = new Server();


export default server;
