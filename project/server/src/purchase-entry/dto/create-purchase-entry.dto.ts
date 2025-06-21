import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDate, IsDecimal, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseItemDto } from './create-purchase-item.dto'

export class CreatePurchaseEntryDto {
  @ApiProperty({ example: 'REF-12345', description: 'Reference number for purchase entry' })
  @IsString()
  RefNo: string;

  @ApiProperty({ example: '2024-03-16T12:00:00Z', description: 'Reference date of purchase' })
  @IsDate()
  RefDate: string;

  @ApiProperty({ example: 1, description: 'Party ID associated with the purchase' })
  @IsInt()
  Party_Id: number;

  @ApiProperty({ example: 'BILL-6789', description: 'Bill number for purchase entry' })
  @IsString()
  BillNo: string;

  @ApiProperty({ example: '2024-03-16', description: 'Bill date in YYYY-MM-DD format' })
  @IsString()
  BillDate: string;

  @ApiProperty({ example: 'Bulk purchase for inventory', description: 'Remarks about purchase' })
  @IsString()
  Remarks: string;

  @ApiProperty({ example: 100, description: 'Total quantity of purchased items' })
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

  @ApiProperty({ example: 100, description: 'Other amount charges in purchase' })
  @IsDecimal()
  OtherAmount: number;

  @ApiProperty({ example: 0, description: 'Flag to mark deletion status' })
  @IsInt()
  Delete_Flg: number;

  @ApiProperty({ example: '2024-03-16T12:00:00Z', description: 'Timestamp of creation' })
  @IsDate()
  CreatedDate: Date;

  @ApiProperty({ example: 'adminUser', description: 'User who modified the entry', required: false })
  @IsOptional()
  @IsString()
  ModifiedBy?: string;

  @ApiProperty({ example: '2024-03-16T14:00:00Z', description: 'Timestamp of last modification', required: false })
  @IsOptional()
  @IsDate()
  ModifiedDate?: Date;



  @ApiProperty({ example: '2024-03-17T10:00:00Z', description: 'Timestamp of deletion', required: false })
  @IsOptional()
  @IsDate()
  DeletedDate?: Date;

  @ApiProperty({ example: 5400, description: 'Net amount after all calculations' })
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

  @ApiProperty({ type: [CreatePurchaseItemDto], description: 'List of purchase items' })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  PurchaseItems: CreatePurchaseItemDto[];
}
