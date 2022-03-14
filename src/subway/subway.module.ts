import { Module } from '@nestjs/common';
import { SubwayController } from './subway.controller';
import { SubwayService } from './subway.service';

@Module({
  controllers: [SubwayController],
  providers: [SubwayService]
})
export class SubwayModule {}
