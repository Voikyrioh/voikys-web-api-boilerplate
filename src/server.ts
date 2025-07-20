import { inspect } from 'node:util'
import Config from '@config'
import { handleHttpErrors } from '@errors/handle-http-errors'
import Logger from '@logger'
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { loggerOptions } from '../libraries/logger/source/logger'
import { exampleRoute } from './entry-points/routes'

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

        this.#app.register(exampleRoute, { prefix: '/api/v1' })
    }

    async start() {
        try {
           await this.#app.listen({ port: Config.Server.Port, host: Config.Server.Host })
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
