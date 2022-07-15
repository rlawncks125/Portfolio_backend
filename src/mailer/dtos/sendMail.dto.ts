import { IsString } from 'class-validator';

export class SendMailInputDto {
  @IsString()
  toMail: string;

  @IsString()
  certify: string;

  @IsString()
  title: string;
}
