import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Res,
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
import { Response } from 'express';
import { AppService, SubWayType } from './app.service';

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
    return this.appService.uploadClouldnaryByfile(file);
  }

  @Delete('file/:fileName')
  async deleteFile(@Param() { fileName }: { fileName: string }) {
    return this.appService.deleteClouldnaryByFileName(fileName);
  }

  @Get('file')
  async getFiles() {
    return this.appService.getFiels();
  }

  @Get('subway')
  async getSubway(
    @Res() res: Response,
    @Body() { type }: { type: SubWayType },
  ) {
    return this.appService.getSubWaySchedule(res, type);
  }
}
