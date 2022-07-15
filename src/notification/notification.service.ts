import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { Notification } from './entities/Notification.entity';
import { basic64Auth } from '../JwtMiddleware/Jwt.middleware';

import * as webpush from 'web-push';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    const publicKey = process.env.WORKER_PUBLICKEY;
    const privateKey = process.env.WORKER_PRIVATEKEY;

    webpush.setVapidDetails(
      'mailto:example@yourdomain.org',
      publicKey,
      privateKey,
    );
  }

  async pushNotification(data: string) {
    const lists = await this.notificationRepository.find({
      where: { updateAt: Not(IsNull()) },
    });
    // console.log(lists);

    lists.forEach((v) => {
      webpush.sendNotification(JSON.parse(v.endPoint), JSON.stringify(data));
    });
    // webpush.sendNotification(
    //   JSON.parse(pushSubscription),
    //   JSON.stringify(data),
    // );
  }

  async registerEndPoint(data: any) {
    // const pushSubscription = {
    //   endpoint:
    //     'https://fcm.googleapis.com/fcm/send/eAqWKo-AReQ:APA91bFiYGzPhkbUetNWOTTooGFoAeMGx4RVRT1-T63K739BZRw22lE7RcNzclh73HtbVv1HLr_83El0zsiNESn-BKFogijmyHfDnkp-PPnCIFQa6Mnd_9BGAz0TtO_qZkNtsGiS1AR1',
    //   expirationTime: null,
    //   keys: {
    //     p256dh:
    //       'BCdR9oc9MQU9zZ8qAMw-TMH8O-Go7GIvE4fQwwRsKG7Q1ZzpQRat6EYo6O62rnBC6gWyZVi5x_xsGWE75i3vZJA',
    //     auth: 'GYWlxGnrsTg0_Hgw2S1-8Q',
    //   },
    // };

    const {
      keys: { auth },
    } = data.endPoint;
    // console.log(auth);
    const endPoint = JSON.stringify(data.endPoint);
    // console.log(endPoint);

    return await this.notificationRepository.save(
      this.notificationRepository.create({ endPoint, auth }),
    );
  }

  async deleteEndPoint(auth: any) {
    return await this.notificationRepository.delete({ auth });
  }
}
