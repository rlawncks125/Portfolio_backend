import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  Comment,
  messageType,
  MessageUserRole,
} from './entities/comment.entity';
import { Restaurant } from './entities/restaurant.entity';
import {
  CreateRestaurantInputDto,
  CreateRestaurantOutPutDto,
} from './dtos/CreateRestaurant.dto';
import { GetRestaurantByIdOutPutDto } from './dtos/GetRestaurantById.dto';
import {
  AddRestaurantCommentByIdIdInputDto,
  AddRestaurantCommentByIdIdOutPutDto,
} from './dtos/AddRestaurantCommentById.dto';
import {
  AddMessageByCommentIdInPutDto,
  AddMessageByCommentIdOutPutDto,
} from './dtos/AddMessageByCommentId.dto';

import { RemoveMessageByIdOutPutDto } from './dtos/RemoveMessageById.dto';
import { RemoveRestaurantOutPutDto } from './dtos/RemoveRestaurant.dto';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRespository: Repository<Restaurant>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly roomService: RoomService,
  ) {}

  async createRestaurant({
    uuid,
    restaurantName,
    lating,
    location,
    restaurantImageUrl,
  }: CreateRestaurantInputDto): Promise<CreateRestaurantOutPutDto> {
    try {
      const room = await this.roomRepository.findOne({ uuid });

      if (!room) {
        return {
          ok: false,
        };
      }
      const restaurant = await this.restaurantRespository.save(
        this.restaurantRespository.create({
          parentRoom: room,
          restaurantName,
          location,
          restaurantImageUrl,
          lating,
        }),
      );

      return {
        ok: true,
        restaurant,
      };
    } catch (e) {
      return e;
    }
  }

  async getRestaurantById(id: number): Promise<GetRestaurantByIdOutPutDto> {
    const restaurant: Restaurant = await this.restaurantRespository.findOne(
      id,
      // { relations: ['parentRoom'] },
    );
    if (!restaurant)
      return {
        ok: false,
        err: '레스토랑을 찾을수 없습니다.',
      };

    return {
      ok: true,
      restaurant,
    };
  }

  async removeRestaurant(
    user: User,
    id: number,
  ): Promise<RemoveRestaurantOutPutDto> {
    try {
      const restuanrt = await this.restaurantRespository.findOne(+id, {
        relations: ['parentRoom'],
      });
      if (!restuanrt) {
        return {
          ok: false,
          err: '레스토랑이 존재하지않습니다.',
        };
      }
      const roomParentId = restuanrt.parentRoom.id;

      const myRooms = await (
        await this.roomService.myCreateRooms(user)
      ).myRooms;

      if (myRooms.filter((v) => v.id === roomParentId).length > 0) {
        const result = await this.restaurantRespository.delete({ id: +id });

        if (result) {
          return {
            ok: true,
          };
        }
        return {
          ok: false,
          err: '레스토랑을 삭제하는중에 예기치 못한 에러가 발생했습니다.',
        };
      }

      return {
        ok: false,
        err: '권한이 없는 유저입니다.',
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
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

  async addRestaurantCommentById(
    user: User,
    { restaurantId, message, role, star }: AddRestaurantCommentByIdIdInputDto,
  ): Promise<AddRestaurantCommentByIdIdOutPutDto> {
    try {
      if (!(role in MessageUserRole)) {
        return {
          ok: false,
          err: '유저 유형이 다릅니다.',
        };
      }

      const restaurant: Restaurant = await this.restaurantRespository.findOne(
        restaurantId,
      );

      if (!restaurant) {
        return {
          ok: false,
          err: '레스토랑이 존재하지않음',
        };
      }

      const comment = await this.commentRepository.save(
        this.commentRepository.create({
          parentRestaurant: restaurant,
          message: {
            CreateTime: new Date(),
            message,
            userInfo: {
              nickName: user.username,
              role,
            },
          },
          star: star,
        }),
      );

      restaurant.comments = [...restaurant.comments, comment];
      restaurant.avgStar = restaurant.avgStarUpdate();

      const result = await this.restaurantRespository.save(restaurant);

      if (!result) {
        return {
          ok: false,
          err: '레스토랑에 반영하지 못하였습니다.',
        };
      }
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        err: e,
      };
    }
  }

  async addMessageByCommentId(
    user: User,
    { commentId, message, role }: AddMessageByCommentIdInPutDto,
  ): Promise<AddMessageByCommentIdOutPutDto> {
    try {
      if (!(role in MessageUserRole)) {
        return {
          ok: false,
          err: '유저 유형이 다릅니다.',
        };
      }

      const comment: Comment = await this.commentRepository.findOne(commentId);

      if (!comment) {
        return {
          ok: false,
          err: '댓글을 찾을수 없습니다.',
        };
      }

      const addMessage = {
        CreateTime: new Date(),
        message,
        userInfo: {
          nickName: user.username,
          role,
        },
      } as messageType;

      comment.childMessages
        ? (comment.childMessages = [...comment.childMessages, addMessage])
        : (comment.childMessages = [addMessage]);

      const result = await this.commentRepository.save(comment);

      if (!result) {
        return {
          ok: false,
          err: '댓글을 저장하는데 오류가 발생하였습니다.',
        };
      }

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        err: e,
      };
    }
  }

  async getMessageById(id: number) {
    const comment: Comment = await this.commentRepository.findOne(id);

    if (!comment) {
      return {
        ok: false,
        err: '댓글이 존재하지않습니다.',
      };
    }

    return comment;
  }

  async removeMessageById(
    user: User,
    id: number,
  ): Promise<RemoveMessageByIdOutPutDto> {
    try {
      const comment: Comment = await this.commentRepository.findOne(id);

      if (comment.message.userInfo.nickName === user.username) {
        const result = await this.commentRepository.delete({ id });

        if (result) {
          return {
            ok: true,
          };
        }
        return {
          ok: false,
          err: '삭제하는 도중에 예기치 못한 오류가 발생했습니다.',
        };
      }

      return {
        ok: false,
        err: '유저 정보가 다릅니다.',
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }
}
