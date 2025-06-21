import { Test, TestingModule } from '@nestjs/testing';
import { SaleEntryController } from './sale-entry.controller';

describe('SaleEntryController', () => {
  let controller: SaleEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleEntryController],
    }).compile();

    controller = module.get<SaleEntryController>(SaleEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
