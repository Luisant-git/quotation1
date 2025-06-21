import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe' })
  customername?: string;

  @ApiProperty({ example: '123 Main St' })
  Address?: string;

  @ApiProperty({ example: '9876543210',required: true })
  Mobile?: string;

    @ApiProperty({ description: 'createdBy', required: false, default: 0 })
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

    @ApiProperty({ description: 'flag delete', required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    Delete_Flg?: number;
}