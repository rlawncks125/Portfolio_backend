import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateRoomInput, CreateRoomOutPut } from './dtos/createRoom.dto';
import { JoinRoomInput, JoinRoomOutPut } from './dtos/joinRooms.dto';
import { MyCreateRoomsOutPut } from './dtos/myCreateRooms.dto';
import { MyRoomsOutPut } from './dtos/myRooms.dto';
import { roomListOutPut } from './dtos/roomList.dto';
import { RoomInfoOutPut } from './dtos/roomInfo.dto';
import { Room } from './entities/room.entity';
import { LeaveRoomInput, LeaveRoomOutPut } from './dtos/leaveRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private userService: UserService,
  ) {}

  async myRooms(user: User): Promise<MyRoomsOutPut> {
    try {
      const rooms = await this.userService.myRooms(user);

      return {
        ok: true,
        myRooms: rooms.map((room) => {
          const { id, roomName, uuid, lating } = room;
          return {
            id,
            roomName,
            uuid,
            lating,
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

  async RoomInfo(uuid: string): Promise<RoomInfoOutPut> {
    try {
      const room = await this.roomRepository.findOne({
        where: { uuid },
        relations: ['joinUsers', 'restaurants'],
      });

      return {
        ok: true,
        users: room.joinUsers.map((user) => {
          return {
            id: user.id,
            username: user.username,
          };
        }),
        RestaurantInfo: room.restaurants.map((v) => {
          return {
            id: v.id,
            restaurantName: v.restaurantName,
            restaurantImageUrl: v.restaurantImageUrl,
            location: v.location,
            lating: v.lating,
            avgStar: v.avgStar,
            comments: v.comments,
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
    { lating, roomName }: CreateRoomInput,
  ): Promise<CreateRoomOutPut> {
    try {
      const room = await this.roomRepository.save(
        this.roomRepository.create({
          lating,
          roomName,
          makerUser: user,
          joinUsers: [user],
        }),
      );

      return {
        ok: true,
        room: {
          id: room.id,
          roomName: room.roomName,
          uuid: room.uuid,
          lating: room.lating,
          makerUser: room.makerUser,
        },
      };
    } catch (e) {
      return {
        ok: false,
        err: '방만들기 에 실패했습니다.',
      };
    }
  }

  async myCreateRooms(user: User): Promise<MyCreateRoomsOutPut> {
    try {
      const rooms = await this.roomRepository.find({
        where: { makerUser: user },
        // relations: ['joinUsers'],
      });

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

  async joinRoom(user: User, { uuid }: JoinRoomInput): Promise<JoinRoomOutPut> {
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

  async leaveRoom(user: User, uuid: string): Promise<LeaveRoomOutPut> {
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

      if (!room.joinUsers.find((v) => v.id === user.id)) {
        return {
          ok: false,
          err: '포함돼지않은 유저입니다.',
        };
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

  async roomList(): Promise<roomListOutPut> {
    try {
      const roomList = await this.roomRepository.find({
        relations: ['makerUser'],
      });

      return {
        ok: true,
        roomList: roomList.map((v) => {
          const { uuid, roomName, makerUser } = v;
          return {
            uuid,
            roomName,
            makerUserinfo: {
              username: makerUser.username,
            },
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
}
