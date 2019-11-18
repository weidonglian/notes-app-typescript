export enum HttpStatusCode {
    Success = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
    ServiceUnavailable = 503
}

export abstract class HttpClientError extends Error {
    readonly statusCode!: number
    readonly name!: string

    constructor(message: object | string) {
        if (message instanceof Object) {
            super(JSON.stringify(message))
        } else {
            super(message)
        }
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class HttpErrorBadRequest extends HttpClientError {
    readonly statusCode = HttpStatusCode.BadRequest

    constructor(message: string | object = 'Bad Request') {
        super(message)
    }
}

export class HttpErrorUnauthorized extends HttpClientError {
    readonly statusCode = HttpStatusCode.Unauthorized

    constructor(message: string | object = 'Unauthorized') {
        super(message)
    }
}

export class HttpErrorForbidden extends HttpClientError {
    readonly statusCode = HttpStatusCode.Forbidden

    constructor(message: string | object = 'Forbidden') {
        super(message)
    }
}

export class HttpErrorNotFound extends HttpClientError {
    readonly statusCode = HttpStatusCode.NotFound

    constructor(message: string | object = 'Not found') {
        super(message)
    }
}
