import { generateConfig } from './generate-config'
import ServerConfig from './params/server.config'

export default {
    Server: generateConfig<typeof ServerConfig>(ServerConfig)
}

