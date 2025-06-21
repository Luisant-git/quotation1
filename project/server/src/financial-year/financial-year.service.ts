// src/financial-year/financial-year.service.ts
import { Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinancialYearDto } from './dto/create-financial-year.dto';
import { UpdateFinancialYearDto } from './dto/update-financial-year.dto';

@Injectable()
export class FinancialYearService {
  constructor(private prisma: PrismaService) {}

  async create(createFinancialYearDto: CreateFinancialYearDto) {
    // Validate financial year dates (April 1 to March 31)
    const fromDate = new Date(createFinancialYearDto.Date_From);
    const toDate = new Date(createFinancialYearDto.Date_To);
    
    if (fromDate.getMonth() !== 3 || fromDate.getDate() !== 1) {
      throw new ConflictException('Financial year must start on April 1st');
    }
    
    if (toDate.getMonth() !== 2 || toDate.getDate() !== 31) {
      throw new ConflictException('Financial year must end on March 31st');
    }
    
    if (toDate.getFullYear() - fromDate.getFullYear() !== 1) {
      throw new ConflictException('Financial year must span exactly one year (April to March)');
    }

    // Check if year ID already exists
    const existingYear = await this.prisma.financialYear.findUnique({
      where: { YearId: createFinancialYearDto.YearId },
    });
    
    if (existingYear) {
      throw new ConflictException('Financial year with this ID already exists');
    }

    // If setting as active, deactivate all others
    if (createFinancialYearDto.IsRunning === 1) {
      await this.prisma.financialYear.updateMany({
        where: { IsRunning: 1 },
        data: { IsRunning: 0 },
      });
    }

    return this.prisma.financialYear.create({
      data: {
        ...createFinancialYearDto,
        IsRunning: createFinancialYearDto.IsRunning || 0,
      },
    });
  }

  async findAll() {
    return this.prisma.financialYear.findMany({
      where: { Delete_flg: 0 },
      orderBy: { Date_From: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.financialYear.findFirst({
      where: { IsRunning: 1, Delete_flg: 0 },
    });
  }

  async findOne(id: number) {
    return this.prisma.financialYear.findUnique({
      where: { HeaderId: id, Delete_flg: 0 },
    });
  }

  async update(id: number, updateFinancialYearDto: UpdateFinancialYearDto) {
    // Check if financial year is active - prevent updates if active
    const financialYear = await this.prisma.financialYear.findUnique({
      where: { HeaderId: id },
    });
    
    if (financialYear.IsRunning === 1) {
      throw new ForbiddenException('Cannot modify an active financial year');
    }

    // If setting as active, deactivate all others
    if (updateFinancialYearDto.IsRunning === 1) {
      await this.prisma.financialYear.updateMany({
        where: { IsRunning: 1 },
        data: { IsRunning: 0 },
      });
    }

    return this.prisma.financialYear.update({
      where: { HeaderId: id },
      data: {
        ...updateFinancialYearDto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number, deletedBy: number) {
    // Check if financial year is active - prevent deletion if active
    const financialYear = await this.prisma.financialYear.findUnique({
      where: { HeaderId: id },
    });
    
    if (financialYear.IsRunning === 1) {
      throw new ForbiddenException('Cannot delete an active financial year');
    }

    return this.prisma.financialYear.update({
      where: { HeaderId: id },
      data: {
        Delete_flg: 1,
        deletedBy,
        updatedAt: new Date(),
      },
    });
  }

  async activateFinancialYear(id: number, updatedBy: number) {
    // First deactivate all financial years
    await this.prisma.financialYear.updateMany({
      where: { IsRunning: 1 },
      data: { IsRunning: 0 },
    });

    // Then activate the selected one
    return this.prisma.financialYear.update({
      where: { HeaderId: id },
      data: {
        IsRunning: 1,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async validateActiveFinancialYear() {
    const activeYear = await this.findActive();
    if (activeYear) {
      throw new ForbiddenException(
        'Operations are restricted when a financial year is active. Please close the current financial year first.',
      );
    }
    return activeYear;
  }
}