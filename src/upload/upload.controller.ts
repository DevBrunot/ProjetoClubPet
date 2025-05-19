// src/upload/upload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';

import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const tempPath = `./uploads/${file.originalname}`;
    await fs.promises.writeFile(tempPath, file.buffer);

    const imageUrl = await this.cloudinaryService.uploadImage(tempPath);
    await fs.promises.unlink(tempPath); // limpa o arquivo temporário

    return { imageUrl };
  }
}