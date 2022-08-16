import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { basicAuth } from 'src/common/interface';
import { Repository } from 'typeorm';
import { ShopUser } from './entities/shop-user.entity';

import * as jwt from 'jsonwebtoken';
import {
  CreateShopUserInputDto,
  CreateShopUserOutPut,
} from './dtos/createShopUser.dto';
import { LoginShopUserOutPut } from './dtos/loginShopUser.dto';
import {
  UpdateShopUserInput,
  UpdateShopUserOutPut,
} from './dtos/updateShopUser.dto';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { AddCompanyInputDto, AddCompanyOutPutDto } from './dtos/addCompany.dto';
import { ShopUserSeller } from './entities/shop-user-seller.entity';
import {
  UpdateCompanyInutDto,
  UpdateCompanyOutPutDto,
} from './dtos/updateCompany.dto';
import { MailerService } from 'src/mailer/mailer.service';
@Injectable()
export class ShopUserService {
  constructor(
    @InjectRepository(ShopUser)
    private readonly shopUserRepository: Repository<ShopUser>,
    @InjectRepository(ShopUserSeller)
    private readonly sellerRepository: Repository<ShopUserSeller>,
    private readonly mailerService: MailerService,
  ) {}

  async login({
    username: userId,
    password,
  }: basicAuth): Promise<LoginShopUserOutPut> {
    const user = await this.shopUserRepository.findOne(
      { userId },
      { relations: ['sellerInfo'] },
    );

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

    const { email, addr, nickName, postcode, tel, role } = user;
    return {
      ok: true,
      token,
      userInfo: {
        email,
        nickName,
        postcode,
        tel,
        addr,
        role,
      },
      sellerInfo: user.sellerInfo,
    };
  }

  async create(
    { username, password }: basicAuth,
    { nickName, role, email, postcode, tel, addr }: CreateShopUserInputDto,
  ): Promise<CreateShopUserOutPut> {
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
          err: '이미 존재하는 아이디',
        };
      }
      const userNickName = await this.shopUserRepository.findOne({ nickName });
      if (userNickName) {
        return {
          ok: false,
          err: '이미 존재하는 닉네임',
        };
      }

      const ok = await this.shopUserRepository.save(
        this.shopUserRepository.create({
          userId: username,
          password,
          nickName,
          role,
          email,
          postcode,
          tel,
          addr,
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
    { password, nickName, email, postcode, tel, addr }: UpdateShopUserInput,
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
      email && (user.email = email);
      postcode && (user.postcode = postcode);
      tel && (user.tel = tel);
      addr && (user.addr = addr);

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
    const user = await this.shopUserRepository.findOne(id, {
      relations: ['sellerInfo', 'Ireceipts'],
    });
    return user;
  }

  async passwordConfirm(
    user: ShopUser,
    { password }: basicAuth,
  ): Promise<CoreOutPut> {
    try {
      const { ok } = await this.login({ username: user.userId, password });

      if (!ok) {
        return {
          ok: false,
          err: '일치하지 않습니다.',
        };
      }
      return {
        ok,
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async addCompany(
    user: ShopUser,
    {
      companyAddress,
      companyName,
      eMail,
      phone,
      represent,
    }: AddCompanyInputDto,
  ): Promise<AddCompanyOutPutDto> {
    const findSeller = await this.sellerRepository.findOne(
      { user },
      { relations: ['user'] },
    );

    if (findSeller) {
      return {
        ok: false,
        err: '이미 회사정보가 입력되었습니다.',
      };
    }

    const seller = await this.sellerRepository.save(
      this.sellerRepository.create({
        user,
        companyAddress,
        companyName,
        eMail,
        phone,
        represent,
      }),
    );
    if (!seller) {
      return {
        ok: false,
      };
    }

    return {
      ok: true,
      sellerInfo: seller,
    };
  }

  async updateCompany(
    user: ShopUser,
    {
      companyAddress,
      companyName,
      eMail,
      phone,
      represent,
    }: UpdateCompanyInutDto,
  ): Promise<UpdateCompanyOutPutDto> {
    const seller = await this.sellerRepository.findOne(
      { user },
      { relations: ['user'] },
    );
    if (!seller) {
      return {
        ok: false,
        err: '판매자 등록이 안되어 있습니다.',
      };
    }

    companyAddress && (seller.companyAddress = companyAddress);
    companyName && (seller.companyName = companyName);
    eMail && (seller.eMail = eMail);
    phone && (seller.phone = phone);
    represent && (seller.represent = represent);

    const result = await this.sellerRepository.save(seller);

    if (!result) {
      return {
        ok: false,
        err: '정보를 업데이트 하지못함',
      };
    }

    return {
      ok: true,
    };
  }

  async deleteCompany(user: ShopUser): Promise<CoreOutPut> {
    const seller = await this.sellerRepository.findOne(
      { user },
      { relations: ['user'] },
    );

    if (!seller) {
      return {
        ok: false,
        err: '등록된 판매자 정보가 없습니다.',
      };
    }

    const ok = await this.sellerRepository.delete({ id: seller.id });

    if (!ok) {
      return {
        ok: false,
        err: '삭제하지 못하였습니다.',
      };
    }

    return {
      ok: true,
    };
  }

  async findPassword(email: string): Promise<CoreOutPut> {
    const user = await this.shopUserRepository.findOne({ email });

    if (!user) {
      return {
        ok: false,
        err: '유저를 찾을수가 없습니다.',
      };
    }

    const newPassword = Math.random().toString(36).slice(2, 7);
    const result = await this.update(user, { password: newPassword });

    if (!result) {
      return {
        ok: false,
        err: '비밀번호를 변경하지 못하였습니다.',
      };
    }

    await this.mailerService.snedFindPasswordMail({
      email,
      password: newPassword,
    });

    return {
      ok: true,
    };
  }
}
