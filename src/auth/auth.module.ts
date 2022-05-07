import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { UtilService } from '../util/util.service';
import { AuthService } from "./auth.service";

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
  providers: [UserService, PrismaService, UtilService, AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
