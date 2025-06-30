import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleEntryDto } from './dto/create-sale-entry.dto';
import { UpdateSaleEntryDto } from './dto/update-sale-entry.dto';
import { Prisma } from '@prisma/client';
import { connect } from 'http2';

@Injectable()
export class SaleEntryService {
  constructor(private prisma: PrismaService) {}

  // async createWithItems(data: CreateSaleEntryDto) {
  //   try {
  //     return await this.prisma.saleEntry.create({
  //       data: {
  //         ...data,
  //         saleItems: {
  //           create: data.saleItems,
  //         },
  //       },
  //       include: { saleItems: true },
  //     });
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Failed to create sale entry: ${error.message}`,
  //     );
  //   }
  // }
  async createWithItems(data: CreateSaleEntryDto) {
    try {
      // Check for existing BillNo + concernId combination
      const existing = await this.prisma.saleEntry.findFirst({
        where: {
          BillNo: data.BillNo,
          concernId: data.concernId,
        },
      });

      if (existing) {
        throw new BadRequestException(
          `Sale Entry with BillNo "${data.BillNo}" already exists for concern ID ${data.concernId}.`,
        );
      }

      // Prepare the data with proper relations
      const createData = {
        BillDate: data.BillDate,
        Remarks: data.Remarks,
        TotalAmount: data.TotalAmount,
        TotalPaidAmount: data.TotalPaidAmount,
        CardAmount: data.CardAmount,
        UPIAmount: data.UPIAmount,
        BillNo: data.BillNo,
        TotalQty: data.TotalQty,
        concernId: data.concernId,
        createdBy: data.createdBy,
        CreatedDate: new Date(),
        financialYear: data.FinancialYearId
          ? { connect: { HeaderId: data.FinancialYearId } }
          : undefined,
        customer: data.customerId
          ? { connect: { customercode: data.customerId } }
          : undefined,
        saleItems: {
          create: data.saleItems.map((item) => ({
            Item_Id: item.Item_Id,
            HSNCode: item.HSNCode,
            DiscPercent: item.DiscPercent,
            Qty: item.Qty,
            MRP: item.MRP,
            Rate: item.Rate,
            DiscType: item.DiscType,
            DiscAmount: item.DiscAmount,
            GSTAmount: item.GSTAmount,
            NetAmount: item.NetAmount,
            Amount: item.Amount,
            // createdBy: data.createdBy,
          })),
        },
      };

      // Create the sale entry with all relations
      return await this.prisma.saleEntry.create({
        data: createData,
        include: {
          saleItems: true,
          customer: true,
          financialYear: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Duplicate BillNo for this concern.');
      }
      throw new BadRequestException(
        `Failed to create sale entry: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.saleEntry.findMany({
        include: {
          saleItems: {
            include: {
              ItemMaster: true,
            },
          },
          customer: true,
        },
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

  async getDeletedAll() {
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
  async restore(id: any) {
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
      include: {
        saleItems: {
          include: {
            ItemMaster: true,
          },
        },
      },
    });
    if (!saleEntry) {
      throw new NotFoundException(`Sale Entry with ID ${id} not found`);
    }
    return saleEntry;
  }

  async update(id: number, data: UpdateSaleEntryDto) {
    try {
      // 1. Get the complete existing record
      const existing = await this.prisma.saleEntry.findUnique({
        where: { id },
        include: {
          saleItems: true,
          customer: true,
          financialYear: true,
        },
      });

      if (!existing) {
        throw new BadRequestException('Sale entry not found');
      }

      // 2. Verify no other record has the same BillNo and concernId
      const conflict = await this.prisma.saleEntry.findFirst({
        where: {
          BillNo: existing.BillNo,
          concernId: existing.concernId,
          NOT: { id: existing.id },
        },
      });

      if (conflict) {
        throw new BadRequestException(
          `Database contains duplicate records with BillNo ${existing.BillNo} and concernId ${existing.concernId}`,
        );
      }

      // 3. Prepare update data with proper typing and relation handling
      const updateData: Prisma.SaleEntryUpdateInput = {
        BillNo: existing.BillNo,
        concernId: existing.concernId,
        BillDate: data.BillDate,
        Remarks: data.Remarks,
        TotalQty: data.TotalQty,
        TotalAmount: data.TotalAmount,
        CardAmount: data.CardAmount,
        UPIAmount: data.UPIAmount,
        TotalPaidAmount: data.TotalPaidAmount,
        Delete_Flg: data.Delete_Flg,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        deletedBy: data.deletedBy,
        ModifiedDate: new Date(),
        financialYear:
          data.FinancialYearId !== undefined
            ? data.FinancialYearId
              ? { connect: { HeaderId: data.FinancialYearId } }
              : { disconnect: true }
            : undefined,
        // Handle customer relation properly
        customer:
          data.customerId !== undefined
            ? data.customerId
              ? { connect: { customercode: data.customerId } }
              : { disconnect: true }
            : undefined,
        // Handle saleItems
        saleItems: data.saleItems
          ? {
              upsert: data.saleItems.map((item) => ({
                where: { id: item.id ?? 0 },
                create: {
                  Qty: item.Qty ?? 0,
                  MRP: item.MRP ?? 0,
                  Rate: item.Rate ?? 0,
                  Amount: item.Amount ?? 0,
                  DiscType: item.DiscType || '',
                  DiscPercent: item.DiscPercent ?? 0,
                  DiscAmount: item.DiscAmount ?? 0,
                  GSTAmount: item.GSTAmount ?? 0,
                  HSNCode: item.HSNCode || '',
                  GSTPercent: item.GSTPercent ?? 0,
                  NetAmount: item.NetAmount ?? 0,
                  Item_Id: item.Item_Id ?? 0,
                  // createdBy: item.createdBy ?? 0,
                },
                update: {
                  Qty: item.Qty,
                  MRP: item.MRP,
                  Rate: item.Rate,
                  Amount: item.Amount,
                  DiscType: item.DiscType,
                  DiscPercent: item.DiscPercent,
                  DiscAmount: item.DiscAmount,
                  GSTAmount: item.GSTAmount,
                  HSNCode: item.HSNCode,
                  GSTPercent: item.GSTPercent,
                  NetAmount: item.NetAmount,
                  updatedBy: item.updatedBy,
                },
              })),
            }
          : undefined,
      };

      // 4. Perform the update
      return await this.prisma.saleEntry.update({
        where: { id },
        data: updateData,
        include: {
          saleItems: true,
          customer: true,
        },
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
