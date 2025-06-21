import { Module } from '@nestjs/common';
import { PurchaseEntryService } from './purchase-entry.service';
import { PurchaseEntryController } from './purchase-entry.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PurchaseEntryService,PrismaService],
  controllers: [PurchaseEntryController,]
})
export class PurchaseEntryModule {}
