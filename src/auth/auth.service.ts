import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './interfaces/interface';
import { UtilService } from '../util/util.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly UtilService: UtilService,
    private readonly prisma: PrismaService,
  ) {}

  async register(data: RegisterRequest): Promise<RegisterResponse | null> {
    const hash = await this.UtilService.encryptPassword(data.password);
    data.password = hash;
    const user = await this.prisma.user
      .create({
        data,
      })
      .then((user) => user)
      .catch((_) => null);
    return user;
  }
  async login(data: LoginRequest): Promise<LoginResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
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
