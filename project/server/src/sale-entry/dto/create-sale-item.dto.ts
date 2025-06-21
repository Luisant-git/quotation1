import { IsInt, IsDecimal, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleItemDto {
  @ApiProperty({ example: 1, description: 'ID of the item' })
  @IsInt()
  Item_Id: number;

  @ApiProperty({ example: 2, description: 'Quantity of the item' })
  @IsDecimal()
  Qty: number;

  @ApiProperty({ example: 100.0, description: 'Maximum Retail Price (MRP)' })
  @IsDecimal()
  MRP: number;

  @ApiProperty({ example: 90.0, description: 'Selling price per unit' })
  @IsDecimal()
  Rate: number;

  @ApiProperty({ example: 180.0, description: 'Total amount (Qty * Rate)' })
  @IsDecimal()
  Amount: number;

  @ApiProperty({ example: 'Percentage', description: 'Discount type (Percentage/Flat)' })
  @IsString()
  DiscType: string;

  @ApiProperty({ example: 10.0, description: 'Discount percentage' })
  @IsDecimal()
  DiscPercent: number;

  @ApiProperty({ example: 18.0, description: 'Discount amount' })
  @IsDecimal()
  DiscAmount: number;

  @ApiProperty({ example: 18.0, description: 'GST amount applied' })
  @IsDecimal()
  GSTAmount: number;

  @ApiProperty({ example: '123456', description: 'HSN Code for the item' })
  @IsString()
  HSNCode: string;

  @ApiProperty({ example: 18.0, description: 'GST percentage' })
  @IsDecimal()
  GSTPercent: number;

  @ApiProperty({ example: 162.0, description: 'Net amount after discounts and GST' })
  @IsDecimal()
  NetAmount: number;

  @ApiProperty({ example: 1, description: 'Associated SaleEntry ID' })
  @IsInt()
  saleEntryId: number;
}
