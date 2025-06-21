import { Test, TestingModule } from '@nestjs/testing';
import { ClothDetailService } from './cloth-detail.service';
import { PrismaService } from 'src/prisma/prisma.service';


describe('ClothDetailService', () => {
  let service: ClothDetailService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClothDetailService, PrismaService],
    }).compile();

    service = module.get<ClothDetailService>(ClothDetailService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createClothDetail', () => {
    it('should create a new ClothDetail', async () => {
      const createDto = {
        HeaderId: 1,
        Dia_Id: 2,
        ClothDesc_Id: 3,
        Uom_Id: 4,
        GSM: 120,
        LL: 'LL Description',
        GG: 200,
        Remarks: 'Sample Remark',
        Rate: 50,
      };

      prisma.clothDetail.create = jest.fn().mockResolvedValue(createDto);
      const result = await service.createClothDetail(createDto);
      expect(result).toEqual(createDto);
      expect(prisma.clothDetail.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('getClothDetails', () => {
    it('should return all ClothDetails', async () => {
      const details = [
        { DetailId: 1, HeaderId: 1, GSM: 120 },
        { DetailId: 2, HeaderId: 1, GSM: 150 },
      ];

      prisma.clothDetail.findMany = jest.fn().mockResolvedValue(details);
      const result = await service.getClothDetails();
      expect(result).toEqual(details);
      expect(prisma.clothDetail.findMany).toHaveBeenCalled();
    });
  });

  describe('getClothDetailById', () => {
    it('should return a ClothDetail by ID', async () => {
      const detail = { DetailId: 1, HeaderId: 1, GSM: 120 };

      prisma.clothDetail.findUnique = jest.fn().mockResolvedValue(detail);
      const result = await service.getClothDetailById(1);
      expect(result).toEqual(detail);
      expect(prisma.clothDetail.findUnique).toHaveBeenCalledWith({
        where: { DetailId: 1 },
        include: expect.anything(),
      });
    });
  });

  describe('updateClothDetail', () => {
    it('should update a ClothDetail by ID', async () => {
      const updateDto = { GSM: 140 };
      const updatedDetail = { DetailId: 1, HeaderId: 1, GSM: 140 };

      prisma.clothDetail.update = jest.fn().mockResolvedValue(updatedDetail);
      const result = await service.updateClothDetail(1, updateDto as any);
      expect(result).toEqual(updatedDetail);
      expect(prisma.clothDetail.update).toHaveBeenCalledWith({
        where: { DetailId: 1 },
        data: updateDto,
      });
    });
  });

  describe('deleteClothDetail', () => {
    it('should delete a ClothDetail by ID', async () => {
      const deletedDetail = { DetailId: 1, HeaderId: 1, GSM: 120 };

      prisma.clothDetail.delete = jest.fn().mockResolvedValue(deletedDetail);
      const result = await service.deleteClothDetail(1);
      expect(result).toEqual(deletedDetail);
      expect(prisma.clothDetail.delete).toHaveBeenCalledWith({
        where: { DetailId: 1 },
      });
    });
  });
});
