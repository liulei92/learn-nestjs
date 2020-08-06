import { Module, BadRequestException } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import dayjs = require('dayjs');
import { diskStorage } from 'multer';
import * as nuid from 'nuid';
import * as fs from 'fs';

export const checkDirAndCreate = (filePath: string): void => {
  console.log(filePath)
  const pathArr = filePath.split('/');
  let checkPath = '.';
  let item: string;
  for (item of pathArr) {
    checkPath += `/${item}`;
    if (!fs.existsSync(checkPath)) {
      fs.mkdirSync(checkPath);
    }
  }
};

const image = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp'];
const video = ['flv', 'mp4', 'webm'];
const audio = ['mp3', 'wav', 'wave', 'ogg'];
// 其他

@Module({
  imports:[
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: (req, file, cb) => {
          console.log(file)
          // 根据上传的文件类型将图片视频音频和其他类型文件分别存到对应英文文件夹
          const mimeType = file.mimetype.split('/')[1];
          let temp = 'other';
          image.filter(item => item === mimeType).length > 0
            ? (temp = 'image')
            : '';
          video.filter(item => item === mimeType).length > 0
            ? (temp = 'video')
            : '';
          audio.filter(item => item === mimeType).length > 0
            ? (temp = 'audio')
            : '';
          const filePath = `fileUpload/${temp}/${dayjs().format(
            'YYYY-MM-DD',
          )}`;
          checkDirAndCreate(filePath); // 判断文件夹是否存在，不存在则自动生成
          return cb(null, `./${filePath}`);
        },
        filename: (req, file, cb) => {
          console.log(file)
          // 在此处自定义保存后的文件名称
          const fileType = file.originalname.split('.');
          const filename = `${nuid.next()}.${fileType[fileType.length - 1]}`;
          return cb(null, filename);
        },
      }), 
      fileFilter(req, file, cb) {
        console.log(file)
        const mimeType = file.mimetype.split('/')[1].toLowerCase();
        let temp = 'other';
        image.filter(item => item === mimeType).length > 0
          ? (temp = 'image')
          : '';
        video.filter(item => item === mimeType).length > 0
          ? (temp = 'video')
          : '';
        audio.filter(item => item === mimeType).length > 0
          ? (temp = 'audio')
          : '';
        console.log(temp)
        if (temp === 'other') {
          return cb(new BadRequestException('文件格式错误！'), false);
        }
        return cb(null, true);
      },
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