import { Test, TestingModule } from '@nestjs/testing';
import { PandasController } from './pandas.controller';

describe('Pandas Controller', () => {
  let controller: PandasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PandasController],
    }).compile();

    controller = module.get<PandasController>(PandasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
