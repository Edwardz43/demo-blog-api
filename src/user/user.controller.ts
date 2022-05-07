import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateUserRequest,
  DeleteUserRequest,
  DeleteUserResponse,
  FindUserByEmailRequest,
  FindUserByIdRequest,
  UpdateUserRequest,
  UpdateUserResponse,
  User,
} from './interfaces/interface';
import { UserService } from './user.service';
import {} from '../auth/interfaces/interface';

@Controller('user')
export class UserController {
  private service: UserService;
  constructor(service: UserService) {
    this.service = service;
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

  @GrpcMethod('UserService')
  async update(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    return this.service.update({
      where: { id: data.id },
      data: data,
    });
  }

  @GrpcMethod('UserService')
  async delete(data: DeleteUserRequest): Promise<DeleteUserResponse> {
    return this.service.delete(data);
  }
}
