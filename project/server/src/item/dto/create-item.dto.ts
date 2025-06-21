// item-master.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateItemMasterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  category?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5)
  Cate_AliasName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  itemName?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5)
  Item_AliasName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  color?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5)
  Color_AliasName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5)
  Size_AliasName?: string;

  @ApiProperty()
  @IsBoolean()
  active?: boolean;

  @ApiProperty()
  @IsString()
  @MaxLength(8)
  hsnCode: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  gstPercent: number;

  @ApiProperty()
  @IsInt()
  IsRunning: number;

  @ApiProperty()
  @IsInt()
  Delete_flg: number;

  @ApiProperty()
  @IsInt()
  createdBy: number;
}