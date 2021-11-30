import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { Comment } from './entities/comment.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantController } from './restaurant.controller';
import { CommentService, RestaurantService } from './restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Comment, Room])],
  controllers: [RestaurantController],
  providers: [RestaurantService, CommentService],
})
export class RestaurantModule {}
