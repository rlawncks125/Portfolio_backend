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
import {
  EditCommentMessageInPutDto,
  EditCommentMessageOutPutDto,
} from './dtos/EditCommentMessage.dto';
import {
  EditCommentChildMessageInPutDto,
  EditCommentChildMessageOutPutDto,
} from './dtos/EditCommentChildMessage.dto';

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

  async createRestaurant(
    user: User,
    {
      uuid,
      restaurantName,
      lating,
      location,
      restaurantImageUrl,
      hashTags,
      specialization,
    }: CreateRestaurantInputDto,
  ): Promise<CreateRestaurantOutPutDto> {
    try {
      const room = await this.roomRepository.findOne({ uuid });

      if (!room) {
        return {
          ok: false,
        };
      }
      const restaurant = await this.restaurantRespository.save(
        this.restaurantRespository.create({
          resturantSuperUser: {
            nickName: user.username,
            id: user.id,
          },
          parentRoom: room,
          restaurantName,
          location,
          restaurantImageUrl,
          lating,
          hashTags,
          specialization,
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
      // console.log(restuanrt.resturantSuperUser.id, user.id);

      if (restuanrt.resturantSuperUser.id === user.id) {
        const result = await await this.restaurantRespository.delete({
          id: +id,
        });
        if (result) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            err: '레스토랑 만든 주인이지만 오류가 발생함',
          };
        }
      }

      const roomParentId = restuanrt.parentRoom.id;

      const myRooms = await (await this.roomService.mySuperRooms(user)).myRooms;

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

  async editCommentMessage(
    user: User,
    { id, message }: EditCommentMessageInPutDto,
  ): Promise<EditCommentMessageOutPutDto> {
    try {
      const comment: Comment = await this.commentRepository.findOne(id);

      if (!comment) {
        return {
          ok: false,
          err: '댓글을 찾을수 없습니다.',
        };
      }

      const isCheck = comment.message.userInfo.nickName === user.username;

      if (!isCheck) {
        return {
          ok: false,
          err: '권한이 없는 유저입니다.',
        };
      }

      comment.message.message = message;

      const result = await this.commentRepository.save(comment);

      if (!result) {
        return {
          ok: false,
          err: '댓글은 반영하는도중에 예기치 못한 에러가 발생하였습니다.',
        };
      }

      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async editCommentChildMessage(
    user: User,
    { createTime, id, message }: EditCommentChildMessageInPutDto,
  ): Promise<EditCommentChildMessageOutPutDto> {
    try {
      const comment: Comment = await this.commentRepository.findOne(id);

      if (!comment) {
        return {
          ok: false,
          err: '댓글을 찾을수 없습니다.',
        };
      }

      // 대댓글 체크
      const findIndex = comment.childMessages.findIndex(
        (v) => v.CreateTime === createTime,
      );

      if (findIndex < 0) {
        return {
          ok: false,
          err: '대댓글을 찾을수 없습니다.',
        };
      }

      const childComment = comment.childMessages[findIndex];
      const isCheck = childComment.userInfo.nickName === user.username;

      if (!isCheck) {
        return {
          ok: false,
          err: '권한이 없는 유저입니다.',
        };
      }

      comment.childMessages = comment.childMessages.map((v, index) => {
        if (index === findIndex) {
          return {
            ...v,
            message,
          };
        }

        return v;
      });

      const result = await this.commentRepository.save(comment);

      if (!result) {
        return {
          ok: false,
          err: '댓글을 갱신하는데 예기치 못한 사황이 발생하였습니다.',
        };
      }

      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        err,
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

  async getMessageById(
    id: number,
  ): Promise<{ ok: boolean; err?: string; comment?: Comment }> {
    const comment: Comment = await this.commentRepository.findOne(id);

    if (!comment) {
      return {
        ok: false,
        err: '댓글이 존재하지않습니다.',
      };
    }

    return {
      ok: true,
      comment,
    };
  }

  async removeMessageById(
    user: User,
    id: number,
  ): Promise<RemoveMessageByIdOutPutDto> {
    try {
      console.log(id);
      const comment: Comment = await this.commentRepository.findOne(id, {
        relations: ['parentRestaurant'],
      });

      if (comment.message.userInfo.nickName === user.username) {
        const deleted = await this.commentRepository.delete({ id });

        if (deleted) {
          const restaurant = comment.parentRestaurant;
          restaurant.avgStar = restaurant.removeCommentUpdateAvgStarById(id);

          const updated = await this.restaurantRespository.save(restaurant);

          if (updated) {
            return {
              ok: true,
            };
          }

          return {
            ok: false,
            err: '레스토랑에 반영이 되지 않았습니다.',
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
