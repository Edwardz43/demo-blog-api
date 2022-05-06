import { Injectable } from "@nestjs/common";
import {
  CreateUserRequest,
  FindUserByEmailRequest,
  FindUserByIdRequest,
  UpdateUserResponse,
  User
} from "./interfaces/interface";
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";

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
}
