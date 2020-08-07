/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors, HttpException, HttpStatus, Res, Param, Query, BadRequestException, Req } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { FileService } from './file.service';
import * as fs from 'fs';
import * as path from 'path';
import * as formidable from 'formidable';

const w = fs.createWriteStream('./test123');
const targetDir = path.join(__dirname, '../../fileUpload');
// 检查目标目录，不存在则创建
fs.access(targetDir, function(err){
  if(err){
    fs.mkdirSync(targetDir);
  }
});

export interface IFile {
  /** Field name specified in the form */
  fieldname: string;
  /** Name of the file on the user's computer */
  originalname: string;
  /** Encoding type of the file */
  encoding: string;
  /** Mime type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size: number;
  /** The folder to which the file has been saved (DiskStorage) */
  destination: string;
  /** The name of the file within the destination (DiskStorage) */
  filename: string;
  /** Location of the uploaded file (DiskStorage) */
  path: string;
  /** A Buffer of the entire file (MemoryStorage) */
  buffer: Buffer;
}

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  findAll(): string {
    return 'this is upload file'
  }

  @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  async UploadedFile(@Req() req, @UploadedFile() file: IFile): Promise<any> {
    console.log(file)
    if (file) {
      if (file.path) {
        file.path = file.path.replace(/\\/g, '/'); // 转换正反斜线，转换结果如： `"path": "public/uploads/image/2020-04-08/V0QYQ0VN3GH6ASHXCGC901.jpg",` 
      }
      return file;
    } else {

      throw new HttpException('请选择文件', HttpStatus.BAD_REQUEST)
    }
  }

  @Post('test')
  async uploadTest(@Req() req: Request, @Res() res: Response) {
    // https://www.npmjs.com/package/formidable
    const form = new formidable({ multiples: true, uploadDir: __dirname, maxFieldsSize: 20000* 1024 * 1024 });
    // form.onPart = part => {
    //   console.log(part)
    //   part.on('data', function(buffer) {
    //     console.log(buffer)
    //     // self._fileSize += buffer.length;
    //     // if (self._fileSize > self.maxFileSize) {
    //     //   self._error(new Error('maxFileSize exceeded, received '+self._fileSize+' bytes of file data'));
    //     //   return;
    //     // }
    //     // if (buffer.length == 0) {
    //     //   return;
    //     // }
    //     form.pause();
        // w.write(buffer, function() {
        //   form.resume();
        // });
    //   });
    // }


    form.handlePart = part => {
      part.on('data', (buffer) => {
        // do whatever you want here
        console.log(buffer)
        form.pause();
        w.write(buffer, function() {
          form.resume();
        });
      });
    }

    form.parse(req, (err, fields, files) => {
      // console.log(err, fields, files)
      console.log(err)
      if (err) throw err;
  	  const filesUrl = [];
  	  let errCount = 0;
      const keys = Object.keys(files);
      console.log(keys)
      keys.forEach(function(key){
        const extname = path.extname(files[key].name); // 获取文件的扩展名
        if (('.jpg.jpeg.png.gif').indexOf(extname.toLowerCase()) === -1) {
        	errCount += 1;
        } else {
        	//以当前时间戳对上传文件进行重命名
            const fileName = new Date().getTime() + extname;
            const targetFile = path.join(targetDir, fileName);
            //移动文件
            fs.renameSync(files[key].path, targetFile);
            // 文件的Url（相对路径）
            filesUrl.push('/upload/'+fileName)
        }
      });

      // 返回上传信息
      res.json({fields, files, filesUrl: filesUrl, success: keys.length-errCount, error: errCount});
      
      // if (err) {
      //   next(err);
      //   return;
      // }
      // res.json({ fields, files });
    });

    // req.pipe(w)
  }

  // @Post('test')
  // @UseInterceptors(FileInterceptor('file'))
  // async test(@UploadedFile() file: IFile): Promise<any> {
  //   if (file) {
  //     return this.fileService.uploadProcess(file);
  //   } else {
  //     return '请选择文件'
  //   }
  // }

  @Get('download')
  async download(@Query() query: { temp: string, fileName: string }, @Res() res: Response): Promise<void | Response<any>> {
    const { temp, fileName } = query
    if (!temp || !fileName ) {
      // throw new BadRequestException('参数错误')
      return res.send({ msg: '参数错误' });
    }
    const fileUrl = path.resolve('./fileUpload', temp, fileName);
    if (!fs.existsSync(fileUrl)) {
      // throw new BadRequestException('参数错误')
      return res.send({ msg: '文件不存在' });
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.attachment(fileName);
    return res.sendFile(fileName, { root: 'fileUpload/' + temp })
  }

}
