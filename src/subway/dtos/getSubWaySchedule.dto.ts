import { ApiProperty } from '@nestjs/swagger';

import {
  ESubway,
  incheon1Station,
  incheon2Station,
  seoul1Station,
  Station7,
  suinStation,
} from '../subway.service';

export const enumToArray = (enumme: any) => {
  // enum 순서값 을 제외한 값을 추출
  return Object.keys(enumme)
    .filter((v) => isNaN(Number(v)) === false) // StringIsNumber
    .map((key) => enumme[key]);
};

export class GetSubWayScheduleInPutDto {
  @ApiProperty({
    description: '행선',
    enum: [...Object.keys(ESubway)],
  })
  type: keyof typeof ESubway;

  @ApiProperty({
    description: '지하철역',
  })
  station: string;

  @ApiProperty({
    description: '얻을시간',
  })
  getTime: number;

  // Swagger Enum 만들려고 더미
  @ApiProperty({
    description: '인천 1호선',
    enum: [...enumToArray(incheon1Station)],
    required: false,
  })
  station1?: keyof typeof incheon1Station;
  @ApiProperty({
    description: '인천 2호선',
    enum: [...enumToArray(incheon2Station)],
    required: false,
  })
  station2?: keyof typeof incheon2Station;
  @ApiProperty({
    description: '서울 1호선',
    enum: [...enumToArray(seoul1Station)],
    required: false,
  })
  station3?: keyof typeof seoul1Station;
  @ApiProperty({
    description: '7호선',
    enum: [...enumToArray(Station7)],
    required: false,
  })
  station4?: keyof typeof Station7;

  @ApiProperty({
    description: '수인분당선',
    enum: [...enumToArray(suinStation)],
    required: false,
  })
  station5?: keyof typeof suinStation;
}
