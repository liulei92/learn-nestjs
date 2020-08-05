import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import dayjs = require('dayjs');
import { diskStorage } from 'multer';
import * as nuid from 'nuid';
@Module({
  imports:[
    MulterModule.register({
      storage: diskStorage({
        //自定义路径
        destination: `./fileUpload/${dayjs().format('YYYY-MM-DD')}`,
        filename: (req, file, cb) => {
          // 自定义文件名
          const filename = `${nuid.next()}.${file.mimetype.split('/')[1]}`;
          return cb(null, filename);
          // return  cb(null, file.originalname);
        },
      }),
    }),

  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}

// nest js 上传文件
// https://www.jianshu.com/p/28f8dd9a732e

// 记录一次实现NestJs文件上传存储 包含service
// https://blog.csdn.net/weixin_44273392/article/details/100153051?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase
// https://www.itying.com/nestjs/start-upload.html

// nestjs 文件上传 包含service
// https://www.urcloud.co/archives/13/