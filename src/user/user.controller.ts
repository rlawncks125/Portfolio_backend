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
import { AuthGuard } from 'src/auth/auth.guard';
import { authUser } from 'src/auth/authUser.decorator';
import { BasicAuth } from 'src/auth/basicAuth.decorator';
import { basicAuth } from 'src/common/interface';
import { UserUpdateDto } from './dtos/userUpdate.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  login(@BasicAuth() auth: basicAuth) {
    console.log(auth.username, auth.password);
    return this.userService.login(auth);
  }

  @Post()
  userCreate(@BasicAuth() auth: basicAuth) {
    return this.userService.create(auth);
  }

  @Patch()
  @UseGuards(AuthGuard)
  userUpdate(@authUser() user: User, @Body() body: UserUpdateDto) {
    // console.log(user);
    return this.userService.update(user, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  useDelete(@authUser() user: User) {
    return this.userService.delete(user);
  }
}
