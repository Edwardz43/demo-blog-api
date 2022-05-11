import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

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
    url: '0.0.0.0:50001',
  },
};
