import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CatsController } from './cats/cats.controller';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';

import { DogsModule } from './dogs/dogs.module'; // 特征模块
import { PandasModule } from './pandas/pandas.module'; // 

import { UtilsModule } from './common/utils/utils.module' // global 全局模块（提供全局service，其余模块不需要单独imports）

@Module({
  imports: [UtilsModule, DogsModule, PandasModule],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService],
})
export class AppModule {}
