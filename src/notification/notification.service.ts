import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import {
  Notification,
  NotificationPayLoad,
} from './entities/Notification.entity';
import { basic64Auth } from '../JwtMiddleware/Jwt.middleware';

import * as webpush from 'web-push';
import {
  RegistersubscriptionInputDto,
  RegistersubscriptionOutPutDto,
} from './dtos/register.dto';
import {
  RegistersubscriptionUserInputDto,
  RegistersubscriptionUserOutPutDto,
} from './dtos/register-user.dto';
import {
  ClearRegisterInputDto,
  ClearRegisterOutPutDto,
} from './dtos/clear-subscription.dto';
import {
  ClearRegisterUserInputDto,
  ClearRegisterUserOutPutDto,
} from './dtos/clear-user.dto';
import {
  PatchListerNotificationInputDto,
  PatchListerNotificationOutPutDto,
} from './dtos/patchListerNotification.dto';

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
      webpush.sendNotification(
        JSON.parse(v.subscription),
        JSON.stringify(data),
      );
    });
    // webpush.sendNotification(
    //   JSON.parse(pushSubscription),
    //   JSON.stringify(data),
    // );
  }

  /** 웹 푸쉬 알람 보내기*/
  async pushNotificationByUserId(
    userId: string | number,
    data: NotificationPayLoad,
  ) {
    console.log(userId, data);

    const lists = await this.notificationRepository.find({
      where: { userId: +userId, isPush: true },
    });
    // console.log(lists);

    const temp = [];

    lists.forEach((v) => {
      temp.push(
        webpush.sendNotification(
          JSON.parse(v.subscription),
          JSON.stringify(data),
        ),
      );
    });
    // console.log(temp);

    await Promise.all(temp);
  }

  /** 구독 등록*/
  async registersubscription(
    data: RegistersubscriptionInputDto,
  ): Promise<RegistersubscriptionOutPutDto> {
    // const pushSubscription = {
    //   subscription:
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
    } = data.subscription;
    // console.log(auth);
    const subscription = JSON.stringify(data.subscription);
    // console.log(subscription);

    const ok = await this.notificationRepository.save(
      this.notificationRepository.create({ subscription, auth }),
    );

    if (!ok) {
      return {
        ok: false,
        err: '등록에 실패하였습니다.',
      };
    }

    return {
      ok: true,
    };
  }

  /** 구독 유저 등록 */
  async registerSubscriptionUser({
    auth,
    userId,
  }: RegistersubscriptionUserInputDto): Promise<RegistersubscriptionUserOutPutDto> {
    const notification = await this.notificationRepository.findOne({
      where: { auth },
    });
    notification.userId = +userId;

    const ok = await this.notificationRepository.update(
      notification.id,
      notification,
    );

    if (ok.affected === 0) {
      return {
        ok: false,
        err: '업데이트 되지 않았습니다.',
      };
    }

    return {
      ok: true,
    };
  }

  /** 구독 유저 등록 해제 */
  async removeRegisterSubscriptionUser({
    auth,
  }: ClearRegisterUserInputDto): Promise<ClearRegisterUserOutPutDto> {
    const notification = await this.notificationRepository.findOne({
      where: { auth },
    });

    const ok = await this.notificationRepository.update(notification.id, {
      userId: null,
    });

    if (ok.affected === 0) {
      return {
        ok: false,
      };
    }

    return {
      ok: true,
    };
  }

  /** 구독 해제 */
  async deletesubscription(auth: string): Promise<ClearRegisterOutPutDto> {
    const ok = await this.notificationRepository.delete({ auth });

    console.log(ok);

    if (ok.affected === 0) {
      return {
        ok: false,
      };
    }

    return {
      ok: true,
    };
  }

  /** 알림 설정 변경 */
  async patchListerNotification({
    auth,
  }: PatchListerNotificationInputDto): Promise<PatchListerNotificationOutPutDto> {
    const notification = await this.notificationRepository.findOne({
      where: {
        auth,
      },
    });

    const ok = await this.notificationRepository.update(notification.id, {
      isPush: !notification.isPush,
    });

    if (ok.affected === 0) {
      return {
        ok: false,
      };
    }

    return {
      ok: true,
      isPusb: !notification.isPush,
    };
  }

  async getIsPush(auth: string) {
    const notification = await this.notificationRepository.findOne({
      where: {
        auth,
      },
    });

    if (!notification) {
      return false;
    }

    return notification.isPush;
  }
}
