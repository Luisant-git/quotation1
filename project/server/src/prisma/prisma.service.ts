import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      // 👇 Set transaction timeout (10 seconds globally)
      transactionOptions: {
        maxWait: 30000, // Max time to wait for a transaction (30s)
        timeout: 30000, // Max time the transaction can run (30s)
      },
    });
  }
  
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
