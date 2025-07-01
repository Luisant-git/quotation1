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
        maxWait: 10000, // Max time to wait for a transaction (10s)
        timeout: 10000, // Max time the transaction can run (10s)
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
