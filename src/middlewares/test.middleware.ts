import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
// 类组价
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log(req.url + ', Request...');
    next();
  }
}

// 函数组件
export function Logger(req: Request, res: Response, next: Function) {
  console.log(res.statusCode + ', Response...');
  next();
}