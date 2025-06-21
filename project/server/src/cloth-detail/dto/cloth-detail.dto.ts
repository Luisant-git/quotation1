import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsNumber } from 'class-validator';

export class CreateClothDetailDto {
  @ApiProperty({ description: 'Header ID', required: true })
  @IsInt()
  HeaderId: number;

  @ApiProperty({ description: 'Dia ID', required: false })
  @IsOptional()
  @IsInt()
  Dia_Id?: number;

  @ApiProperty({ description: 'Cloth Description ID', required: false })
  @IsOptional()
  @IsInt()
  ClothDesc_Id?: number;

  @ApiProperty({ description: 'UOM ID', required: false })
  @IsOptional()
  @IsInt()
  Uom_Id?: number;

  @ApiProperty({ description: 'combo', required: false })
  @IsOptional()
  @IsString()
  combo?: string;
  @ApiProperty({ description: 'clothdes', required: false })
  @IsOptional()
  @IsString()
  clothdes?: string;

  @ApiProperty({ description: '1231', required: false })
  @IsOptional()
  @IsString()
  count?: string;

  @ApiProperty({ description: 'GSM', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  GSM?: number;

  @ApiProperty({ description: 'LL', required: false })
  @IsOptional()
  @IsString()
  LL?: string;

  @ApiProperty({ description: 'GG', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  GG?: number;

  @ApiProperty({ description: 'Delete Flag', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  Delete_Flg?: number;

  @ApiProperty({ description: 'Remarks', required: false })
  @IsOptional()
  @IsString()
  Remarks?: string;

  @ApiProperty({ description: 'Transaction Type', required: false })
  @IsOptional()
  @IsString()
  Trntype?: string;

  @ApiProperty({ description: 'Color ID', required: false })
  @IsOptional()
  @IsInt()
  Color_id?: number;

  @ApiProperty({ description: 'Rate', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  Rate?: number;

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
  
  @ApiProperty({ description: 'CRate', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  CRate?: number;

  @ApiProperty({ description: 'Sample Rate', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  SampleRate?: number;

  @ApiProperty({ description: 'CSample Rate', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  CSampleRate?: number;
  DetailId: any;
}
