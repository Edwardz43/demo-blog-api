import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const saltOrRounds = 10;

@Injectable()
export class UtilService {
  async encryptPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
