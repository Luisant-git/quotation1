import {
  IsInt,
  IsOptional,
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
  IsNumber,
  IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePurchaseItemDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: 50, description: 'Quantity of the item' })
  @IsDecimal()
  Qty: number;

  @ApiProperty({ example: 200, description: 'Maximum Retail Price (MRP) per unit' })
  @IsDecimal()
  MRP: number;

  @ApiProperty({ example: 180, description: 'Rate after discount' })
  @IsDecimal()
  Rate: number;

  @ApiProperty({ example: 9000, description: 'Total amount for this item' })
  @IsDecimal()
  Amount: number;

  @ApiProperty({ example: 'Percentage', description: 'Discount type (Fixed/Percentage)' })
  @IsString()
  DiscType: string;

  @ApiProperty({ example: 10, description: 'Discount percentage applied' })
  @IsDecimal()
  DiscPercent: number;

  @ApiProperty({ example: 900, description: 'Total discount amount' })
  @IsDecimal()
  DiscAmount: number;

  @ApiProperty({ example: 1620, description: 'GST amount applied' })
  @IsDecimal()
  GSTAmount: number;

  @ApiProperty({ example: '123456', description: 'HSN code of the item' })
  @IsString()
  HSNCode: string;

  @ApiProperty({ example: 'ABC1234567', description: 'Barcode or QR code number', required: false })
  @IsOptional()
  @IsString()
  bar_qr_code_No?: string;

  @ApiProperty({ example: 18, description: 'GST percentage applied' })
  @IsDecimal()
  GSTPercent: number;

  @ApiProperty({ example: 8100, description: 'Net amount after discount and GST' })
  @IsDecimal()
  NetAmount: number;

  @ApiProperty({ example: '2024-03-16T12:00:00Z', description: 'Timestamp of creation' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: '2024-03-16T14:00:00Z', description: 'Timestamp of last update' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ example: 1001, description: 'User who created the entry' })
  @IsInt()
  createdBy: number;

  @ApiProperty({ example: 1002, description: 'User who updated the entry', required: false })
  @IsOptional()
  @IsInt()
  updatedBy?: number;

  @ApiProperty({ example: 1003, description: 'User who deleted the entry', required: false })
  @IsOptional()
  @IsInt()
  deletedBy?: number;

  @ApiProperty({ example: 101, description: 'Item ID being purchased' })
  @IsInt()
  Item_Id: number;
}

export class UpdatePurchaseEntryDto {
  @ApiProperty({
    example: 'REF-12345',
    description: 'Reference number for purchase entry',
  })
  @IsString()
  RefNo: string;

  @ApiProperty({
    example: '2024-03-16T12:00:00Z',
    description: 'Reference date of purchase',
  })
  @IsDate()
  RefDate: string;

  @ApiProperty({
    example: 1,
    description: 'Party ID associated with the purchase',
  })
  @IsInt()
  Party_Id: number;

  @ApiProperty({
    example: 'BILL-6789',
    description: 'Bill number for purchase entry',
  })
  @IsString()
  BillNo: string;

  @ApiProperty({
    example: '2024-03-16',
    description: 'Bill date in YYYY-MM-DD format',
  })
  @IsString()
  BillDate: string;

  @ApiProperty({
    example: 'Bulk purchase for inventory',
    description: 'Remarks about purchase',
  })
  @IsString()
  Remarks: string;

  @ApiProperty({
    example: 100,
    description: 'Total quantity of purchased items',
  })
  @IsDecimal()
  TotalQty: number;

  @ApiProperty({ example: 5000, description: 'Total amount of purchase' })
  @IsDecimal()
  TotalAmount: number;

  @ApiProperty({ example: 500, description: 'GST amount applied to purchase' })
  @IsDecimal()
  GSTAmount: number;

  @ApiProperty({ example: 'OTHR', description: 'Type of other charges' })
  @IsString()
  OtherType: string;

  @ApiProperty({
    example: 100,
    description: 'Other amount charges in purchase',
  })
  @IsDecimal()
  OtherAmount: number;

  @ApiProperty({ example: 0, description: 'Flag to mark deletion status' })
  @IsInt()
  Delete_Flg: number;

  @ApiProperty({
    example: '2024-03-16T12:00:00Z',
    description: 'Timestamp of creation',
  })
  @IsDate()
  CreatedDate: Date;

  @ApiProperty({
    example: 'adminUser',
    description: 'User who modified the entry',
    required: false,
  })
  @IsOptional()
  @IsString()
  ModifiedBy?: string;

  @ApiProperty({
    example: '2024-03-16T14:00:00Z',
    description: 'Timestamp of last modification',
    required: false,
  })
  @IsOptional()
  @IsDate()
  ModifiedDate?: Date;

  @ApiProperty({
    example: '2024-03-17T10:00:00Z',
    description: 'Timestamp of deletion',
    required: false,
  })
  @IsOptional()
  @IsDate()
  DeletedDate?: Date;

  @ApiProperty({
    example: 5400,
    description: 'Net amount after all calculations',
  })
  @IsDecimal()
  NetAmount: number;

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseItemDto)
  PurchaseItems?: UpdatePurchaseItemDto[];
}