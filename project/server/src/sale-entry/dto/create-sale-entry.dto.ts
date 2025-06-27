import { IsInt, IsOptional, IsString, IsDate, IsDecimal, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSaleItemDto } from './create-sale-item.dto';

export class CreateSaleEntryDto {
  @ApiProperty({ example: 'BILL-12345', description: 'Unique bill number' })
  @IsString()
  BillNo: string;

  @ApiProperty({ example: '2024-03-16T12:00:00Z', description: 'Bill date' })
  @IsString()
  BillDate: string;

  @ApiProperty({ example: 1, description: 'Customer ID', required: false })
  @IsOptional()
  @IsInt()
  customerId?: number;

  @ApiProperty({ example: 100.0, description: 'Maximum Retail Price (MRP)' })
  @IsDecimal()
  MRP: number;

  @ApiProperty({ example: 'Regular customer purchase', description: 'Remarks' })
  @IsString()
  Remarks: string;

  @ApiProperty({ example: 5, description: 'Total quantity of items' })
  @IsDecimal()
  TotalQty: number;

  @ApiProperty({ example: 500.0, description: 'Total bill amount' })
  @IsDecimal()
  TotalAmount: number;

  @ApiProperty({ example: 100.0, description: 'Amount paid via card' })
  @IsDecimal()
  CardAmount: number;

  @ApiProperty({ example: 50.0, description: 'Amount paid via UPI' })
  @IsDecimal()
  UPIAmount: number;

  @ApiProperty({ example: 150.0, description: 'Total amount paid' })
  @IsDecimal()
  TotalPaidAmount: number;

  @ApiProperty({ example: 0, description: 'Deletion flag (0 = Active, 1 = Deleted)' })
  @IsInt()
  Delete_Flg: number;


  @ApiProperty({ example: '2024-03-16T12:00:00Z', description: 'Creation date' })
  @IsDate()
  @Type(() => Date)
  CreatedDate: Date;

  @ApiProperty({ example: 'adminUser', description: 'User who modified the entry', required: false })
  @IsOptional()
  @IsString()
  ModifiedBy?: string;

  @ApiProperty({ example: '2024-03-16T14:00:00Z', description: 'Modification date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ModifiedDate?: Date;

  @ApiProperty({ description: 'createdBy', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  createdBy: number;
  @ApiProperty({ description: 'updatedBy', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  updatedBy?: number;
  
  @ApiProperty({ example: 1, description: 'Concern ID' })
@IsInt()
concernId: number;


  @ApiProperty({ description: 'deletedBy', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  deletedBy?: number;

  @ApiProperty({ example: '2024-03-17T10:00:00Z', description: 'Deletion date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DeletedDate?: Date;

  @ApiProperty({ type: [CreateSaleItemDto], description: 'List of sale items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  saleItems: CreateSaleItemDto[];
}
