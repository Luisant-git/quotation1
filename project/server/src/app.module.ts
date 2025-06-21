import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PartyModule } from './party/party.module';
import { ClothDetailModule } from './cloth-detail/cloth-detail.module';
import { AuthModule } from './auth/auth.module';
import { ItemModule } from './item/item.module';
import { SaleEntryModule } from './sale-entry/sale-entry.module';
import { PurchaseEntryModule } from './purchase-entry/purchase-entry.module';
import { CustomerModule } from './customer/customer.module';
import { FinancialYearModule } from './financial-year/financial-year.module';
import { ConcernMasterModule } from './concern-master/concern-master.module';
import { PrismaService } from './prisma/prisma.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserAuditInterceptor } from './interceptor/user-audit.interceptor';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    PrismaModule,
    PartyModule,
    ClothDetailModule,
    AuthModule,
    ItemModule,
    SaleEntryModule,
    PurchaseEntryModule,
    CustomerModule,
    FinancialYearModule,
    ConcernMasterModule,
    StatsModule, 
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService,{
    provide: APP_INTERCEPTOR,
    useClass: UserAuditInterceptor,
  },], 
})
export class AppModule {}
