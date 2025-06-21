import { Injectable } from '@nestjs/common';
import { CreateClothDetailDto } from './dto/cloth-detail.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClothDetailService {
  constructor(private readonly prisma: PrismaService) {}

  async createClothDetail(data: CreateClothDetailDto) {
    return this.prisma.clothDetail.create({ data });
  }

  async getClothDetails() {
    return this.prisma.clothDetail.findMany({
      include: {
        Header: true,
      },
    });
  }

  async getClothDetailById(id: number) {
    return this.prisma.clothDetail.findUnique({
      where: { DetailId: id },
      include: {
        Header: true,
      },
    });
  }

  async updateClothDetail(id: number, data: CreateClothDetailDto) {
    return this.prisma.clothDetail.update({
      where: { DetailId: id },
      data,
    });
  }

  async deleteClothDetail(id: number) {
    return this.prisma.clothDetail.delete({
      where: { DetailId: id },
    });
  }
}
