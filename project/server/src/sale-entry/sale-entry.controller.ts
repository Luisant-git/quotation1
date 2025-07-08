import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { SaleEntryService } from './sale-entry.service';
import { CreateSaleEntryDto } from './dto/create-sale-entry.dto';
import { UpdateSaleEntryDto } from './dto/update-sale-entry.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserAuditInterceptor } from 'src/interceptor/user-audit.interceptor';

@ApiTags('SaleEntry')
@Controller('sale-entries')
@ApiBearerAuth()
@UseInterceptors(UserAuditInterceptor)
@UseGuards(AuthGuard('jwt'))
export class SaleEntryController {
  constructor(private readonly saleEntryService: SaleEntryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a sale entry with sale items' })
  @ApiResponse({ status: 201, description: 'Sale entry created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createSaleEntryDto: CreateSaleEntryDto,
    @Res() res: Response,
  ) {
    try {
      const saleEntry =
        await this.saleEntryService.createWithItems(createSaleEntryDto);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Sale entry created successfully',
        data: saleEntry,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to create sale entry',
        error: error.message || error,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all sale entries' })
  @ApiResponse({
    status: 200,
    description: 'Sale entries retrieved successfully',
  })
  async findAll(@Res() res: Response) {
    try {
      const saleEntries = await this.saleEntryService.findAll();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Sale entries retrieved successfully',
        data: saleEntries,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to retrieve sale entries',
        error: error.message || error,
      });
    }
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
  })
  async getAllCustomers() {
    return this.saleEntryService.findAllCustomers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sale entry retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Sale entry not found' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const saleEntry = await this.saleEntryService.findOne(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Sale entry retrieved successfully',
        data: saleEntry,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Sale entry not found',
        error: error.message || error,
      });
    }
  }

  @Get('deleted')
  @ApiOperation({ summary: 'Get all deleted sale entries' })
  @ApiResponse({
    status: 200,
    description: 'Deleted sale entries retrieved successfully',
  })
  async getDeletedAll(@Res() res: Response) {
    try {
      const deletedSaleEntries = await this.saleEntryService.getDeletedAll();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Deleted sale entries retrieved successfully',
        data: deletedSaleEntries,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to retrieve deleted sale entries',
        error: error.message || error,
      });
    }
  }

  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restore a deleted sale entry' })
  @ApiResponse({
    status: 200,
    description: 'Sale entry restored successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async restore(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const restoredSaleEntry = await this.saleEntryService.restore(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Sale entry restored successfully',
        data: restoredSaleEntry,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to restore sale entry',
        error: error.message || error,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sale entry' })
  @ApiResponse({ status: 200, description: 'Sale entry updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSaleEntryDto: UpdateSaleEntryDto,
    @Res() res: Response,
  ) {
    try {
      const updatedSaleEntry = await this.saleEntryService.update(
        id,
        updateSaleEntryDto,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Sale entry updated successfully',
        data: updatedSaleEntry,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to update sale entry',
        error: error.message || error,
      });
    }
  }

  @Delete(':id')
  @UseInterceptors(UserAuditInterceptor)
  async remove(@Param('id') id: string, @Body('deletedBy') deletedBy: number) {
    try {
      return await this.saleEntryService.remove(+id, deletedBy);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
