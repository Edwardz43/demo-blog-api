import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateUserRequest,
  FindUserByEmailRequest,
  FindUserByIdRequest,
  User,
} from './interfaces/interface';
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
  @GrpcMethod('UserService')
  async findById(data: FindUserByIdRequest): Promise<User> {
    return this.service.findById(data);
  }
  @GrpcMethod('UserService')
  async findByEmail(data: FindUserByEmailRequest): Promise<User> {
    return this.service.findByEmail(data);
  }
}
