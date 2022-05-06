import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, LoginResponse } from './interfaces/interface';
import { UserService } from '../user/user.service';
import { UtilService } from '../util/util.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly UtilService: UtilService,
  ) {}
  async login(data: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(
      { email: data.email },
      true,
    );
    if (!user) {
      return null;
    }
    const ok = await this.UtilService.comparePassword(
      data.password,
      user.password,
    );
    if (!ok) {
      return null;
    }
    const payload = { email: data.email, id: user.id, name: user.name };
    const token = this.jwtService.sign(payload);
    return {
      token,
    };
  }
}
