import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
//import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest()
    const user = request.user;

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { roles: true },
    });

    const hasRole = dbUser?.roles?.some((role) =>
      requiredRoles.includes(role.name),
    );

    if (!hasRole) throw new ForbiddenException('Insufficient role');

    return true;
  }
}
