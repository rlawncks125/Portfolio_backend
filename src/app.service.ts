import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Response } from 'express';
import { Readable } from 'stream';

@Injectable()
export class AppService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  getHello(): string {
    return 'Hello World!aassddww';
  }

  async uploadClouldnaryByfile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const clouldUpload = new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'back-Portfolio',
        },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(upload);
    }) as Promise<UploadApiResponse | UploadApiErrorResponse>;

    return clouldUpload;
  }

  async deleteClouldnaryByFileName(fileName: string) {
    const deleteFoloder = 'back-Portfolio';
    const deleteImageUrl = `${deleteFoloder}/${fileName}`;

    const ds = await v2.api.delete_resources_by_prefix(
      deleteImageUrl,
      (err, result) => {},
    );
    return ds;
  }

  async getFiels() {
    return v2.search
      .expression('folder=back-Portfolio')
      .max_results(5)
      .execute();
  }
}
