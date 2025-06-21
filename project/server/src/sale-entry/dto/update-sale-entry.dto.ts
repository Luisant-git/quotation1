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
  @IsOptional()
  @IsString()
  billNo?: string;

  @IsOptional()
  @IsDate()
  billDate?: string;

  @IsOptional()
  @IsString()
  customerId?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsInt()
  totalQty?: number;

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

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  totalPaidCash?: number;

  @IsOptional()
  @IsNumber()
  cardAmount?: number;

  @IsOptional()
  @IsNumber()
  upiAmount?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSaleItemDto)
  saleItems?: UpdateSaleItemDto[];
}
