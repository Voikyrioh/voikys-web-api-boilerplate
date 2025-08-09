export enum HttpCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

export enum ErrorsCodes {
    BAD_REQUEST = 'Bad request',
    UNAUTHORIZED = 'Unauthorized',
    FORBIDDEN = 'Forbidden',
    NOT_FOUND = 'Not found',
    METHOD_NOT_ALLOWED = 'Method not allowed',
    CONFLICT = 'Conflict',
    INTERNAL_SERVER_ERROR = 'Internal server error',
    UNKNOWN_ERROR = 'Unknown error',
    NOT_IMPLEMENTED = 'Not implemented',
    BAD_GATEWAY = 'Bad gateway',
    SERVICE_UNAVAILABLE = 'Service unavailable',
}

interface Response {
    message: string
    context?: Record<string, any>
}

export class HttpError extends Error {
    name = 'HttpError';
    status: HttpCodes;
    context: Record<string, any> | undefined;
    type: string = 'HttpError';

    constructor(status: HttpCodes, message: ErrorsCodes, context?: Record<string, any>) {
        super(message);
        this.status = status;
        this.context = context;
    }

    toResponse(): [HttpCodes, Response] {
        const response: Response = { message: this.message }
        if (this.context) {
            response.context = this.context;
        }

        return [this.status, response];
    }
}
