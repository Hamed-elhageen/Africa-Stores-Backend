import { CallHandler, ExecutionContext, HttpException, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                // if (error instanceof HttpException) {
                //     throw error;
                // }
                //  console.error('[ErrorHandlerInterceptor]', {
                //     message: error.message,
                //     stack: error.stack,
                // });
                return throwError(()=> error)
            })
        )
    }
}