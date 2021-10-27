import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';

export interface updateBody {
  password: string;
  dsc: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  login(@Request() req: Request) {
    return this.userService.login(req);
  }

  @Post()
  userCreate(@Request() req: Request) {
    return this.userService.create(req);
  }

  @Patch()
  userUpdate(@Request() req: Request, @Body() body: updateBody) {
    return this.userService.update(req, body);
  }

  @Delete()
  useDelete(@Request() req: Request) {
    return this.userService.delete(req);
  }
}
