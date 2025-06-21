import { Test, TestingModule } from '@nestjs/testing';
import { ClothDetailController } from './cloth-detail.controller';

describe('ClothDetailController', () => {
  let controller: ClothDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClothDetailController],
    }).compile();

    controller = module.get<ClothDetailController>(ClothDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
