// customer.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  NotFoundException,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserAuditInterceptor } from 'src/interceptor/user-audit.interceptor';

@ApiTags('Customers')
@Controller('customers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseInterceptors(UserAuditInterceptor)
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  async create(@Body() data: CreateCustomerDto) {
    return this.customerService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  async findAll() {
    return this.customerService.findAll();
  }

 
  @Get('deleted')
  @ApiOperation({ summary: 'Get all deleted customers' })
  async findAllDeleted() {
    return this.customerService.findAllDeleted();
  }

  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restore deleted customers' })
  async restoreDeleted(@Param('id',ParseIntPipe) id: number) {
    return this.customerService.restore(id);
  }

  @Put(':customercode')
  @ApiOperation({ summary: 'Update a customer' })
  async update(
    @Param('customercode', ParseIntPipe) customercode: number,
    @Body() data: CreateCustomerDto,
  ) {
    if (!data.updatedBy) {
      throw new NotFoundException('updatedBy is required');
    }
    if (!data.updatedBy) {
      throw new NotFoundException('updatedBy is required');
    }
    return this.customerService.updateCustomer(Number(customercode), {
      ...data,
      updatedBy: data.updatedBy,
    });
  }

  @Delete(':customercode')
  @UseInterceptors(UserAuditInterceptor)
  async remove(
    @Param('customercode') customercode: string,
    @Body('deletedBy') deletedBy: number,
  ) {
    try {
      return await this.customerService.remove(+customercode, deletedBy);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
