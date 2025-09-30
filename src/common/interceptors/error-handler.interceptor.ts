import { CallHandler, ExecutionContext, HttpException, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { catchError, Observable } from "rxjs";

@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                if (error instanceof HttpException) {
                    throw error;
                }
                // console.log(error)
                throw new InternalServerErrorException({
                    data: null,
                    message: error.message,
                    stack: error.stack,
                    type: false,
                    code: error.status,
                    showToast: true
                })
            })
        )
    }
}