/*
 * @Description: 
 * @Date: 2020-08-05 17:44:29
 * @Author: LeiLiu
 */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
// import { Logger } from './middlewares/test.middleware';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(); // 跨域
  // 静态文件暴露
  app.useStaticAssets(join(__dirname, '..', 'fileUpload'), {
    prefix: '/fileUpload/',
  });
  // 全局超时拦截器
  app.useGlobalInterceptors(new TimeoutInterceptor());
  // 全局注册错误的过滤器
  // app.useGlobalFilters(new HttpExceptionFilter()); // `useGlobalFilters()`方法不为网关或混合应用程序设置过滤器
  // 全局注册拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局使用中间件
  // app.use(Logger);
  await app.listen(3000);
}
bootstrap();
