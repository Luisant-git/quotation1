// src/financial-year/financial-year.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { FinancialYearService } from './financial-year.service';
import { CreateFinancialYearDto } from './dto/create-financial-year.dto';
import { UpdateFinancialYearDto } from './dto/update-financial-year.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Financial Year')
@Controller('financial-year')
export class FinancialYearController {
  constructor(private readonly financialYearService: FinancialYearService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new financial year' })
  @ApiResponse({ status: 403, description: 'Forbidden if dates are invalid' })
  create(@Body() createFinancialYearDto: CreateFinancialYearDto) {
    return this.financialYearService.create(createFinancialYearDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all financial years' })
  findAll() {
    return this.financialYearService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get currently active financial year' })
  findActive() {
    return this.financialYearService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a financial year by ID' })
  findOne(@Param('id') id: string) {
    return this.financialYearService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a financial year' })
  @ApiResponse({ status: 403, description: 'Forbidden if financial year is active' })
  update(
    @Param('id') id: string,
    @Body() updateFinancialYearDto: UpdateFinancialYearDto,
  ) {
    return this.financialYearService.update(+id, updateFinancialYearDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a financial year' })
  @ApiResponse({ status: 403, description: 'Forbidden if financial year is active' })
  remove(@Param('id') id: string, @Query('deletedBy') deletedBy: string) {
    return this.financialYearService.remove(+id, +deletedBy);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a financial year' })
  activate(@Param('id') id: string, @Query('updatedBy') updatedBy: string) {
    return this.financialYearService.activateFinancialYear(+id, +updatedBy);
  }

  @Post('validate-active')
  @ApiOperation({ summary: 'Validate if any financial year is active' })
  validateActive() {
    return this.financialYearService.validateActiveFinancialYear();
  }
}