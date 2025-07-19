import { customZod } from '../../../libraries/custom-zod-types'

export default {
    Port: {
        name: 'PORT',
        description: 'Port to run the server',
        default: {
            _: 3000,
        },
        validator: customZod.application.port,
    },
}
