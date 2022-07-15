import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ShopAuthGuard } from 'src/auth/auth.guard';
import { ShopRoles } from 'src/auth/roles.decorator';
import { SendMailInputDto } from './dtos/sendMail.dto';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerSerivce: MailerService) {}

  @ShopRoles(['admin'])
  @UseGuards(ShopAuthGuard)
  @Post()
  sendMail(@Body() body: SendMailInputDto) {
    return this.mailerSerivce.sendMail(body);
  }
}
