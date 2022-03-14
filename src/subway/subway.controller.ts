import { Body, Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GetSubWayScheduleInPutDto } from './dtos/getSubWaySchedule.dto';
import { SubwayService } from './subway.service';

@ApiTags('subway')
@Controller('subway')
export class SubwayController {
  constructor(private readonly subwayService: SubwayService) {}

  @Get('')
  async getSubway(
    @Res() res: Response,
    @Body()
    { type, station }: GetSubWayScheduleInPutDto,
  ) {
    return this.subwayService.getSubWaySchedule(res, type, station);
  }
}
