import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

import * as jwt from 'jsonwebtoken';

export const wsUserId = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    try {
      const socket = context.switchToWs().getClient() as Socket;
      const accessToken = socket.handshake.auth['acces-token'];
      const decoded = jwt.verify(accessToken, process.env.JWT_KEY);

      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const userId: number = decoded['id'];
        return userId;
      }

      // return user;
    } catch (e) {
      return undefined;
    }
  },
);
