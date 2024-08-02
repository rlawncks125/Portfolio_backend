import { Injectable } from '@nestjs/common';

import nodemailer from 'nodemailer';
import { SendMailInputDto } from './dtos/sendMail.dto';

@Injectable()
export class MailerService {
  #transporter: nodemailer.Transporter;
  constructor() {
    const nodemailer = require('nodemailer');

    // Stalwart 로 띄운 메일서버 연결
    // TLS 설정 x 일시
    // this.#transporter = nodemailer.createTransport({
    //   host: 'mail.ngng.site',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.MAIL_EMAIL,
    //     pass: process.env.MAIL_APP_PASS,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });

    // gmail 연결
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

    this.#transporter.verify((err, success) => {
      if (err) console.log('실패', err);
      if (success) console.log('성공', success);
    });
  }

  async sendMail({ toMail, certify, title }: SendMailInputDto) {
    return await this.#transporter.sendMail({
      to: toMail,
      subject: title,
      // from: 'ngng-주찬 <juchan2@ngng.site>',
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

  async snedFindPasswordMail({
    useId,
    email,
    password,
  }: {
    useId: string;
    email: string;
    password: string;
  }) {
    return await this.#transporter.sendMail({
      to: email,
      subject: '임시 비밀번호를 발송 하였습니다.',
      html: `
      <div style="margin: auto; text-align: center">
      <h1>${useId} 고객님</h1>
      <h1>변경된 패스워드로 로그인 해주세요</h1>
      <div style="border: 1px solid black">
        <h1>${password}</h1>
        <div style="padding: 1rem">
          <a
            href=https://nuxt-shop.kimjuchan97.xyz/login
            style="
              text-decoration: none;
              padding: 0.5rem 1rem;
              color: white;
              background-color: #5959fb;
              border-radius: 1px;
              border-color: white;
            "
          >
            로그인 하러 하기
          </a>
        </div>
      </div>
    </div>
      
      `,
    });
  }
}
