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

    // Default
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: any = {
      data: null,
      message: 'Internal server error',
      type: 'error',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      showToast: true,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    };

    // === Handle HttpExceptions (Validation, Conflict, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();

      if (typeof resp === 'object' && resp !== null) {
        const { statusCode, ...rest } = resp as any;
        responseBody.message = Array.isArray(rest.message)
          ? rest.message.join(', ')
          : rest.message || responseBody.message;

        Object.assign(responseBody, {
          ...rest,
          code: status,
        });
      } else {
        responseBody.message = resp;
        responseBody.code = status;
      }
    }

    // === Handle native JS errors
    else if (exception instanceof Error) {
      responseBody.message = exception.message || responseBody.message;
      responseBody.code = status;
    }

    // === Handle non-standard / unknown exceptions
    else {
      responseBody.message = String(exception);
      responseBody.code = status;
    }

    // Remove duplicate or unused keys
    delete responseBody.statusCode;

    return res.status(status).json(responseBody);
  }
}
