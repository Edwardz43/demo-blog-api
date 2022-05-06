import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { UtilService } from './util/util.service';
import { UtilModule } from './util/util.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [UserModule, UtilModule, AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService, UserService, PrismaService, UtilService, AuthService],
})
export class AppModule {}
