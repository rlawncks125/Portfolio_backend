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
        err: '??????????????? ????????? ????????????.',
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
          err: '??????????????? ????????????????????????.',
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
            err: '???????????? ?????? ??????????????? ????????? ?????????',
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
          err: '??????????????? ?????????????????? ????????? ?????? ????????? ??????????????????.',
        };
      }

      return {
        ok: false,
        err: '????????? ?????? ???????????????.',
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
          err: '?????? ????????? ????????????.',
        };
      }

      const restaurant: Restaurant = await this.restaurantRespository.findOne(
        restaurantId,
      );

      if (!restaurant) {
        return {
          ok: false,
          err: '??????????????? ??????????????????',
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
          err: '??????????????? ???????????? ??????????????????.',
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
          err: '????????? ????????? ????????????.',
        };
      }

      const isCheck = comment.message.userInfo.nickName === user.username;

      if (!isCheck) {
        return {
          ok: false,
          err: '????????? ?????? ???????????????.',
        };
      }

      comment.message.message = message;

      const result = await this.commentRepository.save(comment);

      if (!result) {
        return {
          ok: false,
          err: '????????? ????????????????????? ????????? ?????? ????????? ?????????????????????.',
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
          err: '????????? ????????? ????????????.',
        };
      }

      // ????????? ??????
      const findIndex = comment.childMessages.findIndex(
        (v) => v.CreateTime === createTime,
      );

      if (findIndex < 0) {
        return {
          ok: false,
          err: '???????????? ????????? ????????????.',
        };
      }

      const childComment = comment.childMessages[findIndex];
      const isCheck = childComment.userInfo.nickName === user.username;

      if (!isCheck) {
        return {
          ok: false,
          err: '????????? ?????? ???????????????.',
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
          err: '????????? ??????????????? ????????? ?????? ????????? ?????????????????????.',
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
          err: '?????? ????????? ????????????.',
        };
      }

      const comment: Comment = await this.commentRepository.findOne(commentId);

      if (!comment) {
        return {
          ok: false,
          err: '????????? ????????? ????????????.',
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
          err: '????????? ??????????????? ????????? ?????????????????????.',
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
        err: '????????? ????????????????????????.',
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
            err: '??????????????? ????????? ?????? ???????????????.',
          };
        }
        return {
          ok: false,
          err: '???????????? ????????? ????????? ?????? ????????? ??????????????????.',
        };
      }

      return {
        ok: false,
        err: '?????? ????????? ????????????.',
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }
}
