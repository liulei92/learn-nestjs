import { Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service';

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
  @UseInterceptors(FileInterceptor('file'))
  async UploadedFile(@UploadedFile() file: IFile): Promise<any> {
    if (file) {
      if (file.path) {
        file.path = file.path.replace(/\\/g, '/'); // 转换正反斜线，转换结果如： `"path": "public/uploads/image/2020-04-08/V0QYQ0VN3GH6ASHXCGC901.jpg",` 
      }
      return file;
    } else {
      return '请选择文件'
    }
  }
}
