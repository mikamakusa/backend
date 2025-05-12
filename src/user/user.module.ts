import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RolesGuard } from './roles.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [RolesGuard],
})
export class UserModule {}
