import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_secret_key', // Use a proper secret key in production
    });
  }

  async validate(payload: any) {
    const admin = await this.prisma.admin.findUnique({ where: { adminId: payload.sub } });
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}