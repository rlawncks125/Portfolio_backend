import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateRoomInputDto, CreateRoomOutPutDto } from './dtos/createRoom.dto';
import { JoinRoomInputDto, JoinRoomOutPutDto } from './dtos/joinRooms.dto';
import { MyCreateRoomsOutPutDto } from './dtos/myCreateRooms.dto';
import { MyRoomsOutPutDto } from './dtos/myRooms.dto';
import { roomListOutPutDto } from './dtos/roomList.dto';
import { RoomInfoOutPutDto } from './dtos/roomInfo.dto';
import { Room } from './entities/room.entity';
import { LeaveRoomInputDto, LeaveRoomOutPutDto } from './dtos/leaveRoom.dto';
import { RemoveRoomOutPutDto } from './dtos/RemoveRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private userService: UserService,
  ) {}

  async myRooms(user: User): Promise<MyRoomsOutPutDto> {
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

  async RoomInfo(uuid: string): Promise<RoomInfoOutPutDto> {
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
    { lating, roomName }: CreateRoomInputDto,
  ): Promise<CreateRoomOutPutDto> {
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

  async removeRoom(user: User, uuid: string): Promise<RemoveRoomOutPutDto> {
    try {
      const room: Room = await this.roomRepository.findOne(
        { uuid },
        { relations: ['makerUser'] },
      );

      if (!room) {
        return {
          ok: false,
          err: '방이 존재하지않습니다.',
        };
      }

      if (room.makerUser.id === user.id) {
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

  async myCreateRooms(user: User): Promise<MyCreateRoomsOutPutDto> {
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

  async roomList(): Promise<roomListOutPutDto> {
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
