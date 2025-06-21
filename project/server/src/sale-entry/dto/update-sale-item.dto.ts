import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSaleItemDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsNumber()
  gstAmount?: number;

  @IsOptional()
  @IsNumber()
  netAmount?: number;

  @IsOptional()
  @IsNumber()
  discAmount?: number;

  @IsOptional()
  @IsNumber()
  taxableAmount?: number;

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
  @IsInt()
  qty?: number;

  @IsOptional()
  @IsNumber()
  mrp?: number;

  @IsOptional()
  @IsNumber()
  diskPersentage?: number;

  @IsOptional()
  @IsNumber()
  saleRate?: number;

  @IsOptional()
  @IsString()
  discType?: string;

  @IsOptional()
  @IsString()
  itemCode?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  itemName?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  hsnCode?: string;

  @IsOptional()
  @IsNumber()
  gstPercent?: number;
}
