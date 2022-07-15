import { Injectable } from '@nestjs/common';

import nodemailer from 'nodemailer';
import { SendMailInputDto } from './dtos/sendMail.dto';

@Injectable()
export class MailerService {
  #transporter: nodemailer.Transporter;
  constructor() {
    const nodemailer = require('nodemailer');

    this.#transporter = nodemailer.createTransport({
      service: 'gmail.com',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_APP_PASS,
      },
    });
  }

  async sendMail({ toMail, certify, title }: SendMailInputDto) {
    return await this.#transporter.sendMail({
      to: toMail,
      subject: title,
      html: `
      <div style="margin: auto; text-align: center">
      <h1>${toMail} 확인 테스트입니다</h1>
      <div style="border: 1px solid black">
        <p>${toMail}의 사용자가 맞다면 아래 버튼을눌러주세요</p>
        <div style="padding: 1rem">
          <a
            href=${certify}
            style="
              text-decoration: none;
              padding: 0.5rem 1rem;
              color: white;
              background-color: #5959fb;
              border-radius: 1px;
              border-color: white;
            "
          >
            인증
          </a>
        </div>
      </div>
    </div>
      
      `,
    });
  }
}
