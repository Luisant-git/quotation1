import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePurchaseEntryDto } from './dto/create-purchase-entry.dto';
import { UpdatePurchaseEntryDto } from './dto/update-purchase-entry.dto';

@Injectable()
export class PurchaseEntryService {
  constructor(private prisma: PrismaService) {}

  async createWithItems(data: CreatePurchaseEntryDto) {
    try {
      return await this.prisma.purchaseEntry.create({
        data: {
          ...data,
          PurchaseItems: {
            create: data.PurchaseItems,
          },
        },
        include: { PurchaseItems: true },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Handle unique constraint violation
        const target = error.meta?.target;
        
        if (Array.isArray(target) && target.includes('BillNo') && target.includes('Party_Id')) {
          const existingEntry = await this.prisma.purchaseEntry.findFirst({
            where: {
              BillNo: data.BillNo,
              Party_Id: data.Party_Id
            },
            include: { party: true }
          });
  
          if (existingEntry) {
            throw new ConflictException(
              `This bill number (${data.BillNo}) already exists for ${existingEntry.party.Ptyname}. Please use a different bill number.`
            );
          }
        }
        
        // Fallback message
        throw new ConflictException(
          'This purchase already exists with the same details. Please verify your entries.'
        );
      } else if (error.code === 'P2003') {
        // Handle foreign key errors
        if (error.meta?.field_name?.includes('Party_Id')) {
          throw new BadRequestException(
            'The selected supplier does not exist. Please choose a valid supplier.'
          );
        }
        // Add other foreign key checks as needed
      }
      
      // Generic error for all other cases
      throw new BadRequestException(
        'Failed to create purchase entry. Please check your data and try again.'
      );
    }
  }

  private async checkPurchaseDuplicateFields(
    billNo: string,
    partyId: number,
  ): Promise<string[]> {
    const duplicateFields: string[] = [];

    // Check if BillNo exists for any party
    const billNoExists = await this.prisma.purchaseEntry.findFirst({
      where: { BillNo: billNo },
    });
    if (billNoExists) duplicateFields.push('BillNo');

    // Check if Party_Id has this BillNo
    const partyBillExists = await this.prisma.purchaseEntry.findFirst({
      where: { BillNo: billNo, Party_Id: partyId },
    });
    if (partyBillExists) duplicateFields.push('Party_Id');

    return duplicateFields;
  }

  async findAll() {
    try {
      return await this.prisma.purchaseEntry.findMany({
        include: {
          PurchaseItems: {
            include: {
              ItemMaster: true,
            },
          },
          party: true,
        },
        where: { Delete_Flg: 0 },
        orderBy: { id: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve purchase entries: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    const saleEntry = await this.prisma.purchaseEntry.findUnique({
      where: { id },
      include: {
        PurchaseItems: {
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

  async getdelated() {
    try {
      return await this.prisma.purchaseEntry.findMany({
        where: { Delete_Flg: 1 },
        include: { PurchaseItems: true, party: true },
        orderBy: { id: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve purchase entries: ${error.message}`,
      );
    }
  }

  async restore(id: any) {
    try {
      return await this.prisma.purchaseEntry.update({
        where: { id },
        data: {
          Delete_Flg: 0,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve purchase entries: ${error.message}`,
      );
    }
  }

  async update(id: number, data: UpdatePurchaseEntryDto) {
    try {
      const purchaseEntry = await this.prisma.purchaseEntry.update({
        where: { id },
        data: {
          ...data,
          PurchaseItems: {
            upsert: data.PurchaseItems.map((item) => ({
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
                bar_qr_code_No: item.bar_qr_code_No || '',
                GSTPercent: item.GSTPercent ?? 0,
                NetAmount: item.NetAmount ?? 0,
                createdAt: item.createdAt ?? new Date(),
                updatedAt: item.updatedAt ?? new Date(),
                createdBy: item.createdBy ?? 0,
                updatedBy: item.updatedBy ?? null,
                Item_Id: item.Item_Id ?? 0,
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
                bar_qr_code_No: item.bar_qr_code_No,
                GSTPercent: item.GSTPercent,
                NetAmount: item.NetAmount,
                updatedAt: item.updatedAt,
                updatedBy: item.updatedBy,
              },
            })),
          },
        },
        include: { PurchaseItems: true },
      });

      return purchaseEntry;
    } catch (error) {
      throw new BadRequestException(
        `Failed to update purchase entry: ${error.message}`,
      );
    }
  }

  async remove(id: number, deletedBy: number) {
    try {
      return await this.prisma.purchaseEntry.update({
        where: { id },
        data: {
          Delete_Flg: 1,
          DeletedDate: new Date(),
          deletedBy, // Include the deletedBy field
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Cannot delete purchase entry because it is referenced by other records.',
        );
      }
      throw new BadRequestException(
        `Failed to delete purchase entry: ${error.message}`,
      );
    }
  }
}
