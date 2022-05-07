import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { UtilService } from '../util/util.service';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

const jwtConstants = {
  secret: 'secretKey',
};

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, UtilService, AuthService],
  exports: [JwtModule],
})
export class UserModule {}
