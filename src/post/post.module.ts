import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PrismaService } from '../prisma.service';
import { PostService } from './post.service';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from '../util/util.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [PostService, PrismaService, UtilService, AuthService],
  controllers: [PostController],
  exports: [JwtModule],
})
export class PostModule {}
