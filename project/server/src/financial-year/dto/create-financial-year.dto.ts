// src/financial-year/dto/create-financial-year.dto.ts
import { IsString, IsDateString, IsOptional, IsInt, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFinancialYearDto {
  @ApiProperty({
    example: 'FY2023-24',
    description: 'Unique identifier for the financial year (e.g., FY2023-24)',
  })
  @IsString()
  YearId: string;

  @ApiProperty({
    example: '2023-04-01',
    description: 'Start date of financial year (must be April 1)',
  })
  @IsDateString()
  Date_From: string;

  @ApiProperty({
    example: '2024-03-31',
    description: 'End date of financial year (must be March 31)',
  })
  @IsDateString()
  Date_To: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Whether this year is active (1) or not (0)',
    enum: [0, 1],
    default: 0,
  })
  @IsOptional()
  @IsIn([0, 1])
  IsRunning?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of user creating this record',
  })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}