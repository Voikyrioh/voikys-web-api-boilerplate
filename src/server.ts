import Config from '@config'
import { handleErrors } from '@errors/handle-errors'
import { HttpError } from "@errors/http.error"
import Fastify, { type FastifyInstance } from 'fastify'
import { loggerOptions } from '../libraries/logger/source/logger'

class Server {
    #app: FastifyInstance;

    constructor() {
        this.#app = Fastify({
            logger: loggerOptions,
        });

        this.#app.get('/', async (request, reply) => {
            throw new HttpError(400, 'Test error');
        })
    }

    async start() {
        try {
            await this.#app.listen({ port: Config.Server.Port})
        } catch (err) {
            handleErrors(err as Error)
            process.exit(1)
        }
    }

    async stop() {
        await this.#app.close()
    }
}
const server = new Server();


export default server;
