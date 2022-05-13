import { Body, Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  DeleteUserRequest,
  DeleteUserResponse,
  FindUserByEmailRequest,
  FindUserByIdRequest,
  UpdateUserRequest,
  UpdateUserResponse,
  User,
} from './interfaces/interface';
import { PrismaService } from '../prisma.service';
import { AuthService } from '../auth/auth.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async findById(data: FindUserByIdRequest): Promise<User | null> {
    return await this.prisma.user
      .findFirst({
        where: {
          id: data.id,
        },
      })
      .then((user) => user);
  }

  async findByEmail(
    data: FindUserByEmailRequest,
    includePassword = false,
  ): Promise<User | null> {
    return await this.prisma.user
      .findFirst({
        select: {
          id: true,
          email: true,
          name: true,
          password: includePassword,
        },
        where: {
          email: data.email,
        },
      })
      .then((user) => user);
  }
  async update(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    const message = await this.prisma.user
      .update({
        data: {
          name: data.user.name,
          email: data.user.email,
          profile: {
            update: {
              age: data.profile.age,
              phone: data.profile.phone,
              address: data.profile.address,
              birthday: new Date(data.profile.birthday),
              updatedAt: new Date(),
            },
          },
        },
        include: {
          profile: true,
        },
        where: {
          id: data.user.id,
        },
      })
      .then((user) => (user ? 'ok' : 'fail'))
      .catch((error: Error) => {
        this.logger.error({
          service: 'user',
          action: 'update',
          error: error.message,
          stack: error.stack,
          data: data,
        });
        return 'fail';
      });
    return { message };
  }

  async delete(@Body() data: DeleteUserRequest): Promise<DeleteUserResponse> {
    const isValid = await this.authService.validateToken(
      data.email,
      data.token,
    );
    if (!isValid) {
      return { message: 'invalid input info' };
    }
    const user = await this.prisma.user
      .findFirst({
        where: {
          email: data.email,
        },
      })
      .then((user) => user);
    if (!user) {
      return { message: 'user not found' };
    }
    const message = await this.prisma.user
      .delete({
        where: {
          email: data.email,
        },
      })
      .then((_) => 'ok')
      .catch((error) => {
        this.logger.error({
          service: 'user',
          action: 'update',
          error: error.message,
          stack: error.stack,
          data: data,
        });
        return error.message;
      });
    return { message };
  }
}
