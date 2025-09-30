import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            // tap((data) => console.log(`before edit ${JSON.stringify(data)}}`)),
            map((data) => {
                return {
                    data: data?.data ?? data,
                    message: data?.message ?? 'Request successful',
                    type: true,
                    code: 200,
                    showToast: true,
                    stack: data?.stack
                };
            }),
            // tap((data) => console.log(`after edit ${JSON.stringify(data)}`)),
        );
    }
}
