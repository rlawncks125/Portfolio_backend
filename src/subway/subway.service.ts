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
        let times = null;
        switch (type) {
          case 'incheon1up':
          case 'incheon1down':
            if (!(station in incheon1Station)) break;
            times = timesSort(data, station);
            break;
          case 'incheon2up':
          case 'incheon2down':
            if (!(station in incheon2Station)) break;
            times = timesSort(data, station);
            break;
          case 'seoul1up':
          case 'seoul1down':
            if (!(station in seoul1Station)) break;
            times = timesSort(data, station);
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

const timesSort = (data: string, station: string) => {
  return JSON.parse(data)
    .filter((v) => v['역사명'] === station)
    .sort(
      (a, b) =>
        +a['열차출발시간'].split(':')[0] - +b['열차출발시간'].split(':')[0],
    );
};

export type SubWayType = keyof typeof ESubway;
export enum ESubway {
  'incheon1up' = '인천1호선 상선.json',
  'incheon1down' = '인천1호선 하선.json',
  'incheon2up' = '인천2호선 상선.json',
  'incheon2down' = '인천2호선 하선.json',
  'seoul1up' = '수도권1호선 상선.json',
  'seoul1down' = '수도권1호선 하선.json',
}

export enum incheon1Station {
  '국제업무지구',
  '센트럴파크',
  '인천대입구',
  '지식정보단지',
  '테크노파크',
  '캠퍼스타운',
  '동막',
  '동춘',
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

export enum incheon2Station {
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
export enum seoul1Station {
  '동인천',
  '도원',
  '제물포',
  '도화',
  '주안',
  '간석',
  '동암',
  '백운',
  '부평',
  '부개',
  '송내',
  '중동',
  '부천',
  '소사',
  '역곡',
  '온수',
  '오류동',
  '개봉',
  '구일',
  '구로',
  '신도림',
  '영등포',
  '신길',
  '대방',
  '노량진',
  '용산',
  '인천',
  '남영',
  '서울역',
  '시청',
  '종각',
  '종로3가',
  '종로5가',
  '동대문',
  '동묘앞',
  '신설동',
  '제기동',
  '청량리',
  '회기',
  '외대앞',
  '신이문',
  '석계',
  '광운대',
  '월계',
  '녹천',
  '창동',
  '방학',
  '도봉',
  '도봉산',
  '망월사',
  '회룡',
  '의정부',
  '가능',
  '녹양',
  '양주',
  '마전',
  '덕계',
  '덕정',
  '지행',
  '동두천중앙',
  '보산',
  '동두천',
  '소요산',
  '신창',
  '온양온천',
  '배방',
  '아산',
  '쌍용',
  '봉명',
  '천안',
  '두정',
  '직산',
  '성환',
  '평택',
  '평택지제',
  '서정리',
  '송탄',
  '진위',
  '오산',
  '오산대',
  '세마',
  '병점',
  '세류',
  '수원',
  '화서',
  '성균관대',
  '의왕',
  '당정',
  '군포',
  '금정',
  '명학',
  '안양',
  '관악',
  '석수',
  '금천구청',
  '독산',
  '가산디지털단지',
  '서동탄',
  '광명',
}
