import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { AdsModule } from './ads/ads.module';
//import { RolesGuard } from './user/roles.guard';

@Module({
  imports: [PrismaModule, UserModule, MediaModule, AdsModule],
})
export class AppModule {}
