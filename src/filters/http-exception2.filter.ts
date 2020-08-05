import { HttpException, Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) // 捕获 某种类型，为空则捕获所有
export class HttpException2Filter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timeStamp: new Date().toISOString(),
        path: request.url
      })
  }
}
