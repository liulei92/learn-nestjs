import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { slugify } from 'transliteration'; // 音译(transliteration)模块，支持中文转拼音或生成 slug
import { Readable } from 'stream'; // 流 Readable：可读流 Writable：可写流
import hasha from 'hasha'; // 加密
import path from 'path';

const uploadDir = './fileUpload';

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

export interface IFileInFs {
  originName: string,
  fileName: string,
  fullPath: string,
  filePath: string,
  fileSize: number,
  fileMimetype: string,
  hashSum: string,
}

export interface IExecCommand {
  stdout: Buffer,
  stderr: Buffer,
}

@Injectable()
export class FileService {
  // 获取size
  private getFileOrDirSizeInBytes(filePath: string): number {
    let size = 0;

    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      size += stats.size;
    } else if (stats.isDirectory()) {
      fs.readdirSync(filePath).map((child) => {
        size += this.getFileOrDirSizeInBytes(`${filePath}/${child}`);
      });
    }

    return size;
  }

  // 删除
  private deleteDirOrFile(filePath: string):void {
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      fs.unlinkSync(filePath);
    } else if (stats.isDirectory()) {
      fs.readdirSync(filePath).map((child) => {
        this.deleteDirOrFile(`${filePath}/${child}`); // 遍历删除
      })

      fs.rmdirSync(filePath); // 最后移除目录
    }
  }

  // 保存文件
  private async saveFile(filePath: string, file: Buffer | unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.mkdir(path.dirname(filePath), { recursive: true }, (errorMkdir: Error) => {
        if (errorMkdir) {
          reject(errorMkdir);
        }
        fs.writeFile(filePath, file, (errorWrite: Error) => {
          if (errorWrite) {
            reject(errorWrite);
          }
          resolve();
        })
      });
    });
  }

  // 流 to buffer
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer = [];

    return new Promise((resolve, reject) => {
      stream
        .on('error', (error) => reject(error))
        .on('data', (data) => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer)))
    })
  }

  public async storeFileByFs(file: any): Promise<IFileInFs> {
    console.log(file)
    const fileUpload = await file;
    // const fileStream = fileUpload.createReadStream();
    // 创建上传目录
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // const buffer = await this.streamToBuffer(fileStream);
    const hashSum = hasha(fileUpload.buffer, { algorithm: 'sha256' });

    const fileName = slugify(fileUpload.originalname);
    const fullPath = path.resolve(uploadDir, hashSum, fileName);
    const fileDir = path.resolve(uploadDir, hashSum);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir);

      await this.saveFile(fullPath, fileUpload.buffer);
    }

    const fileSize = this.getFileOrDirSizeInBytes(path.dirname(fullPath));
    return {
      originName: fileUpload.filename,
      fileName,
      fullPath,
      filePath: `/${hashSum}/${fileName}`,
      fileSize,
      fileMimetype: fileUpload.mimetype,
      hashSum,
    };
  }

  // 移除目录
  public async removeDirByFs(hashSum: string): Promise<boolean> {
    const dirPath = path.resolve(uploadDir, hashSum);

    if (fs.existsSync(dirPath)) {
      this.deleteDirOrFile(dirPath);
    }

    return true;
  }

  public async uploadProcess(file): Promise<{ url: string }> {
    const res = await this.storeFileByFs(file);

    return {
      url: res.filePath,
    };
  }
}
