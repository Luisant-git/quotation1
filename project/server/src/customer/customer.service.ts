// customer.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCustomerDto) {
    return this.prisma.customer.create({
       data 


    });
  }

  async findAll() {
    return this.prisma.customer.findMany(
      {
        where: { Delete_Flg: 0 },
        orderBy: { customercode: 'desc' },
      }
    );
  }



  async findAllDeleted(){
    try {
      return await this.prisma.customer.findMany({
        where: { Delete_Flg: 1 },
        orderBy: { customercode: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve customers: ${error.message}`,
      );
    }
  }

  async restore(id:any){
    try {
      return await this.prisma.customer.update({
        where: { customercode:id },
        data: {
          Delete_Flg: 0,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve customers: ${error.message}`,
      );
    }

  }

  async updateCustomer(
    customercode: number,
    data: {
      customername?: string;
      Address?: string;
      Mobile?: string;
      updatedBy: number;
    }
  ) {
    return this.prisma.customer.update({
      where: { customercode },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }


  async remove(customercode: number, deletedBy: number) {
    try {
      return await this.prisma.customer.update({
        where: { customercode },
        data: {
          Delete_Flg: 1,
          deletedBy,
          DeletedDate: new Date().toISOString(),
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException({
          message:
            'Cannot delete customer because it is referenced by other records',
          error: error.message,
          details: error.meta || null,
        });
      }
      console.error('Error deleting customer:', error);
      throw new NotFoundException({
        message: 'Customer not found',
        error: error.message,
        details: error.meta || null,
      });
    }
  }
}
