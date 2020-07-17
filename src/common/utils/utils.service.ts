import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  private readonly arr: Array<any> = [];

  getMaxKey(arr: Array<any>, key: string): number {
    const keys = arr.map(item => item[key] ? +item[key] : 0)
    if (keys.length === 0) {
      return 0
    } else {
      return Math.max(...keys)
    }
  }
}