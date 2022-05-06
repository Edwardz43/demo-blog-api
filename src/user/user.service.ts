import { Injectable } from '@nestjs/common';
import {
  CreateUserRequest,
  FindUserByEmailRequest,
  FindUserByIdRequest,
  UpdateUserResponse,
  User,
} from './interfaces/interface';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import * as bcrypt from 'bcrypt';
import { promisify } from 'util';

const iv = randomBytes(16);
const saltOrRounds = 10;

async function encryptPassword(data: CreateUserRequest) {
  const key = (await promisify(scrypt)(data.password, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const textToEncrypt = 'Nest';
  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);
  const hash = await bcrypt.hash(encryptedText.toString('hex'), saltOrRounds);
  return hash;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateUserRequest): Promise<User | null> {
    const hash = await encryptPassword(data);
    data.password = hash;
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
