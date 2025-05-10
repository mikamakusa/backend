import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateOAuthLogin(
    provider: string,
    providerId: string,
    email: string,
    name?: string,
  ) {
    let user = await this.prisma.user.findFirst({
      where: { provider, providerId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { provider, providerId, email, name },
      });
    }

    return user;
  }
}
