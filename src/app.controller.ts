import { Controller, Get, Post, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { AppService } from './app.service';
import multer = require('multer');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 单个文件上传
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file')) // file 字段名
  // uploadFile(@UploadedFile() file: any): void {
  //   console.log(file);
  //   fs.writeFileSync('./hah.jpg', file.buffer); // 写入文件
  // }

  // 单个文件上传 通过拦截器写入
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './fileUpload'); // 写入文件
      },
      filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname);
        // 有问题
        // if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        //   cb(null, file.originalname);
        // } else {
        //   cb(null)
        // }
      }
    })
  }))
  async uploadFile(@UploadedFile() file: any): Promise<any> {
    console.log(file);
    return file;
  }

  // 上传多个文件
  @Post('uploadMulti')
  @UseInterceptors(FilesInterceptor('file'))
  uploadMulti(@UploadedFiles() file) {
    console.log(file);
  }


  // 自定义不同的字段名称键
  @Post('uploadMulti1')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 },
    // 携带其他参数
    { name: 'avatar_name'},
    { name: 'background_name'}
  ]))
  uploadMulti1(@UploadedFiles() files) {
    console.log(files);
  }

  // 上传文件使用任意的字段名称
  @Post('upload5')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFileAny(@UploadedFiles() files) {
    console.log(files);
  }

  // 上传需要判断 file 是否存在
}
