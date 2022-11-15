import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { UserUpdateInputDto } from './dtos/userUpdate.dto';
import { basicAuth } from 'src/common/interface';
import { LoginOutPutDto } from './dtos/login.dto';
import { userCreateOutPutDto } from './dtos/userCreate.dto';
import { AppService } from 'src/app.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly appService: AppService,
  ) {}

  async login({
    username: userNameBase64,
    password,
  }: basicAuth): Promise<LoginOutPutDto> {
    //  base64 디코딩
    const username = Buffer.from(userNameBase64, 'base64').toString();

    const user = await this.usersRepository.findOne({
      where: {
        // 한글 아이디는 front에서 인코딩 해서 보냄
        // insomnia 나 swagger에서 영어아이디 로그인 하기위해
        // 디코딩 안됨 값도 체크 하기위해 In()사용
        username: In([userNameBase64, username]),
      },
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
      user,
    };
  }

  async create({
    username: userNameBase64,
    password,
  }: basicAuth): Promise<userCreateOutPutDto> {
    try {
      if (userNameBase64 === '' || password === '')
        return {
          ok: false,
          err: '빈값이 있습니다.',
        };

      // base64 디코딩
      const username = Buffer.from(userNameBase64, 'base64').toString();

      const user = await this.usersRepository.findOne({ username });

      // console.log(username, userNameBase64);
      if (user) {
        return {
          ok: false,
          err: '이미 존재함',
        };
      }

      // const ok = await this.usersRepository.save(
      const ok = await this.usersRepository.insert(
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

  async update(user: User, { password, dsc, avatar }: UserUpdateInputDto) {
    try {
      if (!user) {
        return '유저를 찾을수없습니다.';
      }

      if (avatar && new RegExp(/res.cloudinary.com/g).test(user.avatar)) {
        // 클라우드 이미지 삭제
        // 삭제할 파일 이름 만 추출하는 작업
        console.log('이미지삭제');
        const imageURL = user.avatar.split('/').pop()?.split('.')[0];

        await this.appService.deleteClouldnaryByFileName(imageURL);
      }

      dsc && (user.dsc = dsc);
      avatar && (user.avatar = avatar);
      user.updateAt = new Date();

      if (password) {
        user.password = password;
        user.hashPassword();
      }

      // if (!password) {
      //   user.updateAt = new Date();
      // }

      // const ok = password
      //   ? await this.usersRepository.save(user)
      //   : await this.usersRepository.update(user.id, {
      //       ...user,
      //     });

      const ok = await this.usersRepository.update(user.id, {
        ...user,
      });

      if (!ok) {
        return {
          ok: false,
          err: '업데이트에 실패했습니다.',
        };
      }

      const newUser = await this.usersRepository.findOne({ id: user.id });

      return {
        ok: true,
        user: newUser,
      };
    } catch (e) {
      return {
        ok: false,
        err: e,
      };
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

  async myApprovalWaitRooms(user: User) {
    return await this.usersRepository.findOne(user.id, {
      relations: ['approvalWaitRooms'],
    });
  }
}
