import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email or username of the admin',
    example: 'admin@example.com or myusername',
  })
  @IsNotEmpty()
  emailOrName: string;

  @ApiProperty({
    description: 'Password of the admin',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Concern ID of the admin',
    example: 1,
  })
  @IsNumber()
  concernId: number;
  @ApiProperty({
    description: 'Financial year ID of the admin',
    example: 1,
  })
  @IsNumber()
  financialId?: number;
}
