import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ResourceApiResponse,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('parms/:name')
  getNameParms(
    @Body() body: any,
    @Param() parms: any,
    @Request() req: Request,
  ): string {
    console.log(body, parms);

    return this.appService.getHello();
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return this.appService.uploadClouldnary(file);
  }

  @Get('file')
  async getFiles() {
    return this.appService.getFiels();
  }
}
