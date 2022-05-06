import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginRequest } from './interfaces/interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequest) {
    return this.service.login(data);
  }
}
