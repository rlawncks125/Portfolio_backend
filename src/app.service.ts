import { Injectable } from '@nestjs/common';
import {
  TransformationOptions,
  UploadApiErrorResponse,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import { Readable } from 'stream';
import axios from 'axios';

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
    const s1 = process.env.DB_HOST;
    const s2 = +process.env.DB_PORT;
    const s3 = process.env.DB_ROOT;
    const s4 = process.env.DB_PASSWORD;
    const s5 = process.env.DB_DATABASE;
    const s6 = process.env.DB_TYPE as any;

    return `김주찬 개인 포트폴리오 서버 입니다.222`;
  }

  async uploadClouldnary(
    file: Express.Multer.File,
    transformation?: TransformationOptions,
  ) {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'back-Portfolio',
          transformation: transformation,
        },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(upload);
    }) as Promise<UploadApiResponse | UploadApiErrorResponse>;
  }

  async uploadClouldnaryByfile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return await this.uploadClouldnary(file);
  }

  async uploadClouldnaryThumbnail(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return await this.uploadClouldnary(file, {
      width: 270,
      height: 140,
    });
  }

  async deleteClouldnaryByFileName(fileName: string) {
    if (fileName === '' || !fileName) return;

    const deleteFoloder = 'back-Portfolio';
    const deleteImageUrl = `${deleteFoloder}/${fileName}`;

    const ds = await v2.api.delete_resources_by_prefix(
      deleteImageUrl,
      (err, result) => {},
    );
    return ds;
  }

  async deleteShopItemImageByHtml(html: string) {
    const splits = html.split('back-Portfolio/');

    const deleteFileList = [];
    splits.forEach((v, index) => {
      if (index === 0) {
        return;
      }

      const fileName = v.split(`.jpg\"`)[0];
      deleteFileList.push(this.deleteClouldnaryByFileName(fileName));
    });

    Promise.all(deleteFileList).then((v) => {
      // 이미지 삭제 결과
      // console.log(v);
    });
  }

  async getFiels() {
    return v2.search
      .expression('folder=back-Portfolio')
      .max_results(5)
      .execute();
  }
}
