import { Module } from '@nestjs/common';
import { DogsController } from './dogs.controller'
import { DogsService } from './dogs.service'

@Module({
  imports: [],
  controllers: [DogsController],
  providers: [DogsService],
  exports: [DogsService]
})
export class DogsModule {}