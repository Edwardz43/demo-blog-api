import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { UtilService } from '../util/util.service';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      secret: new ConfigService().get('JWT_SECRET'),
      signOptions: {
        expiresIn: new ConfigService().get('JWT_EXPIRED_DURATION'),
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, UtilService, AuthService],
  exports: [JwtModule],
})
export class UserModule {}
