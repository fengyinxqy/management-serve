import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message;

    Logger.log('错误提示', message);
    const errorResponse = {
      code: status,
      message,
      url: request.originalUrl,
      timestamp: new Date().toISOString(),
    };

    // 设置返回的状态码、请求头、发送错误信息
    response.status(status).json(errorResponse);
  }
}
