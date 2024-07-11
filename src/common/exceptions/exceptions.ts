import { HttpException, HttpStatus } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

/**
 * Represents a custom exception that is thrown when a client request is malformed or invalid.
 * Extends the HttpException class from the '@nestjs/common' module.
 */
export class BadRequestException extends HttpException {
    constructor(message: string, error: string) {
        super({ message, error }, HttpStatus.BAD_REQUEST);
    }
}

/**
 * Represents a custom exception that is thrown when a requested resource could not be found.
 * Extends the HttpException class from the '@nestjs/common' module.
 */
export class NotFoundException extends HttpException {
    constructor(message: string, error: string) {
        super({ message, error }, HttpStatus.NOT_FOUND);
    }
}

/**
 * Represents a custom exception that is thrown when a user could not be found.
 * Extends the UnauthorizedException class from the '@nestjs/common' module.
 */
export class UserNotFoundException extends UnauthorizedException {
    constructor(message = 'User not found', error?: string) {
        super(message, error);
    }
}

export class AdminNotFoundException extends UnauthorizedException {
    constructor(message = 'Admin not found', error?: string) {
        super(message, error);
    }
}

/**
 * Represents a custom exception that is thrown when a password is invalid.
 * Extends the UnauthorizedException class from the '@nestjs/common' module.
 */
export class InvalidPasswordException extends UnauthorizedException {
    constructor(message = 'Invalid password', error?: string) {
        super(message, error);
    }
}

/**
 * Represents a custom exception that is thrown when a validation fails.
 * Extends the BadRequestException class.
 */
export class ValidationFailedException extends BadRequestException {
    constructor(message = 'Validation failed', error?: string) {
        super(message, error);
    }
}

/**
 * Represents a custom exception that is thrown when a client tries to access a resource they do not have access to.
 * Extends the HttpException class from the '@nestjs/common' module.
 */
export class ForbiddenException extends HttpException {
    constructor(message: string, error?: string) {
        super({ message, error }, HttpStatus.FORBIDDEN);
    }
}

/**
 * Represents a custom exception that is thrown when a request could not be completed
 * due to a conflict with the current state of the target resource.
 * Extends the HttpException class from the '@nestjs/common' module.
 */
export class ConflictException extends HttpException {
    constructor(message: string, error: string) {
        super({ message, error }, HttpStatus.CONFLICT);
    }
}

/**
 * Represents a custom exception that is thrown when the server understands the content type
 * of the request entity, and the syntax of the request entity is correct, but it was unable
 * to process the contained instructions.
 * Extends the HttpException class from the '@nestjs/common' module.
 */
export class UnprocessableEntityException extends HttpException {
    constructor(message: string, error: string) {
        super({ message, error }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}

/**
 * Represents a custom exception that is thrown when a user has sent too many requests
 * in a given amount of time ("rate limiting").
 * Extends the HttpException class from the '@nestjs/common' module.
 */
export class TooManyRequestsException extends HttpException {
    constructor(message: string, error: string) {
        super({ message, error }, HttpStatus.TOO_MANY_REQUESTS);
    }
}

/**
 * Represents a custom exception that is thrown when the server is not ready to handle the request.
 * Extends the HttpException class from the '@nestjs/common' module.
 */
export class ServiceUnavailableException extends HttpException {
    constructor(message: string, error: string) {
        super({ message, error }, HttpStatus.SERVICE_UNAVAILABLE);
    }
}

/**
 * Represents a custom exception that is thrown when the server, while acting as a gateway or proxy,
 * did not receive a timely response from an upstream server it needed to access in order to complete the request.
 * Extends the HttpException class from the '@nestjs/common' module.
 */
export class GatewayTimeoutException extends HttpException {
    constructor(message: string, error: string) {
        super({ message, error }, HttpStatus.GATEWAY_TIMEOUT);
    }
}
