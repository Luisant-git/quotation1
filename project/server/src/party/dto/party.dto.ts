import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsEmail, IsNumber } from 'class-validator';

export class CreatePartyDto {
  @ApiProperty({ description: 'Primary key: Party code', required: false })
  @IsOptional()
  @IsInt()
  ptycode?: number;

  @ApiProperty({ description: 'Party name', required: true })
  @IsString()
  Ptyname: string;

  @ApiProperty({ description: 'Address Line 1', required: true })
  @IsString()
  Add1: string;

  @ApiProperty({ description: 'Address Line 2', required: false })
  @IsOptional()
  @IsString()
  Add2?: string;

  @ApiProperty({ description: 'Address Line 3', required: false })
  @IsOptional()
  @IsString()
  Add3?: string;

  @ApiProperty({ description: 'Address Line 4', required: false })
  @IsOptional()
  @IsString()
  Add4?: string;

  @ApiProperty({ description: 'District', required: true })
  @IsString()
  District: string;

  @ApiProperty({ description: 'State', required: true })
  @IsString()
  State: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  Phone1?: string;

  @ApiProperty({ description: 'Mobile number', required: true })
  @IsString()
  Mobile: string;

  @ApiProperty({ description: 'Fax number', required: false })
  @IsOptional()
  @IsString()
  Fax?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  E_mail?: string;

  @ApiProperty({ description: 'PAN number', required: false })
  @IsOptional()
  @IsString()
  Panno?: string;

  @ApiProperty({ description: 'Deletion flag', required: false })
  @IsOptional()
  @IsInt()
  Delete_flg?: number;

  @ApiProperty({ description: 'Is running', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  IsRunning?: number;

  @ApiProperty({ description: 'Tally account name', required: false })
  @IsOptional()
  @IsString()
  TallyAccName?: string;


  @ApiProperty({ description: 'Marketing person', required: false })
  @IsOptional()
  @IsString()
  MarketPerson?: string;

  @ApiProperty({ description: 'Marketing contact', required: false })
  @IsOptional()
  @IsString()
  MarketContact?: string;

  @ApiProperty({ description: 'Is export', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  IsExport?: number;

  @ApiProperty({ description: 'Is cash party', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  IsCashParty?: number;

  @ApiProperty({ description: 'State ID (Foreign Key)', required: false })
  @IsOptional()
  @IsInt()
  State_id?: number;

  @ApiProperty({ description: 'GST number', required: false })
  @IsOptional()
  @IsString()
  GSTNO?: string;

  @ApiProperty({ description: 'Is regular party', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  IsRegular?: number;

  @ApiProperty({ description: 'Bank name', required: false })
  @IsOptional()
  @IsString()
  BankName?: string;

  @ApiProperty({ description: 'Bank account number', required: false })
  @IsOptional()
  @IsString()
  AccountNo?: string;

  @ApiProperty({ description: 'IFSC code', required: false })
  @IsOptional()
  @IsString()
  IFSC?: string;

  @ApiProperty({ description: 'Party code', required: false })
  @IsOptional()
  @IsString()
  PartyCode?: string;

  @ApiProperty({ description: 'Account name', required: false })
  @IsOptional()
  @IsString()
  AccountName?: string;

  @ApiProperty({ description: 'Branch name', required: false })
  @IsOptional()
  @IsString()
  Branch?: string;

  @ApiProperty({ description: 'Credit days', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  CreditDays?: number;

  @ApiProperty({ description: 'Pincode', required: false, default: '' })
  @IsOptional()
  @IsString()
  Pincode?: string;

  @ApiProperty({ description: 'Distance', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  Distance?: number;

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
  @ApiProperty({ description: 'deletedBy', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  concernId?: number;
}
