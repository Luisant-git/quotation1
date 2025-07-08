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
import { CreateSaleItemDto } from './dto/create-sale-item.dto';

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
  // async createWithItems(data: CreateSaleEntryDto) {
  //   try {
  //     // Check for existing BillNo + concernId combination
  //     const existing = await this.prisma.saleEntry.findFirst({
  //       where: {
  //         BillNo: data.BillNo,
  //         concernId: data.concernId,
  //       },
  //     });

  //     if (existing) {
  //       throw new BadRequestException(
  //         `Sale Entry with BillNo "${data.BillNo}" already exists for concern ID ${data.concernId}.`,
  //       );
  //     }

  //     // Prepare the data with proper relations
  //     const createData = {
  //       BillDate: data.BillDate,
  //       Remarks: data.Remarks,
  //       TotalAmount: data.TotalAmount,
  //       TotalPaidAmount: data.TotalPaidAmount,
  //       CardAmount: data.CardAmount,
  //       UPIAmount: data.UPIAmount,
  //       BillNo: data.BillNo,
  //       TotalQty: data.TotalQty,
  //       concernId: data.concernId,
  //       createdBy: data.createdBy,
  //       CreatedDate: new Date(),
  //       financialYear: data.FinancialYearId
  //         ? { connect: { HeaderId: data.FinancialYearId } }
  //         : undefined,
  //       customer: data.customerId
  //         ? { connect: { customercode: data.customerId } }
  //         : undefined,
  //       saleItems: {
  //         create: data.saleItems.map((item) => ({
  //           Item_Id: item.Item_Id,
  //           HSNCode: item.HSNCode,
  //           DiscPercent: item.DiscPercent,
  //           Qty: item.Qty,
  //           MRP: item.MRP,
  //           Rate: item.Rate,
  //           DiscType: item.DiscType,
  //           DiscAmount: item.DiscAmount,
  //           GSTAmount: item.GSTAmount,
  //           NetAmount: item.NetAmount,
  //           Amount: item.Amount,
  //           // createdBy: data.createdBy,
  //         })),
  //       },
  //     };

  //     // Create the sale entry with all relations
  //     return await this.prisma.saleEntry.create({
  //       data: createData,
  //       include: {
  //         saleItems: true,
  //         customer: true,
  //         financialYear: true,
  //       },
  //     });
  //   } catch (error) {
  //     if (error.code === 'P2002') {
  //       throw new BadRequestException('Duplicate BillNo for this concern.');
  //     }
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

      // Validate item quantities before proceeding
      await this.validateItemQuantities(data.saleItems, data.concernId);

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
        customername: data.customername,
        Mobile: data.Mobile,
        createdBy: data.createdBy,
        CreatedDate: new Date(),
        financialYear: data.FinancialYearId
          ? { connect: { HeaderId: data.FinancialYearId } }
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
          })),
        },
      };

      // Use a transaction to ensure both operations succeed or fail together
      return await this.prisma.$transaction(async (prisma) => {
        // Create the sale entry
        const saleEntry = await prisma.saleEntry.create({
          data: createData,
          include: {
            saleItems: true,
            financialYear: true,
          },
        });

        // Update purchase quantities
        await this.updatePurchaseQuantities(data.saleItems, data.concernId);

        return saleEntry;
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

  private async validateItemQuantities(
    saleItems: CreateSaleItemDto[],
    concernId: number,
  ): Promise<void> {
    for (const item of saleItems) {
      // Get the itemCode from ItemMaster
      const itemMaster = await this.prisma.itemMaster.findUnique({
        where: { id: item.Item_Id },
        select: { itemCode: true },
      });

      if (!itemMaster) {
        throw new BadRequestException(`Item with ID ${item.Item_Id} not found`);
      }

      // Get all purchase items for this itemCode (via ItemMaster)
      const purchaseItems = await this.prisma.purchaseItems.findMany({
        where: {
          ItemMaster: { itemCode: itemMaster.itemCode },
          purchaseEntry: {
            concernId: concernId,
            Delete_Flg: 0,
          },
        },
        select: { Qty: true },
      });

      const totalAvailableQty = purchaseItems.reduce(
        (sum, pi) => sum + pi.Qty.toNumber(),
        0,
      );

      if (totalAvailableQty < item.Qty) {
        throw new BadRequestException(
          `Insufficient quantity for itemCode ${itemMaster.itemCode}. Available: ${totalAvailableQty}, Requested: ${item.Qty}`,
        );
      }
    }
  }

  private async updatePurchaseQuantities(
    saleItems: CreateSaleItemDto[],
    concernId: number,
  ): Promise<void> {
    for (const item of saleItems) {
      // Get the itemCode from ItemMaster
      const itemMaster = await this.prisma.itemMaster.findUnique({
        where: { id: item.Item_Id },
        select: { itemCode: true },
      });

      if (!itemMaster) continue;

      // Get all purchase items for this itemCode, FIFO
      const purchaseItems = await this.prisma.purchaseItems.findMany({
        where: {
          ItemMaster: { itemCode: itemMaster.itemCode },
          purchaseEntry: {
            concernId: concernId,
            Delete_Flg: 0,
          },
        },
        orderBy: {
          purchaseEntry: { CreatedDate: 'asc' },
        },
        include: { purchaseEntry: true },
      });

      let remainingQty = item.Qty;

      for (const pi of purchaseItems) {
        if (remainingQty <= 0) break;

        const availableQty = pi.Qty.toNumber();
        const deduction = Math.min(availableQty, remainingQty);

        await this.prisma.purchaseItems.update({
          where: { id: pi.id },
          data: { Qty: availableQty - deduction },
        });

        // When incrementing back to purchaseEntry
        await this.prisma.purchaseEntry.update({
          where: { id: pi.purchaseEntryId },
          data: {
            ActualQty: { increment: remainingQty },
            TotalAmount: { increment: remainingQty * pi.Rate.toNumber() },
          },
        });

        remainingQty -= deduction;
      }
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

  async findAllCustomers() {
    try {
      // Get distinct customername and Mobile where not null
      return await this.prisma.saleEntry.findMany({
        where: {
          customername: { not: null },
          Mobile: { not: null },
          Delete_Flg: 0,
        },
        select: {
          customername: true,
          Mobile: true,
        },
        distinct: ['customername', 'Mobile'],
        orderBy: { id: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve customers: ${error.message}`,
      );
    }
  }

  async getDeletedAll() {
    try {
      return await this.prisma.saleEntry.findMany({
        where: { Delete_Flg: 1 },
        include: { saleItems: true },
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

  // async update(id: number, data: UpdateSaleEntryDto) {
  //   try {
  //     // 1. Get the complete existing record
  //     const existing = await this.prisma.saleEntry.findUnique({
  //       where: { id },
  //       include: {
  //         saleItems: true,
  //         customer: true,
  //         financialYear: true,
  //       },
  //     });

  //     if (!existing) {
  //       throw new BadRequestException('Sale entry not found');
  //     }

  //     // 2. Verify no other record has the same BillNo and concernId
  //     const conflict = await this.prisma.saleEntry.findFirst({
  //       where: {
  //         BillNo: existing.BillNo,
  //         concernId: existing.concernId,
  //         NOT: { id: existing.id },
  //       },
  //     });

  //     if (conflict) {
  //       throw new BadRequestException(
  //         `Database contains duplicate records with BillNo ${existing.BillNo} and concernId ${existing.concernId}`,
  //       );
  //     }

  //     // 3. Prepare update data with proper typing and relation handling
  //     const updateData: Prisma.SaleEntryUpdateInput = {
  //       BillNo: existing.BillNo,
  //       concernId: existing.concernId,
  //       BillDate: data.BillDate,
  //       Remarks: data.Remarks,
  //       TotalQty: data.TotalQty,
  //       TotalAmount: data.TotalAmount,
  //       CardAmount: data.CardAmount,
  //       UPIAmount: data.UPIAmount,
  //       TotalPaidAmount: data.TotalPaidAmount,
  //       Delete_Flg: data.Delete_Flg,
  //       createdBy: data.createdBy,
  //       updatedBy: data.updatedBy,
  //       deletedBy: data.deletedBy,
  //       ModifiedDate: new Date(),
  //       financialYear:
  //         data.FinancialYearId !== undefined
  //           ? data.FinancialYearId
  //             ? { connect: { HeaderId: data.FinancialYearId } }
  //             : { disconnect: true }
  //           : undefined,
  //       // Handle customer relation properly
  //       customer:
  //         data.customerId !== undefined
  //           ? data.customerId
  //             ? { connect: { customercode: data.customerId } }
  //             : { disconnect: true }
  //           : undefined,
  //       // Handle saleItems
  //       saleItems: data.saleItems
  //         ? {
  //             upsert: data.saleItems.map((item) => ({
  //               where: { id: item.id ?? 0 },
  //               create: {
  //                 Qty: item.Qty ?? 0,
  //                 MRP: item.MRP ?? 0,
  //                 Rate: item.Rate ?? 0,
  //                 Amount: item.Amount ?? 0,
  //                 DiscType: item.DiscType || '',
  //                 DiscPercent: item.DiscPercent ?? 0,
  //                 DiscAmount: item.DiscAmount ?? 0,
  //                 GSTAmount: item.GSTAmount ?? 0,
  //                 HSNCode: item.HSNCode || '',
  //                 GSTPercent: item.GSTPercent ?? 0,
  //                 NetAmount: item.NetAmount ?? 0,
  //                 Item_Id: item.Item_Id ?? 0,
  //                 // createdBy: item.createdBy ?? 0,
  //               },
  //               update: {
  //                 Qty: item.Qty,
  //                 MRP: item.MRP,
  //                 Rate: item.Rate,
  //                 Amount: item.Amount,
  //                 DiscType: item.DiscType,
  //                 DiscPercent: item.DiscPercent,
  //                 DiscAmount: item.DiscAmount,
  //                 GSTAmount: item.GSTAmount,
  //                 HSNCode: item.HSNCode,
  //                 GSTPercent: item.GSTPercent,
  //                 NetAmount: item.NetAmount,
  //                 updatedBy: item.updatedBy,
  //               },
  //             })),
  //           }
  //         : undefined,
  //     };

  //     // 4. Perform the update
  //     return await this.prisma.saleEntry.update({
  //       where: { id },
  //       data: updateData,
  //       include: {
  //         saleItems: true,
  //         customer: true,
  //       },
  //     });
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Failed to update sale entry: ${error.message}`,
  //     );
  //   }
  // }

  async update(id: number, data: UpdateSaleEntryDto) {
    try {
      // 1. Get the complete existing record with saleItems
      const existing = await this.prisma.saleEntry.findUnique({
        where: { id },
        include: { saleItems: true, financialYear: true },
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

      // 3. Transaction: restore old qty, validate new, then deduct new
      return await this.prisma.$transaction(async (prisma) => {
        // --- Step 1: Restore old sale quantities to purchase items (LIFO) ---
        for (const oldItem of existing.saleItems) {
          // Get itemCode
          const itemMaster = await prisma.itemMaster.findUnique({
            where: { id: oldItem.Item_Id },
            select: { itemCode: true },
          });
          if (!itemMaster) continue;

          let remainingQty = Number(oldItem.Qty);
          // Add back to purchase items (LIFO)
          const purchaseItems = await prisma.purchaseItems.findMany({
            where: {
              ItemMaster: { itemCode: itemMaster.itemCode },
              purchaseEntry: {
                concernId: existing.concernId,
                Delete_Flg: 0,
              },
            },
            orderBy: { purchaseEntry: { CreatedDate: 'desc' } },
            include: { purchaseEntry: true },
          });
          for (const pi of purchaseItems) {
            if (remainingQty <= 0) break;
            const currentQty = pi.Qty.toNumber();
            await prisma.purchaseItems.update({
              where: { id: pi.id },
              data: { Qty: currentQty + remainingQty },
            });
            // When incrementing back to purchaseEntry
            await prisma.purchaseEntry.update({
              where: { id: pi.purchaseEntryId },
              data: {
                ActualQty: { increment: remainingQty },
                TotalAmount: { increment: remainingQty * pi.Rate.toNumber() },
              },
            });
            remainingQty = 0; // All returned to first found batch
          }
        }

        // --- Step 2: Validate new sale items (like in create) ---
        for (const item of data.saleItems) {
          const itemMaster = await prisma.itemMaster.findUnique({
            where: { id: item.Item_Id },
            select: { itemCode: true },
          });
          if (!itemMaster) {
            throw new BadRequestException(
              `Item with ID ${item.Item_Id} not found`,
            );
          }
          const purchaseItems = await prisma.purchaseItems.findMany({
            where: {
              ItemMaster: { itemCode: itemMaster.itemCode },
              purchaseEntry: {
                concernId: existing.concernId,
                Delete_Flg: 0,
              },
            },
            select: { Qty: true },
          });
          const totalAvailableQty = purchaseItems.reduce(
            (sum, pi) => sum + pi.Qty.toNumber(),
            0,
          );
          if (totalAvailableQty < Number(item.Qty)) {
            throw new BadRequestException(
              `Insufficient quantity for itemCode ${itemMaster.itemCode}. Available: ${totalAvailableQty}, Requested: ${item.Qty}`,
            );
          }
        }

        // --- Step 3: Deduct new sale quantities from purchase items (FIFO) ---
        for (const item of data.saleItems) {
          const itemMaster = await prisma.itemMaster.findUnique({
            where: { id: item.Item_Id },
            select: { itemCode: true },
          });
          if (!itemMaster) continue;

          let remainingQty = Number(item.Qty);
          const purchaseItems = await prisma.purchaseItems.findMany({
            where: {
              ItemMaster: { itemCode: itemMaster.itemCode },
              purchaseEntry: {
                concernId: existing.concernId,
                Delete_Flg: 0,
              },
            },
            orderBy: { purchaseEntry: { CreatedDate: 'asc' } },
            include: { purchaseEntry: true },
          });
          for (const pi of purchaseItems) {
            if (remainingQty <= 0) break;
            const availableQty = pi.Qty.toNumber();
            const deduction = Math.min(availableQty, remainingQty);
            await prisma.purchaseItems.update({
              where: { id: pi.id },
              data: { Qty: availableQty - deduction },
            });
            await prisma.purchaseEntry.update({
              where: { id: pi.purchaseEntryId },
              data: {
                ActualQty: { decrement: deduction },
                TotalAmount: { decrement: deduction * pi.Rate.toNumber() },
              },
            });
            remainingQty -= deduction;
          }
        }

        // --- Step 4: Update SaleEntry and SaleItems ---
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
          customername: data.customername,
          Mobile: data.Mobile,
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
          saleItems: data.saleItems
            ? {
                deleteMany: {}, // Remove all old saleItems
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
                })),
              }
            : undefined,
        };

        return await prisma.saleEntry.update({
          where: { id },
          data: updateData,
          include: {
            saleItems: true,
          },
        });
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
