import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

import * as jwt from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';

export const wsUserId = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    try {
      const socket = context.switchToWs().getClient() as Socket;
      const accessToken = socket.handshake.auth['token'];
      const decoded = jwt.verify(accessToken, process.env.JWT_KEY);

      //@ts-ignore
      const userId: number = decoded.id;

      // return user;
      return userId;
    } catch (e) {
      return undefined;
      //   throw new WsException('tokenError');
    }
  },
);
