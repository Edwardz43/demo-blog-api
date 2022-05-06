import { Injectable } from '@nestjs/common';
import {
  CreateUserRequest,
  FindUserByEmailRequest,
  FindUserByIdRequest,
  User,
} from './interfaces/interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateUserRequest): Promise<User | null> {
    const user = await this.prisma.user
      .create({
        data,
      })
      .then((user) => user)
      .catch((_) => null);
    return user;
  }

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

  async findByEmail(data: FindUserByEmailRequest): Promise<User | null> {
    const res = await this.prisma.user
      .findFirst({
        where: {
          email: data.email,
        },
      })
      .then((user) => user);
    return res;
  }
}
