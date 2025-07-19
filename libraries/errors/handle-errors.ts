import Logger from '@logger'
import { inspect } from 'node:util'

export function handleErrors(error: Error) {
    return Logger.error(`Unhandled error : ${inspect(error)}`);
}
