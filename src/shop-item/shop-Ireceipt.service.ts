import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { Repository } from 'typeorm';
import {
  CreateIreceiptInputDto,
  CreateIreceiptOutPutDto,
} from './dtos/create-ireceipt.dto';
import { ShopIreceipt } from './eitities/shop-ireceipt.entity';

@Injectable()
export class ShopIreceiptService {
  constructor(
    @InjectRepository(ShopIreceipt)
    private readonly ireceipRepository: Repository<ShopIreceipt>,
    private readonly appService: AppService,
  ) {}

  async createIreceiptService({}: CreateIreceiptInputDto): Promise<CreateIreceiptOutPutDto> {
    // await this.ireceipRepository.save(this.ireceipRepository.create({

    // }))

    return {
      ok: false,
    };
  }
}
