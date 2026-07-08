// ⚠️ Premier import : patch OTel avant tout module applicatif (db/http/fetch)
import './instrumentation'
import process from 'node:process'
import config from '@config'
import { type ServerType, serve } from '@hono/node-server'
import { Logger } from '@Voikyrioh/observability'
import app from './entry-points/app'

let index: ServerType
function graceFullStart() {
	return serve(
		{
			fetch: app.fetch,
			hostname: config.Server.Host,
			port: config.Server.Port,
		},
		(info) => {
			Logger.info('======== Server started ========')
			Logger.info(
				`Server is running on http://${info.address}${info.port ? `:${info.port}` : ''}`,
			)
			Logger.info(`================================`)
		},
	)
}

function graceFullStop(errorCode: number) {
	index?.close((err) => {
		console.log(err)
		Logger.info('======== Server stopped ========')
		process.exit(errorCode)
	})
}
index = graceFullStart()
process.on('SIGINT', graceFullStop)
