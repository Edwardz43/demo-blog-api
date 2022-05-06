import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserRequest, User } from './interfaces/interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private service: UserService;
  constructor(userLogicService: UserService) {
    this.service = userLogicService;
  }
  @GrpcMethod('UserService')
  async create(data: CreateUserRequest): Promise<User> {
    return this.service.create(data);
  }
}
