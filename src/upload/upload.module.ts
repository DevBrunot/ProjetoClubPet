// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryModule } from '../Cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [CloudinaryModule,MulterModule.register({})],
  controllers: [UploadController],
})
export class UploadModule {}
