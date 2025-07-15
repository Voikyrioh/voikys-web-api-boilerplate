import {HttpCodes} from "fastify/types/utils";

export class HttpError extends Error {
    name = 'HttpError';
    status: HttpCodes;
    origin: Record<string, string> | undefined;

    constructor(status: HttpCodes, message: string, origin?: Record<string, string>) {
        super();
        this.status = status;
        this.origin = origin;
    }
}
