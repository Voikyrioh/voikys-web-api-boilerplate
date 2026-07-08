import { Hono } from 'hono'
import { z } from 'zod'
import { betterZodValidator } from '../../../libraries/custom-zod-types/validator'

const testSchema = z.object({ test: z.string() })

/**
 * Example of custom router implementation
 */
const exempleRoute = new Hono().basePath('exemple')

exempleRoute.get('test', async (c) => { return c.json({ status: 'ok' }) })
exempleRoute.post(
    'test',
    betterZodValidator('json', testSchema),
    async (c) => {
        return c.json(c.req.valid('json'))
    }
)

export default exempleRoute
