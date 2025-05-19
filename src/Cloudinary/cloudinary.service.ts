import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  constructor(private readonly httpService: HttpService) {}

  async uploadImage(filePath: string): Promise<string> {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('upload_preset', 'clubpet_upload'); // configure no Cloudinary
    const cloudName = 'dvdlyluya';

    const response = await lastValueFrom(
      this.httpService.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        form,
        { headers: form.getHeaders() }
      )
    );

    return response.data.secure_url;
  }
}
