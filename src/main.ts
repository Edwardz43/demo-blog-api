import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['user', 'auth', 'post', 'upload'],
      protoPath: [
        join(__dirname, './user/user.proto'),
        join(__dirname, './auth/auth.proto'),
        join(__dirname, './post/post.proto'),
        join(__dirname, './upload/upload.proto'),
      ],
      url: config.get<string>('MICROSERVICE_URL'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.get<number>('APP_PORT'));
}

bootstrap();
