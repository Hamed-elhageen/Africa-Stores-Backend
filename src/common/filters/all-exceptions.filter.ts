import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const resp = exception.getResponse();
            if (typeof resp === 'string') {
                message = resp;
            } else if (typeof resp === 'object' && resp !== null) {
                message = (resp as any).message ?? exception.message;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        return res.status(status).json({
            data: null,
            message,
            type: false, // keep consistent with your SuccessResponseInterceptor
            code: status,
            showToast: true,
        });
    }
}
