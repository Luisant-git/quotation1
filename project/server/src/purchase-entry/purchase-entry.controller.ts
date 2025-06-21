import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PurchaseEntryService } from './purchase-entry.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


import { Response } from 'express';
import { CreatePurchaseEntryDto } from './dto/create-purchase-entry.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePurchaseEntryDto } from './dto/update-purchase-entry.dto';
import { UserAuditInterceptor } from 'src/interceptor/user-audit.interceptor';

@Controller('purchase-entry')
@ApiTags('PurchaseEntry')
@UseInterceptors(UserAuditInterceptor)
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PurchaseEntryController {
  constructor(private readonly salePurchaseService: PurchaseEntryService) {}

// sale-purchase.controller.ts
@Post()
@ApiOperation({ summary: 'Create a sale entry with sale items' })
@ApiResponse({ 
  status: 201, 
  description: 'Sale entry created successfully',
  type:CreatePurchaseEntryDto  // Add your DTO here
})
@ApiResponse({ 
  status: 400, 
  description: 'Bad request - Invalid data or duplicate entry' 
})
@ApiResponse({ 
  status: 409, 
  description: 'Conflict - Duplicate bill number' 
})
async create(
  @Body() createSaleEntryDto: CreatePurchaseEntryDto,
  @Res() res: Response,
) {
  try {
    const saleEntry = await this.salePurchaseService.createWithItems(createSaleEntryDto);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Sale entry created successfully',
      data: saleEntry,
    });
  } catch (error) {
    const status = error.getStatus?.() || HttpStatus.BAD_REQUEST;
    return res.status(status).json({
      success: false,
      message: error.response?.message || error.message,
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
      const saleEntries = await this.salePurchaseService.findAll();
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

  @Get('Deleted')
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Items retrieved successfully' })
  async getdeleted (@Res() res: Response) {
    try {
      const saleEntries = await this.salePurchaseService.getdelated();
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

  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restore deleted items' })
  @ApiResponse({ status: 200, description: 'Items restored successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async restoreDeleted(@Param('id',ParseIntPipe) id: number) {
    return this.salePurchaseService.restore(id);
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
      const saleEntry = await this.salePurchaseService.findOne(id);
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update purchase entry' })
  @ApiResponse({ status: 200, description: 'Purchase entry updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePurchaseEntryDto: UpdatePurchaseEntryDto,
    @Res() res: Response,
  ) {
    try {
      const updatedPurchaseEntry = await this.salePurchaseService.update(
        id,
        updatePurchaseEntryDto,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Purchase entry updated successfully',
        data: updatedPurchaseEntry,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Failed to update purchase entry',
        error: error.message || error,
      });
    }
  }


  @Delete(':id')
  async remove(@Param('id') id: string, @Body('deletedBy') deletedBy: number) {
    try {
      return await this.salePurchaseService.remove(+id, deletedBy);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
