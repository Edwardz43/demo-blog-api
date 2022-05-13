import { Inject, Injectable, LoggerService } from '@nestjs/common';
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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly utilService: UtilService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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
      .catch((err: Error) => {
        console.log(err);
        this.logger.error({
          service: 'auth',
          action: 'register',
          error: err.message,
          stack: err.stack,
        });
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
      this.logger.log({
        service: 'auth',
        action: 'login',
        message: 'user not found',
        user: data.email,
      });
      return {
        token: null,
      };
    }
    const ok = await this.utilService.comparePassword(
      data.password,
      user.password,
    );
    if (!ok) {
      this.logger.log({
        service: 'auth',
        action: 'login',
        message: 'password not match',
        user: data.email,
      });
      return {
        token: null,
      };
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
