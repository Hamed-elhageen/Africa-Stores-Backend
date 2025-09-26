import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const resp = exception.getResponse();
            if (typeof resp === 'object' && resp !== null && 'data' in resp) {
                return res.status(status).json(resp);
            }
            const message = typeof resp === 'object' && resp !== null && 'message' in resp ? (resp as any).message : exception.message;
            return res.status(status).json({ data: {}, message, type: 'error', code: status, showToast: true });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            data: {},
            message: 'Internal server error',
            type: 'error',
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            showToast: false,
        });
    }
}