import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

@Injectable()
export class UtilService {
  async encryptPassword(password: string, saltRounds = NaN): Promise<string> {
    if (!saltRounds) {
      saltRounds = config.get<number>('SALT_ROUNDS', 10);
    }
    const hash = await bcrypt.hash(password, +saltRounds);
    return hash;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
