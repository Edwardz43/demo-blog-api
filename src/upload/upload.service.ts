import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma.service';

const urlPrefix = 'http://localhost:3000/upload/';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}
  @GrpcMethod('UploadService')
  async upload(userId: number, file: any) {
    const buf = Buffer.from(file);
    const fileName = await this.store(buf);
    const ok = await this.prisma.profile
      .update({
        data: {
          avatar: fileName,
        },
        where: {
          userId,
        },
      })
      .catch((error) => {
        console.error(error.message);
        return false;
      });
    if (!ok) {
      return 'fail';
    }
    const url = urlPrefix + fileName;
    return { url };
  }

  async store(image: Buffer): Promise<string> {
    const uniqueId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    const filename = `${uniqueId}.jpeg`;
    const filepath = path.join(__dirname, filename);
    await fs.writeFileSync(filepath, image);
    return filename;
  }
}
