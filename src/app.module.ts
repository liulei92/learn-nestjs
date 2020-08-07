import { resolve } from 'path';
import { Module, NestModule, RequestMethod ,MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { CatsController } from './cats/cats.controller';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';

import { DogsModule } from './dogs/dogs.module'; // 特征模块
import { PandasModule } from './pandas/pandas.module'; // 

import { UtilsModule } from './common/utils/utils.module' // global 全局模块（提供全局service，其余模块不需要单独imports）
// import { UploadModule } from './common/upload/upload.module';
import { FileModule } from './file/file.module'

import { LoggerMiddleware, Logger } from './middlewares/test.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: process.env.STATIC_PATH || resolve(__dirname, '../public'),
      exclude: ['/api*', '/fileUpload/**/*'],
    }),
    UtilsModule,
    DogsModule,
    PandasModule,
    FileModule
  ],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService],
})
export class AppModule implements NestModule {
  // MiddlewareConsumer是一个辅助类
  configure(comsumer: MiddlewareConsumer): void {
    comsumer
      .apply(LoggerMiddleware, Logger) // 多中间件
      // 排除
      // .exclude(
      //   { path: 'cats', method: RequestMethod.GET },
      //   { path: 'cats', method: RequestMethod.POST }
      // )
      // .forRoutes('*') // 对所有的路由生效
      // .forRoutes('cats') // 对cats生效
      .forRoutes({
        path: 'cats', method: RequestMethod.GET
      },
      {
        path: 'dogs/*', method: RequestMethod.GET
      })
  }
}
