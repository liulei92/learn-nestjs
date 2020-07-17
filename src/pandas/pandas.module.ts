import { Module } from '@nestjs/common';
import { PandasController } from './pandas.controller';
import { PandasService } from './pandas.service';
import { DogsModule } from '../dogs/dogs.module';

@Module({
  imports: [DogsModule],
  controllers: [PandasController],
  providers: [PandasService]
})
export class PandasModule {}
