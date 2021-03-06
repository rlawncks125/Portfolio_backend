import { Catch, Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import {
  Equal,
  FindConditions,
  FindOneOptions,
  Like,
  Repository,
} from 'typeorm';
import { CreateRoomInputDto, CreateRoomOutPutDto } from './dtos/createRoom.dto';
import { JoinRoomInputDto, JoinRoomOutPutDto } from './dtos/joinRooms.dto';
import { MyCreateRoomsOutPutDto } from './dtos/myCreateRooms.dto';
import {
  ApprovalWaitUsersInfoDto,
  MyRoomsJoinUserInfoDto,
  MyRoomsOutPutDto,
  MyRoomsRestaurantInfoDto,
} from './dtos/myRooms.dto';
import {
  RoomListInputDto,
  RoomListOutPutDto,
  searchTypeEnum,
} from './dtos/roomList.dto';
import { RoomInfoOutPutDto } from './dtos/roomInfo.dto';
import { Room } from './entities/room.entity';
import { LeaveRoomInputDto, LeaveRoomOutPutDto } from './dtos/leaveRoom.dto';
import { RemoveRoomOutPutDto } from './dtos/RemoveRoom.dto';
import { EditRoomInPutDto, EdtiRoomOutPutDto } from './dtos/editRoom.dto';
import { myApprovalWaitRoomsOutPutDto } from './dtos/myApprovalWaitRooms.dto';
import { AcceptUserInPutDto, AcceptUserOutPutDto } from './dtos/AcceptUser.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly userService: UserService,
  ) {}

  async myRoomsInfo(user: User): Promise<MyRoomsOutPutDto> {
    try {
      const rooms = await this.userService.myRooms(user);

      if (rooms.length === 0) {
        return {
          ok: true,
          myRooms: [],
        };
      }

      const roomIds = rooms.map((v) => ({
        id: v.id,
      }));

      const roomsInfo = await this.roomRepository.findByIds(roomIds, {
        relations: [
          'joinUsers',
          'restaurants',
          'superUser',
          'approvalWaitUsers',
        ],
      });

      return {
        ok: true,
        myRooms: roomsInfo.map((v) => {
          return {
            id: v.id,
            uuid: v.uuid,
            roomName: v.roomName,
            lating: v.lating,
            markeImageUrl: v.markeImageUrl,
            superUser: v.superUser,
            joinUsersInfo: v.joinUsers.map((v) => {
              return {
                id: v.id,
                username: v.username,
              } as MyRoomsJoinUserInfoDto;
            }),
            restaurantInfo: v.restaurants.map((r) => {
              return {
                id: r.id,
                restaurantName: r.restaurantName,
                restaurantImageUrl: r.restaurantImageUrl,
                resturantSuperUser: r.resturantSuperUser,
                location: r.location,
                lating: r.lating,
              } as MyRoomsRestaurantInfoDto;
            }),
            approvalWaitUsers: v.approvalWaitUsers.map((v) => {
              return {
                id: v.id,
                username: v.username,
              } as ApprovalWaitUsersInfoDto;
            }),
          };
        }),
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async RoomInfo(uuid: string): Promise<RoomInfoOutPutDto> {
    try {
      const room = await this.roomRepository.findOne({
        where: { uuid },
        relations: [
          'joinUsers',
          'restaurants',
          'superUser',
          'approvalWaitUsers',
        ],
      });

      if (!room) {
        return {
          ok: false,
          err: '?????? ?????? ???????????????.',
        };
      }

      return {
        ok: true,
        roomInfo: {
          roomName: room.roomName,
          lating: room.lating,
          superUserInfo: {
            id: room.superUser.id,
            username: room.superUser.username,
          },
          markeImageUrl: room.markeImageUrl,
        },
        users: room.joinUsers.map((user) => {
          return {
            id: user.id,
            username: user.username,
          };
        }),
        ApprovalWaitUsers: room.approvalWaitUsers.map((user) => {
          return {
            id: user.id,
            username: user.username,
          };
        }),
        RestaurantInfo: room.restaurants.map((v) => {
          return {
            id: v.id,
            resturantSuperUser: v.resturantSuperUser,
            restaurantName: v.restaurantName,
            restaurantImageUrl: v.restaurantImageUrl,
            location: v.location,
            lating: v.lating,
            avgStar: v.avgStar,
            comments: v.comments,
            hashTags: v.hashTags,
            specialization: v.specialization,
          };
        }),
      };
    } catch (e) {
      return {
        ok: false,
        err: '????????? ???????????????.',
      };
    }
  }

  async createRoom(
    user: User,
    { lating, roomName, markeImageUrl }: CreateRoomInputDto,
  ): Promise<CreateRoomOutPutDto> {
    try {
      const room = await this.roomRepository.save(
        this.roomRepository.create({
          lating,
          roomName,
          superUser: user,
          joinUsers: [user],
          markeImageUrl,
        }),
      );

      if (!room) {
        return {
          ok: false,
          err: '????????? ?????? ????????? ??????????????????.',
        };
      }

      return {
        ok: true,
        room: {
          id: room.id,
          roomName: room.roomName,
          uuid: room.uuid,
          lating: room.lating,
          superUser: room.superUser,
          markeImageUrl: room.markeImageUrl,
        },
      };
    } catch (e) {
      return {
        ok: false,
        err: '???????????? ??? ??????????????????.',
      };
    }
  }

  async removeRoom(user: User, uuid: string): Promise<RemoveRoomOutPutDto> {
    try {
      const room: Room = await this.roomRepository.findOne(
        { uuid },
        { relations: ['superUser'] },
      );

      if (!room) {
        return {
          ok: false,
          err: '?????? ????????????????????????.',
        };
      }

      if (room.superUser.id === user.id) {
        const result = await this.roomRepository.delete({ uuid });

        if (result) {
          return {
            ok: true,
          };
        }
        return {
          ok: false,
          err: '?????? ?????????????????? ????????? ?????? ????????? ??????????????????.',
        };
      }

      return {
        ok: false,
        err: '?????? ???????????? ?????? ???????????????.',
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async mySuperRooms(user: User): Promise<MyCreateRoomsOutPutDto> {
    try {
      const rooms = await this.roomRepository.find({
        where: { superUser: user },
        // relations: ['joinUsers'],
      });

      if (rooms.length === 0) {
        return {
          ok: true,
          myRooms: [],
        };
      }

      return {
        ok: true,
        myRooms: rooms.map((room) => {
          const { id, lating, roomName, uuid } = room;
          return {
            id,
            uuid,
            roomName,
            lating,
          };
        }),
      };
    } catch (e) {
      return {
        ok: false,
        err: '????????? ???????????????.',
      };
    }
  }

  async joinRoom(
    user: User,
    { uuid }: JoinRoomInputDto,
  ): Promise<JoinRoomOutPutDto> {
    try {
      const room = await this.roomRepository.findOne({
        where: { uuid },
        relations: ['joinUsers', 'approvalWaitUsers'],
      });

      if (!room) {
        return {
          ok: false,
          err: '?????? ????????? ????????????.',
        };
      }

      if (room.joinUsers.find((v) => v.id === user.id)) {
        return {
          ok: false,
          err: '?????? ?????? ???????????????.',
        };
      }
      // ?????? ??????
      room.approvalWaitUsers = [...room.approvalWaitUsers, user];
      await this.roomRepository.save(room);

      // ?????? ??????
      // room.joinUsers = [...room.joinUsers, user];
      // this.roomRepository.save(room);

      return { ok: true };
    } catch (err) {
      return { ok: false, err };
    }
  }

  async leaveRoom(
    user: User,
    { uuid }: LeaveRoomInputDto,
  ): Promise<LeaveRoomOutPutDto> {
    try {
      const room = await this.roomRepository.findOne({
        where: { uuid },
        relations: ['joinUsers', 'superUser'],
      });

      if (!room) {
        return {
          ok: false,
          err: '?????? ????????? ????????????.',
        };
      }

      if (!room.joinUsers.find((v) => v.id === user.id)) {
        return {
          ok: false,
          err: '?????????????????? ???????????????.',
        };
      }

      // ????????????
      if (room.superUser.id === user.id) {
        const remainUser = room.joinUsers.filter((v) => v.id !== user.id);
        const randomIndex = Math.floor(Math.random() * remainUser.length);

        room.superUser = remainUser[randomIndex];
      }

      room.joinUsers = room.joinUsers.filter((v) => v.id !== user.id);

      room.joinUsers.length === 0
        ? this.roomRepository.delete({ id: room.id })
        : this.roomRepository.save(room);

      return { ok: true };
    } catch (err) {
      return { ok: false, err };
    }
  }

  async roomList({
    searchType,
    value,
  }: RoomListInputDto): Promise<RoomListOutPutDto> {
    try {
      let where: FindConditions<Room> = {};

      switch (searchType) {
        case searchTypeEnum.All:
          where = {};
          break;

        case searchTypeEnum.RoomName:
          where = {
            roomName: Like(`%${value}%`),
          };
          break;

        case searchTypeEnum.SuperUser:
          where = {
            superUser: {
              username: Equal(value),
            },
          };
          break;

        default:
          where = {};
          break;
      }

      const roomList = await this.roomRepository.find({
        relations: ['superUser'],
        where,
      });

      if (roomList.length === 0) {
        return {
          ok: true,
          roomList: [],
        };
      }

      return {
        ok: true,
        roomList: roomList.map((v) => {
          const { uuid, roomName, superUser, markeImageUrl, id } = v;
          return {
            id,
            uuid,
            roomName,
            superUserinfo: {
              username: superUser.username,
            },
            markeImageUrl,
          };
        }),
        // roomList,
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async editRoom(
    user: User,
    editRoomInput: EditRoomInPutDto,
  ): Promise<EdtiRoomOutPutDto> {
    try {
      const { markeImageUrl, roomName, superUser, uuid, lating } =
        editRoomInput;
      if (!uuid) {
        return {
          ok: false,
          err: '????????? ?????? ????????????.',
        };
      }
      const room = await this.roomRepository.findOne(
        { uuid },
        {
          relations: ['superUser'],
        },
      );

      if (!room) {
        return {
          ok: false,
          err: '?????? ????????????????????????.',
        };
      }

      if (room.superUser.id !== user.id) {
        return {
          ok: false,
          err: '????????? ?????? ????????? ????????????.',
        };
      }

      roomName && (room.roomName = roomName);
      markeImageUrl && (room.markeImageUrl = markeImageUrl);
      superUser && (room.superUser = superUser);
      lating && (room.lating = lating);

      const result = await this.roomRepository.save(room);

      if (!result) {
        return {
          ok: false,
          err: '????????? ????????? ???????????????.',
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

  async myApprovalWait(user: User): Promise<myApprovalWaitRoomsOutPutDto> {
    try {
      const userInfo = await this.userService.myApprovalWaitRooms(user);

      if (!userInfo) {
        return {
          ok: false,
        };
      }
      return {
        ok: true,
        rooms: userInfo.approvalWaitRooms,
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async AcceptUser(
    user: User,
    { uuid, id: acceptUserId }: AcceptUserInPutDto,
  ): Promise<AcceptUserOutPutDto> {
    try {
      const room = await this.roomRepository.findOne(
        { uuid },
        {
          relations: ['approvalWaitUsers', 'joinUsers', 'superUser'],
        },
      );

      if (!room) {
        return {
          ok: false,
          err: '?????? ????????????????????????.',
        };
      }

      if (room.superUser.id !== user.id) {
        return {
          ok: false,
          err: '????????? ?????? ???????????????.',
        };
      }

      const isFind = room.approvalWaitUsers.find((v) => v.id === +acceptUserId);
      if (!isFind) {
        return {
          ok: false,
          err: '?????? ????????? ?????? ???????????????.',
        };
      }

      const userInfo = await this.userService.findById(acceptUserId);

      room.approvalWaitUsers = room.approvalWaitUsers.filter(
        (v) => v.id !== userInfo.id,
      );

      // ?????? ??????
      room.joinUsers = [...room.joinUsers, userInfo];
      await this.roomRepository.save(room);

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
}
