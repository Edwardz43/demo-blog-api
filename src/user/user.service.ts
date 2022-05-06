import { Injectable } from '@nestjs/common';
import { CreateUserRequest, User } from './interfaces/interface';

@Injectable()
export class UserService {
  private readonly users: User[] = [];
  async create(data: CreateUserRequest): Promise<User> {
    const user = {
      id: 1,
      name: data.name,
      email: data.email,
    };
    this.users.push(user);
    return user;
  }
}
