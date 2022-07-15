import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { basicAuth } from 'src/common/interface';
import { Repository } from 'typeorm';
import { ShopUser } from './entities/shop-user.entity';

import * as jwt from 'jsonwebtoken';
import { CreateShopUserOutPut } from './dtos/createShopUser.dto';
import { LoginShopUserOutPut } from './dtos/loginShopUser.dto';
import {
  UpdateShopUserInput,
  UpdateShopUserOutPut,
} from './dtos/updateShopUser.dto';
import { CoreOutPut } from 'src/common/dtos/output.dto';

@Injectable()
export class ShopUserService {
  constructor(
    @InjectRepository(ShopUser)
    private readonly shopUserRepository: Repository<ShopUser>,
  ) {}

  async login({
    username: userId,
    password,
  }: basicAuth): Promise<LoginShopUserOutPut> {
    const user = await this.shopUserRepository.findOne({ userId });

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
    };
  }

  async create({
    username,
    password,
  }: basicAuth): Promise<CreateShopUserOutPut> {
    try {
      if (username === '' || password === '')
        return {
          ok: false,
          err: '빈값이 있습니다.',
        };

      const user = await this.shopUserRepository.findOne({ userId: username });

      if (user) {
        return {
          ok: false,
          err: '이미 존재함',
        };
      }

      const ok = await this.shopUserRepository.save(
        this.shopUserRepository.create({
          userId: username,
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

  async update(
    user: ShopUser,
    { password, nickName }: UpdateShopUserInput,
  ): Promise<UpdateShopUserOutPut> {
    try {
      if (!user) {
        return {
          ok: false,
          err: '유저를 찾을수없습니다.',
        };
      }

      nickName && (user.nickName = nickName);
      password && (user.password = password);

      const ok = password
        ? await this.shopUserRepository.save(user)
        : await this.shopUserRepository.update(user.id, {
            ...user,
          });

      if (!ok) {
        return {
          ok: false,
          err: '업데이트에 실패했습니다.',
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

  async delete(user: ShopUser): Promise<CoreOutPut> {
    try {
      if (!user) {
        return {
          ok: false,
          err: '유저가 존재하지않습니다.',
        };
      }

      const ok = await this.shopUserRepository.delete({ id: user.id });

      if (ok) {
        return {
          ok: true,
        };
      }

      return {
        ok: false,
      };
    } catch (e) {
      return {
        ok: false,
        err: e,
      };
    }
  }

  async findById(id: number): Promise<ShopUser> {
    const user = await this.shopUserRepository.findOne(id);
    return user;
  }
}
