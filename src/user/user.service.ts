import { Body, Injectable } from '@nestjs/common';
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
import { Prisma } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { async } from 'rxjs';

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
        console.log(error.message);
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
      .catch((error) => error.message);
    return { message };
  }
}
