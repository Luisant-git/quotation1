import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateConcernMasterDto {
  @ApiProperty({ example: 'ABC Pvt Ltd' })
  @IsString()
  Concern_Name: string;

  @ApiProperty({ example: 'ABC Private Limited' })
  @IsString()
  LegalName: string;

  @ApiProperty({ example: '123 Street, City, State, Country' })
  @IsString()
  Address: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  MobileNo: string;

  @ApiProperty({ example: '044-12345678' })
  @IsString()
  PhoneNo: string;

  @ApiProperty({ example: 'contact@abc.com' })
  @IsString()
  EmailId: string;

  @ApiProperty({ example: '29ABCDE1234F1Z5' })
  @IsString()
  GSTNo: string;

  @ApiProperty({ example: 'ABCDE1234F' })
  @IsString()
  PanNo: string;

  @ApiProperty({ example: 'Tamil Nadu' })
  @IsString()
  State: string;

  @ApiProperty({ example: 33 })
  @IsInt()
  StateCode: number;

  @ApiProperty({ example: 'State Bank of India' })
  @IsString()
  BankName: string;

  @ApiProperty({ example: '123456789012' })
  @IsString()
  AccountNo: string;

  @ApiProperty({ example: 'Anna Nagar Branch' })
  @IsString()
  Branch: string;

  @ApiProperty({ example: 'SBIN0001234' })
  @IsString()
  IFSCCode: string;

  @ApiProperty({ example: 0, description: '0 - Active, 1 - Deleted' })
  @IsInt()
  Delete_flg: number;

  @ApiProperty({ example: 1, description: '1 - Running, 0 - Not Running' })
  @IsInt()
  IsRunning: number;



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
}
