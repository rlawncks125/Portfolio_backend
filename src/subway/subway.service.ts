import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SubwayService {
  constructor() {}
  //
  async getSubWaySchedule(
    res: Response,
    type: SubWayType,
    station: string,
    getTime: number,
  ) {
    if (!(type in ESubway)) {
      res.send('잘못된 접근 입니다.');
      return;
    }
    console.log(getTime);
    const fs = require('fs');
    const folderPath =
      process.env.ENV === 'prod'
        ? `${__dirname}/../assets/subwaySchedule`
        : `${__dirname}/../../src/assets/subwaySchedule`;
    let readPath = `${folderPath}/`;

    readPath += ESubway[type];

    fs.readFile(readPath, 'utf-8', (err: any, data: string) => {
      if (data) {
        let times: string | any[] = '잘못된 역 이름 입니다.';
        let isStationCheckd = false;

        switch (type) {
          case 'incheon1up':
          case 'incheon1down':
            if (station in incheon1Station) isStationCheckd = true;
            break;
          case 'incheon2up':
          case 'incheon2down':
            if (station in incheon2Station) isStationCheckd = true;
            break;
          case 'seoul1up':
          case 'seoul1down':
            if (station in seoul1Station) isStationCheckd = true;
            break;
          case 'suinup':
          case 'suindown':
            if (station in suinStation) isStationCheckd = true;
            break;
          case 'station7up':
          case 'station7down':
            if (station in Station7) isStationCheckd = true;
            break;
          default:
            isStationCheckd = false;
            break;
        }

        isStationCheckd && (times = timesSort(data, station, getTime));

        res.send(times);
      } else {
        res.send(err);
      }
    });
  }
}

const timesSort = (data: string, station: string, time: number) => {
  const filterData = JSON.parse(data).filter((v) => v['역사명'] === station);
  return filterGetTimes(filterData, time);
};

const filterGetTimes = (data: [], time: number): any[] => {
  return data
    .filter((v: any) => {
      const isArrival = v['열차도착시간'] || null;
      const isDeparture = v['열차출발시간'] || null;

      const arrival = isArrival //
        ? v['열차도착시간'].split(':')[0]
        : null;
      const departure = isDeparture
        ? v['열차출발시간'].split(':')[0] || null
        : null;

      if (isArrival) return +arrival === time;
      else if (isDeparture) return +departure === time;
      return false;
    })
    .sort((a: any, b: any) => {
      const isArrival = b['열차도착시간'] || null;
      const isDeparture = b['열차출발시간'] || null;

      if (isArrival)
        return (
          +a['열차도착시간'].split(':')[1] - +b['열차도착시간'].split(':')[1]
        );
      else if (isDeparture)
        return (
          +a['열차출발시간'].split(':')[1] - +b['열차출발시간'].split(':')[1]
        );
      return 0;
    });
};

export type SubWayType = keyof typeof ESubway;
export enum ESubway {
  'incheon1up' = '인천1호선 상선.json',
  'incheon1down' = '인천1호선 하선.json',
  'incheon2up' = '인천2호선 상선.json',
  'incheon2down' = '인천2호선 하선.json',
  'seoul1up' = '수도권1호선 상선.json',
  'seoul1down' = '수도권1호선 하선.json',
  'station7up' = '7호선 상선.json',
  'station7down' = '7호선 하선.json',
  'suinup' = '수인분당선 상선.json',
  'suindown' = '수인분당선 하선.json',
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
  '서동탄',
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
  '광명',
  '금천구청',
  '독산',
  '가산디지털단지',

  '인천',
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
}
export enum Station7 {
  '석남',
  '산곡',
  '부평구청',
  '굴포천',
  '삼산체육관',
  '상동',
  '부천시청',
  '신중동',
  '춘의',
  '부천종합운동장',
  '까치울',
  '온수',
  '천왕',
  '광명사거리',
  '철산',
  '가산디지털단지',
  '남구로',
  '대림',
  '신풍',
  '보라매',
  '신대방삼거리',
  '장승배기',
  '상도',
  '숭실대입구',
  '남성',
  '이수',
  '내방',
  '고속터미널',
  '반포',
  '논현',
  '학동',
  '강남구청',
  '청담',
  '뚝섬유원지',
  '건대입구',
  '어린이대공원',
  '군자',
  '중곡',
  '용마산',
  '사가정',
  '면목',
  '상봉',
  '중화',
  '먹골',
  '태릉입구',
  '공릉',
  '하계',
  '중계',
  '노원',
  '마들',
  '수락산',
  '도봉산',
  '장암',
}

export enum suinStation {
  '인천',
  '신포',
  '숭의',
  '인하대',
  '송도',
  '연수',
  '원인재',
  '남동인더스파크',
  '호구포',
  '인천논현',
  '소래포구',
  '월곶',
  '달월',
  '오이도',
  '정왕',
  '신길온천',
  '안산',
  '초지',
  '고잔',
  '중앙',
  '한대앞',
  '사리',
  '야목',
  '어천',
  '오목천',
  '고색',
  '수원',
  '매교',
  '수원시청',
  '매탄권선',
  '망포',
  '영통',
  '청명',
  '상갈',
  '기흥',
  '신갈',
  '구성',
  '보정',
  '죽전',
  '오리',
  '미금',
  '정자',
  '수내',
  '서현',
  '이매',
  '야탑',
  '모란',
  '태평',
  '가천대',
  '복정',
  '수서',
  '대모산입구',
  '개포동',
  '구룡',
  '도곡',
  '한티',
  '선릉',
  '선정릉',
  '강남구청',
  '압구정로데오',
  '서울숲',
  '왕십리',
  '청량리',
}
