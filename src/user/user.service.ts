import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { updateBody } from './user.controller';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(req: Request) {
    const { username, password } = base64Auth(req);

    const user = await this.usersRepository.findOne({
      username,
    });

    console.log(user);

    if (!user) {
      return '없음';
    }
    const checkPassword = await user.checkPassword(password);

    if (!checkPassword) {
      return '비밀번호가 다릅니다.';
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY);

    return {
      ok: true,
      token,
    };
  }

  async create(req: Request) {
    try {
      const { username, password } = base64Auth(req);

      const user = await this.usersRepository.findOne({ username });

      if (user) {
        return '이미 존재함';
      }

      const ok = await this.usersRepository.save(
        this.usersRepository.create({
          username,
          password,
        }),
      );

      if (ok) {
        return 'create';
      }
    } catch (e) {
      return e;
    }
  }

  async update(req: Request, { password, dsc }: updateBody) {
    try {
      //@ts-ignore
      const user = tokenVerify(req.headers.authorization);

      if (!user.ok) {
        return '유요하지 않은 토큰입니다.';
      }

      const findUser = await this.usersRepository.findOne({ id: user.id });

      if (!findUser) {
        return '유저를 찾을수없습니다.';
      }

      const updatePassword = password
        ? await new User().bcryptPassword(password)
        : '';

      const ok = await this.usersRepository.save({
        id: findUser.id,
        ...(password && { password: updatePassword }),
        ...(dsc && { dsc }),
      });

      console.log(ok);
      if (!ok) {
        return '업데이트에 실패했습니다.';
      }

      return 'update';
    } catch (e) {
      return e;
    }
  }

  async delete(req: Request) {
    try {
      //@ts-ignore
      const user = tokenVerify(req.headers.authorization);

      if (!user.ok) {
        return user.err;
      }

      const findUser = await this.usersRepository.findOne({ id: user.id });
      if (!findUser) {
        return '유저가 존재하지않습니다.';
      }

      await this.usersRepository.delete({ id: user.id });

      return 'delete';
    } catch (e) {
      return e;
    }
  }
}

interface auth {
  username: string;
  password: string;
}

const base64Auth = (req: Request): auth => {
  // Basic auth 처리
  //@ts-ignore
  const base64Data = req.headers.authorization.split(' ')[1];
  const detail = Buffer.from(base64Data, 'base64').toString('ascii');
  const data = detail.split(':');
  const [username, password] = data;
  // console.log(data);
  // console.log(username, password);

  return { username, password };
};

const tokenVerify = (
  authorization: string,
): { ok: boolean; err?: string; id?: number } => {
  // `Bearer [Token]` 형식의 토큰처리
  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer')
    return {
      ok: false,
      err: '타입이 다릅니다',
    };

  // console.log(token);
  const user = jwt.verify(token, process.env.JWT_KEY);
  // 토큰변환
  if (!user) {
    return {
      ok: false,
      err: '유효하지않은 토큰입니다.',
    };
  }
  console.log(user);

  return {
    ok: true,
    // @ts-ignore
    id: user.id,
  };
};
