import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // console.log(exception);

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: ctx.getRequest().url,
            message:
                exception instanceof HttpException
                    ? this.formatMessage((exception.getResponse() as { message: string }).message || null)
                    : 'Internal Server Error',
            error:
                exception instanceof HttpException
                    ? this.formatMessage((exception.getResponse() as { error: string }).error || null)
                    : 'Internal Server Error' ,
            data: null,
        };
        // console.log(typeof errorResponse.message)
        ctx.getResponse().status(status).send(errorResponse);
    }

    private formatMessage(message: string | string[]): string {
        if (Array.isArray(message)) {
            return message.join(', ');
        }
        return message;
    }
}
