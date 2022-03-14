import { ApiProperty } from '@nestjs/swagger';

import {
  ESubway,
  incheonOneStation,
  incheonTwoStation,
} from '../subway.service';

export const enumToArray = (enumme: any) => {
  // enum 순서값 을 제외한 값을 추출
  return Object.keys(enumme)
    .filter((v) => isNaN(Number(v)) === false) // StringIsNumber
    .map((key) => enumme[key]);
};

export class GetSubWayScheduleInPutDto {
  @ApiProperty({
    name: 'SubWayType',
    description: '행선',
    enum: ['incheon1up', 'incheon1down', 'incheon2up', 'incheon2down'],
  })
  type: keyof typeof ESubway;

  station: keyof typeof incheonOneStation | keyof typeof incheonTwoStation;

  // Swagger Enum 만들려고 더미
  @ApiProperty({
    description: '1호선',
    enum: [...[...enumToArray(incheonOneStation)]],
    required: false,
  })
  station1?: keyof typeof incheonOneStation;
  @ApiProperty({
    description: '2호선',
    enum: [...[...enumToArray(incheonTwoStation)]],
    required: false,
  })
  station2?: keyof typeof incheonTwoStation;
}
