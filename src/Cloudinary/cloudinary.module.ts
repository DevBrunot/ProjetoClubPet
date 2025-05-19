// src/Cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CloudinaryService],
  exports: [CloudinaryService], // <-- ESSENCIAL
})
export class CloudinaryModule {}