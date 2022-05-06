import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { UtilService } from './util/util.service';
import { UtilModule } from './util/util.module';

@Module({
  imports: [UserModule, UtilModule],
  controllers: [AppController],
  providers: [AppService, UserService, PrismaService, UtilService],
})
export class AppModule {}
