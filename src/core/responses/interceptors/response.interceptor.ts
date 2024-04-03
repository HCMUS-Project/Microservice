import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Response} from 'src/common/interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept (context: ExecutionContext, next: CallHandler): Observable<Response<T>>
    {

        return next.handle().pipe(
            map(data =>
            {
                // console.log(context);
                // console.log(data)
                return {
                    statusCode: data.status || context.switchToHttp().getResponse().statusCode,
                    // statusCode: 200,
                    message: data.message || '',
                    data: data,
                };
            }),

        );
    }
}
