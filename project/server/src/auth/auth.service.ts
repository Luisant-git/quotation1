import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    emailOrName: string,
    pass: string,
    concernId: number,
    financialId?: number,
  ): Promise<any> {
    try {
      console.log(`Attempting to validate user: ${emailOrName}, concernId: ${concernId}, financialId: ${financialId}`);
  
      const isEmail = emailOrName.includes('@');
  
      let admin;
      if (isEmail) {
        admin = await this.prisma.admin.findUnique({
          where: {
            email: emailOrName,
            concernId: concernId,
          },
          include: {
            roles: true,
            concern_Master: true,
            finacial_year: true,
          },
        });
      } else {
        admin = await this.prisma.admin.findFirst({
          where: {
            name: emailOrName,
            concernId: concernId,
          },
          include: {
            roles: true,
            concern_Master: true,
            finacial_year: true,
          },
        });
      }
  
      console.log('Found admin:', admin);
  
      if (!admin) {
        console.log('User not found');
        throw new NotFoundException('User not found');
      }
  
      const passwordMatch = await bcrypt.compare(pass, admin.password);
      console.log('Password match:', passwordMatch);
  
      if (!passwordMatch) {
        console.log('Invalid password');
        throw new UnauthorizedException('Invalid password');
      }
  
      if (financialId && admin.financialId !== financialId) {
        console.log(`Financial ID mismatch: user has ${admin.financialId}, requested ${financialId}`);
        throw new BadRequestException(
          'User not associated with this financial year',
        );
      }
  
      const { password, ...result } = admin;
      result.financialId = admin.financialId;
      return result;
    } catch (error) {
      console.error('Error in validateUser:', error);
      throw error;
    }
  }
  
  async login(admin: any) {
    try {
      console.log('Logging in admin:', admin);
      const payload = {
        email: admin.email,
        name: admin.name,
        sub: admin.adminId,
        concernId: admin.concernId,
        financialId: admin.financialId,
        roleId: admin.roles.map((role) => role.roleId),
        roles: admin.roles.map((role) => role.name),
        concernName: admin.concern_Master?.Concern_Name,
      };
  
      console.log('JWT payload:', payload);
  
      const token = this.jwtService.sign(payload);
      console.log('Generated token:', token);
  
      return {
        access_token: token,
      };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  async register(
    email: string,
    password: string,
    roles: string[],
    concernId: number,
    name: string,
    financialId?: number, // Add financialId parameter
  ) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const existingRoles = await this.prisma.role.findMany({
      where: {
        roleId: {
          in: roles.map((roleId) => parseInt(roleId)),
        },
      },
    });

    if (existingRoles.length !== roles.length) {
      throw new BadRequestException('One or more roles do not exist');
    }

    if (financialId) {
      const financialYear = await this.prisma.financialYear.findUnique({
        where: { HeaderId: financialId },
      });
      if (!financialYear) {
        throw new BadRequestException('Financial year does not exist');
      }
    }

    // Debugging: Log financialId before saving
    console.log('Saving admin with financialId:', financialId);

    const admin = await this.prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        concernId,
        name,
        financialId, // Ensure financialId is saved in the database
        roles: {
          connect: existingRoles.map((role) => ({ roleId: role.roleId })),
        },
      },
      include: {
        roles: true,
        finacial_year: true,
      },
    });

    // Debugging: Log the created admin object
    console.log('Created admin:', admin);

    const { password: _, ...result } = admin;
    result.financialId = admin.financialId; // Ensure financialId is included in the result
    return result;
  }
}
