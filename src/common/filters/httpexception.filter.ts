import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
@Catch()
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const message = exception.message;
        response.status(status).json({
            success:false,
            statusCode: status,
            message,
            path:request.url,
        })
    }
}