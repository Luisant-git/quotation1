import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseEntryController } from './purchase-entry.controller';

describe('PurchaseEntryController', () => {
  let controller: PurchaseEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseEntryController],
    }).compile();

    controller = module.get<PurchaseEntryController>(PurchaseEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
