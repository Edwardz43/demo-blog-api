import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PrismaService } from '../prisma.service';
import { PostService } from './post.service';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from '../util/util.service';
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
  providers: [PostService, PrismaService, UtilService, AuthService],
  controllers: [PostController],
  exports: [JwtModule],
})
export class PostModule {}
