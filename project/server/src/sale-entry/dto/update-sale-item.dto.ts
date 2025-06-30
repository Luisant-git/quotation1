import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class UpdateSaleItemDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  Item_Id?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  Qty?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  MRP?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  Rate?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  Amount?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  DiscType?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  DiscPercent?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  DiscAmount?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  GSTAmount?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  HSNCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  GSTPercent?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  NetAmount?: number;

  @ApiProperty({
    example: '2024-03-16T12:00:00Z',
    description: 'Timestamp of creation',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-16T14:00:00Z',
    description: 'Timestamp of last update',
  })
  @IsDate()
  updatedAt: Date;

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
}
