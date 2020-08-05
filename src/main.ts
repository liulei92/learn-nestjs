/*
 * @Description: 
 * @Date: 2020-08-05 17:44:29
 * @Author: LeiLiu
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { TransformInterceptor } from './interceptors/transform.interceptor';
// import { Logger } from './middlewares/test.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter()); // `useGlobalFilters()`方法不为网关或混合应用程序设置过滤器
  // 全局注册拦截器
  // app.useGlobalInterceptors(new TransformInterceptor());
  // 全局使用中间件
  // app.use(Logger);
  await app.listen(3000);
}
bootstrap();
