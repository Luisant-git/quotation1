import { Module } from '@nestjs/common';
import { SaleEntryService } from './sale-entry.service';
import { SaleEntryController } from './sale-entry.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [SaleEntryController],
  providers: [SaleEntryService, PrismaService],
})
export class SaleEntryModule {}
