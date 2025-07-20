import { z } from 'zod/v4'
import { customZod } from '../../../libraries/custom-zod-types'

export default {
    Port: {
        name: 'PORT',
        description: 'Port to run the server',
        default: {
            _: 3000,
            production: 8080,
        },
        validator: customZod.application.port,
    },
    Host: {
        name: 'HOSTNAME',
        description: 'Who to listen to',
        default: {
            _: '127.0.0.1',
            production: '0.0.0.0',
        },
        validator: z.ipv4(),
    },
}
