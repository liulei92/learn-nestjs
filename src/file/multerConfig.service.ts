import { Injectable, BadRequestException } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import * as dayjs from 'dayjs';
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

/**
 * 上传的文件配置服务
 */
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      // dest: './uploadFile',
      fileFilter(req: Request, file: BufferedFile, cb: (error: Error, acceptFile: boolean) => void): void {
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
        // if (temp === 'other') {
        //   return cb(new BadRequestException('文件格式错误！'), false);
        // }

        // 需要调用回调函数 `cb`，
        // 并在第二个参数中传入一个布尔值，用于指示文件是否可接受
        // 如果要拒绝文件，上传则传入 `false`。如:
        // cb(null, false);
        // 如果接受上传文件，则传入 `true`。如:
        cb(null, true);
        // 出错后，可以在第一个参数中传入一个错误：
        // cb(new Error('I don\'t have a clue!'));
        // console.log(file.filename);
        // cb(null, false);
      },
      storage : diskStorage({
        // 配置文件上传后的文件夹路径
        destination: (req, file, cb) => {
          console.log(req.body)
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
          // 在此处自定义保存后的文件名称
          const fileType = file.originalname.split('.');
          const filename = `${nuid.next()}.${fileType[fileType.length - 1]}`;
          return cb(null, filename);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 1024 // 1gb
      }
    };
  }
}