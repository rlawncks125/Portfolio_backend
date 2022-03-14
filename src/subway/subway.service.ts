import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SubwayService {
  constructor() {}
  //
  async getSubWaySchedule(res: Response, type: SubWayType, station: string) {
    const fs = require('fs');
    const folderPath = `${__dirname}/../../src/assets/subwaySchedule`;
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
          case 'incheon2up':
          case 'incheon2down':
            times = IncheonTwoTimes(data, station);
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
export enum ESubway {
  'incheon1up' = '인천1호선 평일 상선.json',
  'incheon1down' = '인천1호선 평일 하선.json',
  'incheon2up' = '인천2호선 평일 상선.json',
  'incheon2down' = '인천2호선 평일 하선.json',
}

// 인천 1호선
const incheonOneTimes = (data: string, station: string) => {
  if (!(station in incheonOneStation)) return false;
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
const IncheonTwoTimes = (data: string, station: string) => {
  if (!(station in incheonTwoStation)) return false;

  // object value값을 배열로 Convert
  return Object.values(
    JSON.parse(data).filter((v) => v['구분'] === station)[0],
  );
};

export enum incheonOneStation {
  '국제업무지구',
  '센트럴파크',
  '인천대입구',
  '지식정보단지',
  '테크노파크',
  '캠퍼스타운',
  '동막',
  '동춘도착',
  '원인재',
  '신연수',
  '선학',
  '문학경기장',
  '인천터미널',
  '예술회관',
  '인천시청',
  '간석오거리',
  '부평삼거리',
  '동수',
  '부평',
  '부평시장',
  '부평구청',
  '갈산',
  '작전',
  '경인교대',
  '계산',
  '임학',
  '박촌',
  '귤현',
  '계양',
}

export enum incheonTwoStation {
  '운연',
  '인천대공원',
  '남동구청',
  '만수',
  '모래내시장',
  '석천사거리',
  '인천시청',
  '석바위시장',
  '시민공원',
  '주안',
  '주안국가산단',
  '가재울',
  '인천가좌',
  '서부여성회관',
  '석남',
  '가정중앙시장',
  '가정',
  '서구청',
  '아시아드경기장',
  '검바위',
  '검암',
  '독정',
  '완정',
  '마전',
  '검단사거리',
  '왕길',
  '검단오류',
}
