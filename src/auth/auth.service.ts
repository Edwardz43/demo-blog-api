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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly utilService: UtilService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    data.password = await this.utilService.encryptPassword(data.password);
    return await this.prisma.user
      .create({
        data: {
          email: data.email,
          password: data.password,
          name: data.name,
          profile: {
            create: {},
          },
        },
      })
      .then((user) => user)
      .catch((err) => {
        console.log(err);
        return {
          id: -1,
        };
      });
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
    const ok = await this.utilService.comparePassword(
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

  /**
   * user token validation
   */
  async validateToken(email: string, token: string): Promise<any> {
    const userData = this.jwtService.verify(token, {
      secret: this.config.get('JWT_SECRET'),
    });
    return userData['email'] === email;
  }
}
