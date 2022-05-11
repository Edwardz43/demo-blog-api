import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['user', 'auth', 'post', 'upload'],
    protoPath: [
      join(__dirname, './user/user.proto'),
      join(__dirname, './auth/auth.proto'),
      join(__dirname, './post/post.proto'),
      join(__dirname, './upload/upload.proto'),
    ],
    url: config.get<string>('MICROSERVICE_URL', '0.0.0.0:50001'),
  },
};
