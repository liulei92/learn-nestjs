import { Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service';


@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  findAll(): string {
    return 'this is upload file'
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async UploadedFile(@UploadedFile() file) {
    return file;
  }
}
