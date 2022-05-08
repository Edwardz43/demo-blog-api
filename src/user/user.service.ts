import { Body, Injectable } from '@nestjs/common';
import {
  DeleteUserRequest,
  DeleteUserResponse,
  FindUserByEmailRequest,
  FindUserByIdRequest,
  UpdateUserResponse,
  User,
} from './interfaces/interface';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async findById(data: FindUserByIdRequest): Promise<User | null> {
    const res = await this.prisma.user
      .findFirst({
        where: {
          id: data.id,
        },
      })
      .then((user) => user);
    return res;
  }

  async findByEmail(
    data: FindUserByEmailRequest,
    includePassword = false,
  ): Promise<User | null> {
    const res = await this.prisma.user
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
    return res;
  }
  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UpdateUserResponse> {
    const { data, where } = params;
    const message = await this.prisma.user
      .update({
        data,
        where,
      })
      .then((user) => (user ? 'ok' : 'fail'))
      .catch((error: Error) => error.message);
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
      .catch((error) => error.message);
    return { message };
  }
}
