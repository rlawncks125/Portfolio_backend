import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { authUser } from 'src/auth/authUser.decorator';
import { BasicAuth } from 'src/auth/basicAuth.decorator';
import { basicAuth } from 'src/common/interface';
import { LoginOutPutDto } from './dtos/login.dto';
import { userCreateOutPutDto } from './dtos/userCreate.dto';
import { UserUpdateInputDto } from './dtos/userUpdate.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBasicAuth()
  @ApiOperation({ summary: '로그인 ( login )' })
  @ApiResponse({
    type: LoginOutPutDto,
    status: 200,
  })
  @Get()
  login(@BasicAuth() auth: basicAuth): Promise<LoginOutPutDto> {
    // console.log(auth.username, auth.password);
    return this.userService.login(auth);
  }

  @ApiOperation({ summary: '로그인 토큰 확인' })
  @Get('test')
  @UseGuards(AuthGuard)
  tetUser(@authUser() user: User) {
    const finduser = this.userService.findById(user.id);
    return finduser ? true : false;
  }

  @ApiBasicAuth()
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    type: userCreateOutPutDto,
    status: 200,
  })
  @Post()
  userCreate(@BasicAuth() auth: basicAuth): Promise<userCreateOutPutDto> {
    return this.userService.create(auth);
  }

  @ApiOperation({ summary: '정보 변경 ( userUpdate )' })
  @Patch()
  @UseGuards(AuthGuard)
  userUpdate(@authUser() user: User, @Body() body: UserUpdateInputDto) {
    // console.log(body);
    return this.userService.update(user, body);
  }

  @ApiOperation({ summary: '삭제' })
  @Delete()
  @UseGuards(AuthGuard)
  useDelete(@authUser() user: User) {
    return this.userService.delete(user);
  }
}
