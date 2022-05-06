import { Injectable } from '@nestjs/common';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { CreateUserRequest } from '../user/interfaces/interface';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';

const iv = randomBytes(16);
const saltOrRounds = 10;

@Injectable()
export class UtilService {
  async encryptPassword(password: string): Promise<string> {
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const textToEncrypt = 'Nest';
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);
    const hash = await bcrypt.hash(encryptedText.toString('hex'), saltOrRounds);
    return hash;
  }
}
