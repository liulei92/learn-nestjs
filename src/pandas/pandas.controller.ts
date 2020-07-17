import { Controller, Get, Query } from '@nestjs/common';
import { DogsService } from '../dogs/dogs.service'
import test from '../test'

@Controller('pandas')
export class PandasController {
  constructor(private readonly dogsService: DogsService) {}

  @Get()
  findAll(): string {
    test.set('123')
    return 'this is pandas'
  }

  @Get('share1')
  getShareText1(@Query('text') text: string) {
    // return DDogsService.shareText(text);
    return this.dogsService.shareText(text)
  }

  // @Get('share2')
  // getShareText2(@Query('text') text: string) {
  //   return DDogsService.shareText(text);
  // }
}
