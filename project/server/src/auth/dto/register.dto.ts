import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'infinite' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123123' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'admin' })
  @IsNumber()
  @IsNotEmpty()
  concernId: number;

  @ApiProperty({
    description: 'Financial year ID of the admin',
    example: 1,
  })
  @IsNumber()
  financialId?: number;

  @ApiProperty({ example: ['1', '2'] })
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  constructor() {
    this.roles = ['Employee'];
  }
}
