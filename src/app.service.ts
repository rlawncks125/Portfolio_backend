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

  async getSubWaySchedule(res: Response, type: SubWayType, station: string) {
    const fs = require('fs');
    const folderPath = `${__dirname}/../src/assets/subwaySchedule`;
    let readPath = `${folderPath}/`;

    readPath += ESubway[type];

    fs.readFile(readPath, 'utf-8', (err: any, data: string) => {
      if (data) {
        let times;
        switch (type) {
          case 'incheon1up':
          case 'incheon1down':
            times = incheonOneTimes(data, station);

            break;

          default:
            times = null;
            break;
        }

        res.send(times);
      } else {
        res.send(err);
      }
    });
  }
}
export type SubWayType = keyof typeof ESubway;
enum ESubway {
  'incheon1up' = '인천1호선 평일 상선.json',
  'incheon1down' = '인천1호선 평일 하선.json',
  'incheon2up' = '인천2호선 평일 상선.json',
  'incheon2down' = '인천2호선 평일 하선.json',
}

// 인천 1호선
export const incheonOneTimes = (data: string, station: string) => {
  // 상선 국제업무지구(시발 역) 도착 x
  // 하선 계양(시발 역) 도착x
  return data
    .split('{')
    .filter((v) => v.split('\n')[1].includes(`${station} 도착`))[0]
    .split('\n')
    .map((v) => {
      const timeString = v.split(`":`)[1];

      if (!timeString) {
        return null;
      }

      const timeLine = timeString.split(`\"`)[1];
      if (!timeLine) {
        return null;
      }

      return timeLine;
    })
    .filter((v) => v !== null);
};

// 인천 2호선
export const IncheonTwoTimes = (data: string, station: string) => {
  return `2호선 ${station} 작업중`;
};
