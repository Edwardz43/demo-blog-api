import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
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
  await app.listen(config.get<number>('port', 3000));
}

bootstrap();
