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

import { v4 as uuidV4 } from 'uuid';

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
          err: '방을 찾지 못했습니다.',
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
        err: '잘못된 접근입니다.',
      };
    }
  }

  async createRoom(
    user: User,
    { lating, roomName }: CreateRoomInputDto,
  ): Promise<CreateRoomOutPutDto> {
    try {
      const uuid = uuidV4();

      const createRoom = this.roomRepository.create({
        uuid,
        lating,
        roomName,
        superUser: user,
        joinUsers: [user],
      });

      // const ok = await this.roomRepository.insert(createRoom);
      // const id = ok.identifiers[0].id;

      // if (!ok) {
      //   return {
      //     ok: false,
      //     err: '예기치 못한 에러가 발생했습니다.',
      //   };
      // }

      // const room = await this.roomRepository.findOne({ id });

      const room = await this.roomRepository.save(createRoom);
      return {
        ok: true,
        room: {
          id: room.id,
          roomName: room.roomName,
          uuid: room.uuid,
          lating: room.lating,
          superUser: room.superUser,
        },
      };
    } catch (err) {
      return {
        ok: false,
        err,
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
          err: '방이 존재하지않습니다.',
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
          err: '방을 삭제하던도중 예기치 못한 에러가 방생했습니다.',
        };
      }

      return {
        ok: false,
        err: '방의 소유권이 아닌 유저입니다.',
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
        err: '잘못됀 접근입니다.',
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
          err: '방을 찾을수 없습니다.',
        };
      }

      if (room.joinUsers.find((v) => v.id === user.id)) {
        return {
          ok: false,
          err: '이미 있는 유저입니다.',
        };
      }
      // 대기 유저
      room.approvalWaitUsers = [...room.approvalWaitUsers, user];
      // await this.roomRepository.save(room);
      room.updateAt = new Date();
      await this.roomRepository.insert({ ...room });

      // 승인 확인
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
          err: '방을 찾을수 없습니다.',
        };
      }

      if (!room.joinUsers.find((v) => v.id === user.id)) {
        return {
          ok: false,
          err: '포함돼지않은 유저입니다.',
        };
      }

      // 방장일시
      if (room.superUser.id === user.id) {
        const remainUser = room.joinUsers.filter((v) => v.id !== user.id);
        const randomIndex = Math.floor(Math.random() * remainUser.length);

        room.superUser = remainUser[randomIndex];
      }

      room.joinUsers = room.joinUsers.filter((v) => v.id !== user.id);
      room.updateAt = new Date();

      room.joinUsers.length === 0
        ? this.roomRepository.delete({ id: room.id })
        : // : this.roomRepository.save(room);
          this.roomRepository.update(room.id, { ...room });

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
          const { uuid, roomName, superUser, id } = v;
          return {
            id,
            uuid,
            roomName,
            superUserinfo: {
              username: superUser.username,
            },
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
      const { roomName, superUser, uuid, lating } = editRoomInput;
      if (!uuid) {
        return {
          ok: false,
          err: '지정된 방이 없습니다.',
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
          err: '방이 존재하지않습니다.',
        };
      }

      if (room.superUser.id !== user.id) {
        return {
          ok: false,
          err: '권한이 있는 유저가 아닙니다.',
        };
      }

      roomName && (room.roomName = roomName);

      superUser && (room.superUser = superUser);
      lating && (room.lating = lating);
      room.updateAt = new Date();

      // const result = await this.roomRepository.save(room);
      const result = await this.roomRepository.update(room.id, { ...room });

      if (!result) {
        return {
          ok: false,
          err: '갱신에 오류가 생겼습니다.',
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
          err: '방이 존재하지않습니다.',
        };
      }

      if (room.superUser.id !== user.id) {
        return {
          ok: false,
          err: '권한이 없는 유저입니다.',
        };
      }

      const isFind = room.approvalWaitUsers.find((v) => v.id === +acceptUserId);
      if (!isFind) {
        return {
          ok: false,
          err: '대기 목록에 없는 유저입니다.',
        };
      }

      const userInfo = await this.userService.findById(acceptUserId);

      room.approvalWaitUsers = room.approvalWaitUsers.filter(
        (v) => v.id !== userInfo.id,
      );

      // 승인 확인
      room.joinUsers = [...room.joinUsers, userInfo];
      // await this.roomRepository.save(room);
      await this.roomRepository.update(room.id, { ...room });

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
