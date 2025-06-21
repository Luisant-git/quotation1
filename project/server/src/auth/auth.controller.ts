import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register.dto';
import { UserAuditInterceptor } from 'src/interceptor/user-audit.interceptor';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('Login request received:', loginDto);
      const admin = await this.authService.validateUser(
        loginDto.emailOrName,
        loginDto.password,
        loginDto.concernId,
        loginDto.financialId 
      );
      return this.authService.login(admin);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error; // Let the original error propagate
    }
  }

  @Post('register')
  @UseInterceptors(UserAuditInterceptor)
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterAdminDto) {
    if (!Array.isArray(registerDto.roles)) {
      throw new BadRequestException('Roles must be an array');
    }
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.roles,
      registerDto.concernId,
      registerDto.name,
      registerDto.financialId 
    );
  }
}