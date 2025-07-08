import {
  IsInt,
  IsOptional,
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateSaleItemDto } from './update-sale-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSaleEntryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  BillNo?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  BillDate?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  customername?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  Mobile?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  Remarks?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  TotalQty?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  TotalAmount?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  TotalPaidAmount?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  CardAmount?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  UPIAmount?: number;

  @ApiProperty({ description: 'createdBy', required: true, default: 0 })
  @IsOptional()
  @IsNumber()
  createdBy: number;

  @ApiProperty({ description: 'updatedBy', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  updatedBy?: number;

  @ApiProperty({ description: 'deletedBy', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  deletedBy?: number;

    @ApiProperty({ description: 'Delete_Flg', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  Delete_Flg?: number;

    @ApiProperty({ description: 'FinancialYearId', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  FinancialYearId?: number;

  @ApiProperty({ type: [UpdateSaleItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSaleItemDto)
  saleItems?: UpdateSaleItemDto[];
}