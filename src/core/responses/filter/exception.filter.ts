import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import {error} from 'console';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorMessage = (exception as HttpException).message;
        const errorObject = parseErrorMessage(errorMessage);

        // Modify the response body if errorObject is not null
        if (errorObject) {
            errorMessage = errorObject.error;
        }

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: ctx.getRequest().url,
            errorMessage: errorMessage,
        };

        ctx.getResponse().status(httpStatus).send(responseBody);
    }
}

function parseErrorMessage(errorMessage: string) {
    // Extracting the JSON part of the string
    const jsonStartIndex = errorMessage.indexOf('{');
    const jsonString = errorMessage.substring(jsonStartIndex);

    try {
        // Parsing the JSON string
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
}
