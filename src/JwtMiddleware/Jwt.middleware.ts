import { NextFunction, Response } from 'express';
import { basicAuth } from 'src/common/interface';
import * as jwt from 'jsonwebtoken';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if ('authorization' in req.headers) {
        const [type, token] = req.headers['authorization'].split(' ');

        if (type === 'Basic') {
          const data = basic64Auth(token);
          // console.log('middleware', data);
          req['authoriztion'] = data;
        } else if (type === 'acces_token') {
          // insomnia auth 보낼시 authorization 에 담김
          const decoded = jwt.verify(token, process.env.JWT_KEY);

          if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
            const user = await this.userService.findById(decoded.id);

            req['user'] = user;
          }
        }
      }

      if ('acces_token' in req.headers) {
        const decoded = jwt.verify(
          req.headers['acces_token'],
          process.env.JWT_KEY,
        );

        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.userService.findById(decoded.id);

          req['user'] = user;
        }
      }
    } catch (e) {}

    next();
  }
}

const basic64Auth = (basic64Data: string): basicAuth => {
  // Basic auth 처리
  const detail = Buffer.from(basic64Data, 'base64').toString('ascii');
  const data = detail.split(':');
  const [username, password] = data;

  return { username, password };
};
