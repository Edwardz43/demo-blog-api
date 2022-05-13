import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  @GrpcMethod('UploadService')
  async upload(userId: number, file: Uint16Array) {
    const buf = Buffer.from(file);
    const fileName = await this.store(buf);
    if (!fileName) {
      return {
        success: false,
        message: 'File upload failed',
      };
    }
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
        this.logger.error({
          service: 'upload',
          action: 'upload',
          error: error.message,
          stack: error.stack,
        });
        return false;
      });
    if (!ok) {
      return 'fail';
    }
    const url = this.config.get<string>('UPLOAD_HOST_PREFIX') + fileName;
    return { url };
  }

  async store(image: Buffer): Promise<string> {
    const uniqueId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    const filename = `${uniqueId}.jpeg`;
    const filepath = path.join(__dirname, filename);
    try {
      await fs.writeFileSync(filepath, image);
    } catch (error) {
      this.logger.error({
        service: 'upload',
        action: 'store',
        error: error.message,
        stack: error.stack,
      });
      return null;
    }
    return filename;
  }
}
