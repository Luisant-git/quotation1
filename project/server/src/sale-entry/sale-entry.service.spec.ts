import { Test, TestingModule } from '@nestjs/testing';
import { SaleEntryService } from './sale-entry.service';

describe('SaleEntryService', () => {
  let service: SaleEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleEntryService],
    }).compile();

    service = module.get<SaleEntryService>(SaleEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
