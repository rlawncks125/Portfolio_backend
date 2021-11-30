import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { Repository } from 'typeorm';
import { Comment, messageType } from './entities/comment.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRespository: Repository<Restaurant>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async createRestaurant() {
    try {
      const data = {
        uuid: 'da8fc101-5189-45a9-ab89-be4a22797305',
        name: '처음만든 레스토랑2',
        location: '지역명2',
        imageUrl: 'imageUrl2',
        lating: {
          x: 13.2,
          y: 34.2,
        },
      };
      // uuid로 room 찾기
      const room = await this.roomRepository.findOne({ uuid: data.uuid });

      if (!room) {
        return {
          ok: false,
        };
      }

      return this.restaurantRespository.save(
        this.restaurantRespository.create({
          parentRoom: room,
          restaurantName: data.name,
          location: data.location,
          restaurantImageUrl: data.imageUrl,
          lating: {
            X: data.lating.x,
            Y: data.lating.y,
          },
        }),
      );
    } catch (e) {
      return e;
    }
  }

  async getRestaurantById(id: number) {
    const restaurant: Restaurant = await this.restaurantRespository.findOne(
      id,
      { relations: ['parentRoom'] },
    );
    if (!restaurant)
      return {
        err: '레스토랑을 찾을수 없습니다.',
      };

    return restaurant;
  }
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRespository: Repository<Restaurant>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async addMesaageByRestaurantId(id: number) {
    try {
      const data = {
        message: {
          message: '추가 댓글이예용22',
          userName: 'userNa',
        },
        star: 5,
      };
      const restaurant: Restaurant = await this.restaurantRespository.findOne(
        id,
      );

      if (!restaurant) {
        return {
          err: '레스토랑이 존재하지않음',
        };
      }
      const comment = await this.commentRepository.save(
        this.commentRepository.create({
          parentRestaurant: restaurant,
          message: {
            message: data.message.message,
            userName: data.message.userName,
          },
          star: data.star,
        }),
      );

      restaurant.comments = [...restaurant.comments, comment];
      restaurant.avgStar = restaurant.avgStarUpdate();

      this.restaurantRespository.save(restaurant);
      return {
        ok: true,
        message: '추가 댓글을 달았습니다.',
      };
    } catch (e) {
      return {
        err: e,
      };
    }
  }

  async addChildMessageByMessageId(id: number) {
    try {
      const data: messageType = {
        CreateTime: new Date(),
        message: '자식 댓글이예용',
        userName: 'zzzz',
      };
      const comment: Comment = await this.commentRepository.findOne(id);

      if (!comment) {
        return {
          err: '댓글을 찾을수 없습니다.',
        };
      }

      comment.childMessages
        ? (comment.childMessages = [...comment.childMessages, data])
        : (comment.childMessages = [data]);

      this.commentRepository.save(comment);

      return {
        ok: true,
      };
    } catch (e) {
      return {
        err: e,
      };
    }
  }

  async getMessageById(id: number) {
    const comment: Comment = await this.commentRepository.findOne(id);

    if (!comment) {
      return {
        err: '댓글이 존재하지않습니다.',
      };
    }

    return comment;
  }
}
