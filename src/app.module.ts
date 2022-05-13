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
import { PostModule } from './post/post.module';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

@Module({
  imports: [
    UserModule,
    UtilModule,
    AuthModule,
    PostModule,
    UploadModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: format.combine(format.timestamp(), format.json()),
      transports: ['debug', 'info', 'warn', 'error'].map(
        (level) =>
          new transports.File({
            dirname: join(__dirname, `./../log/${level}/`),
            filename: `${level}.log`,
            level,
          }),
      ),
    }),
  ],
  controllers: [AppController, AuthController, UploadController],
  providers: [
    AppService,
    UserService,
    PrismaService,
    UtilService,
    AuthService,
    UploadService,
  ],
})
export class AppModule {}
