import { handleHttpErrors, otelHono } from '@Voikyrioh/observability'
import config from '@config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import exempleRoute from './routes/example-route'

const app = new Hono().basePath('/api/v1')

// Premier middleware : span serveur par requête (SigNoz) + traceparent W3C
app.use(otelHono())
app.use(cors({ origin: config.Server.ClientUrls, credentials: true }))
app.onError(handleHttpErrors)

app.route('/', exempleRoute)

export default app
