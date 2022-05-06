import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { UtilService } from '../util/util.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UtilService],
})
export class UserModule {}
