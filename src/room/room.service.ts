import { Injectable, UseInterceptors } from '@nestjs/common';
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
        relations: ['joinUsers', 'restaurants', 'superUser'],
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
        relations: ['joinUsers', 'restaurants', 'superUser'],
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
          err: '예기치 못한 에러가 발생했습니다.',
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
        err: '방만들기 에 실패했습니다.',
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
        relations: ['joinUsers'],
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
      room.joinUsers = [...room.joinUsers, user];

      this.roomRepository.save(room);

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
          const { uuid, roomName, superUser, markeImageUrl } = v;
          return {
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
}
