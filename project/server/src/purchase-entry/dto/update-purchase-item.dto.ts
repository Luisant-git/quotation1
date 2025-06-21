import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsNumber, IsDecimal, IsDate } from 'class-validator';

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
