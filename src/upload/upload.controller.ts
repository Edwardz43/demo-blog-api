import { Controller, Get, Param, Res } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UploadService } from './upload.service';
import { join } from 'path';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @GrpcMethod('UploadService', 'Upload')
  async upload(data: any) {
    return await this.uploadService.upload(data.userId, data.file);
  }

  @Get('/:filename')
  async getFile(@Param('filename') filename: string, @Res() res: any) {
    res.sendFile(filename, { root: join(__dirname, '/') });
  }
}
