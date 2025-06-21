import { Module } from '@nestjs/common';
import { ClothDetailService } from './cloth-detail.service';
import { ClothDetailController } from './cloth-detail.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ClothDetailService,PrismaService],
  controllers: [ClothDetailController]
})
export class ClothDetailModule {}
