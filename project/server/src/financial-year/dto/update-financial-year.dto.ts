// src/financial-year/dto/update-financial-year.dto.ts
import { IsString, IsDateString, IsOptional, IsInt, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFinancialYearDto {
  @ApiPropertyOptional({
    example: 'FY2023-24',
    description: 'Unique identifier for the financial year',
  })
  @IsOptional()
  @IsString()
  YearId?: string;

  @ApiPropertyOptional({
    example: '2023-04-01',
    description: 'Start date of financial year',
  })
  @IsOptional()
  @IsDateString()
  Date_From?: string;

  @ApiPropertyOptional({
    example: '2024-03-31',
    description: 'End date of financial year',
  })
  @IsOptional()
  @IsDateString()
  Date_To?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Set as active (1) or inactive (0)',
    enum: [0, 1],
  })
  @IsOptional()
  @IsIn([0, 1])
  IsRunning?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID of user updating this record',
  })
  @IsOptional()
  @IsInt()
  updatedBy?: number;
}