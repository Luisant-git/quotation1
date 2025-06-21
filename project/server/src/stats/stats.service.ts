// stats.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeletedCountDto } from './dto/deleted-count.dto';



@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDeletedCounts(): Promise<DeletedCountDto[]> {
    const results = await Promise.all([
      this.getPartyDeletedCount(),
      this.getSaleEntryDeletedCount(),
      this.getPurchaseEntryDeletedCount(),
      this.getCustomerDeletedCount(),
      this.getItemDeletedCount(),
    ]);

    return results.filter(item => item !== null) as DeletedCountDto[];
  }

  private async getPartyDeletedCount(): Promise<DeletedCountDto | null> {
    const count = await this.prisma.party.count({
      where: { Delete_flg: 1 },
    });
    return { name: 'party', totalDeleted: count };
  }

  private async getSaleEntryDeletedCount(): Promise<DeletedCountDto | null> {
    const count = await this.prisma.saleEntry.count({
      where: { Delete_Flg: 1 },
    });
    return { name: 'saleEntry', totalDeleted: count };
  }

  private async getPurchaseEntryDeletedCount(): Promise<DeletedCountDto | null> {
    const count = await this.prisma.purchaseEntry.count({
      where: { Delete_Flg: 1 },
    });
    return { name: 'purchaseEntry', totalDeleted: count };
  }

  private async getCustomerDeletedCount(): Promise<DeletedCountDto | null> {
    const count = await this.prisma.customer.count({
      where: { Delete_Flg: 1 },
    });
    return { name: 'customer', totalDeleted: count };
  }

  private async getItemDeletedCount(): Promise<DeletedCountDto | null> {
    const count = await this.prisma.itemMaster.count({
      where: { Delete_flg: 1 },
    });
    return { name: 'item', totalDeleted: count };
  }
}