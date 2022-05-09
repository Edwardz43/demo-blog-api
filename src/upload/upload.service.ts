import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}
  @GrpcMethod('UploadService')
  async upload(userId: number, file: any) {
    const buf = Buffer.from(file);
    const fileName = await this.store(buf);
    await this.prisma.profile.update({
      data: {
        avatar: fileName,
      },
      where: {
        userId,
      },
    });
    const url = 'http://localhost:3000/upload/' + fileName;
    return { url };
  }

  async store(image: Buffer): Promise<string> {
    const uniqueId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    const filename = `${uniqueId}-${Date.now()}.jpeg`;
    console.log(filename);
    const filepath = path.join(__dirname, filename);
    await fs.writeFileSync(filepath, image);
    return filename;
  }
}
