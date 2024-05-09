import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'src/common/interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => {
                // console.log(data)
                const status = typeof data.status === 'string' ? context.switchToHttp().getResponse().statusCode : data.status;
                return {
                    // statusCode: data.status || context.switchToHttp().getResponse().statusCode,
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path: context.getArgs()[0].url,
                    // statusCode: 200,
                    message: data.message || null,
                    error: null,
                    data: data,
                };
            }),
        );
    }
}
