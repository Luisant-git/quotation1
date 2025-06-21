import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleEntryDto } from './dto/create-sale-entry.dto';

@Injectable()
export class SaleEntryService {
  constructor(private prisma: PrismaService) {}

  async createWithItems(data: CreateSaleEntryDto) {
    try {
      return await this.prisma.saleEntry.create({
        data: {
          ...data,
          saleItems: {
            create: data.saleItems,
          },
        },
        include: { saleItems: true },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to create sale entry: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.saleEntry.findMany({
        include: { saleItems: {
          include: {
            ItemMaster: true,
          },
        }, customer: true  },
        where: {
          Delete_Flg: 0,
        },
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve sale entries: ${error.message}`,
      );
    }
  }

  async getDeletedAll(){
    try {
      return await this.prisma.saleEntry.findMany({
        where: { Delete_Flg: 1 },
        include: { saleItems: true, customer: true },
        orderBy: { id: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve sale entries: ${error.message}`,
      );
    }
  
  }
  async restore(id:any){
    try {
      return await this.prisma.saleEntry.update({
        where: { id },
        data: {
          Delete_Flg: 0,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve sale entries: ${error.message}`,
      );
    }

  }

  async findOne(id: number) {
    const saleEntry = await this.prisma.saleEntry.findUnique({
      where: { id },
      include: { saleItems: true },
    });
    if (!saleEntry) {
      throw new NotFoundException(`Sale Entry with ID ${id} not found`);
    }
    return saleEntry;
  }

  async update(id: number, data: any) {
    try {
      return await this.prisma.saleEntry.update({
        where: { id },
        data: {
          ...data,
          saleItems: {
            upsert: data.saleItems.map((item) => ({
              where: { id: item.id ?? -1 },
              update: { ...item },
              create: { ...item },
            })),
          },
        },
        include: { saleItems: true },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to update sale entry: ${error.message}`,
      );
    }
  }

  async remove(id: number, deletedBy: number) {
    try {
      return await this.prisma.saleEntry.update({
        where: { id },
        data: {
          Delete_Flg: 1,
          deletedBy,
          DeletedDate: new Date(),
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException({
          message:
            'Cannot delete sale entry because it is referenced by other records',
          error: error.message,
          details: error.meta || null,
        });
      }
      console.error('Error deleting sale entry:', error);
      throw new NotFoundException({
        message: 'Sale entry not found',
        error: error.message,
        details: error.meta || null,
      });
    }
  }
}
