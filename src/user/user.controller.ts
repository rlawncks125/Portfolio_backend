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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { authUser } from 'src/auth/authUser.decorator';
import { BasicAuth } from 'src/auth/basicAuth.decorator';
import { basicAuth } from 'src/common/interface';
import { LoginOutPutDto } from './dtos/login.dto';
import { UserUpdateDto } from './dtos/userUpdate.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    type: LoginOutPutDto,
    status: 200,
  })
  @Get()
  login(@BasicAuth() auth: basicAuth): Promise<LoginOutPutDto> {
    // console.log(auth.username, auth.password);
    return this.userService.login(auth);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  userCreate(@BasicAuth() auth: basicAuth) {
    return this.userService.create(auth);
  }

  @ApiOperation({ summary: '정보 변경' })
  @Patch()
  @UseGuards(AuthGuard)
  userUpdate(@authUser() user: User, @Body() body: UserUpdateDto) {
    // console.log(user);
    return this.userService.update(user, body);
  }

  @ApiOperation({ summary: '삭제' })
  @Delete()
  @UseGuards(AuthGuard)
  useDelete(@authUser() user: User) {
    return this.userService.delete(user);
  }
}
