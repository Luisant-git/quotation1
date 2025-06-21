import { Module } from '@nestjs/common';
import { ConcernMasterService } from './concern-master.service';
import { ConcernMasterController } from './concern-master.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ConcernMasterController],
  providers: [ConcernMasterService, PrismaService],
})
export class ConcernMasterModule {}
