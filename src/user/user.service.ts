import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { UserUpdateInputDto } from './dtos/userUpdate.dto';
import { basicAuth } from 'src/common/interface';
import { LoginOutPutDto } from './dtos/login.dto';
import { userCreateOutPutDto } from './dtos/userCreate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login({ username, password }: basicAuth): Promise<LoginOutPutDto> {
    const user = await this.usersRepository.findOne({
      username,
    });

    if (!user) {
      return {
        ok: false,
        err: '없음',
      };
    }
    const checkPassword = await user.checkPassword(password);

    if (!checkPassword) {
      return {
        ok: false,
        err: '비밀번호가 다릅니다.',
      };
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY);

    return {
      ok: true,
      token,

      user: {
        username: user.username,
        dsc: user.dsc,
      },
    };
  }

  async create({
    username,
    password,
  }: basicAuth): Promise<userCreateOutPutDto> {
    try {
      if (username === '' || password === '')
        return {
          ok: false,
          err: '빈값이 있습니다.',
        };

      const user = await this.usersRepository.findOne({ username });

      if (user) {
        return {
          ok: false,
          err: '이미 존재함',
        };
      }

      const ok = await this.usersRepository.save(
        this.usersRepository.create({
          username,
          password,
        }),
      );

      if (ok) {
        return {
          ok: true,
        };
      }
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async update(user: User, { password, dsc }: UserUpdateInputDto) {
    try {
      if (!user) {
        return '유저를 찾을수없습니다.';
      }

      dsc && (user.dsc = dsc);
      password && (user.password = password);

      const ok = password
        ? await this.usersRepository.save(user)
        : await this.usersRepository.update(user.id, {
            ...user,
          });

      if (!ok) {
        return '업데이트에 실패했습니다.';
      }

      return 'update';
    } catch (e) {
      return e;
    }
  }

  async delete(user: User) {
    try {
      if (!user) {
        return '유저가 존재하지않습니다.';
      }

      await this.usersRepository.delete({ id: user.id });

      return 'delete';
    } catch (e) {
      return e;
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    return user;
  }

  async myRooms(user: User) {
    const myRooms = await this.usersRepository.findOne(user.id, {
      relations: ['joinRooms'],
    });
    return myRooms.joinRooms;
  }
}
