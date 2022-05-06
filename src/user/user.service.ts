import { Injectable } from '@nestjs/common';
import { CreateUserRequest, User } from './interfaces/interface';
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
}
