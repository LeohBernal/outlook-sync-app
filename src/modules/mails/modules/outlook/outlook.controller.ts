import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { OutlookService } from './outlook.service';
import { Response } from 'express';
import { SessionData } from 'express-session';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { OutlookNotifications } from './dto';
import { MailPlatform, MailUpdateDTO, MailboxDTO } from '../../dto';
import { rabbitMQConfig } from 'src/app.config';
import { outlookSubscriptionConfig } from './outlook.config';
import { ApiTags } from '@nestjs/swagger';

@Controller('outlook')
@ApiTags('outlook')
export class OutlookController {
  constructor(
    private readonly outlookService: OutlookService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Get('/signin')
  public async signIn(@Res() res: Response): Promise<void> {
    const url = await this.outlookService.getAuthCodeUrl();
    res.redirect(url);
  }

  @Get('/redirect')
  public async redirect(
    @Query('code') code: string,
    @Res() res: Response,
    @Session() session: SessionData,
  ): Promise<void> {
    const authResult = await this.outlookService.acquireTokenByCode(code);
    await this.outlookService.deleteAllPreviousSubscriptions(
      authResult.accessToken,
    );
    const subscription = await this.outlookService.createSubscription(
      authResult.accessToken,
    );

    const mailbox: MailboxDTO = {
      address: authResult.account.username,
      token: {
        value: authResult.accessToken,
        expiresOn: authResult.expiresOn.toISOString(),
      },
      id: authResult.uniqueId,
      platform: MailPlatform.OUTLOOK,
      userId: session.user.id,
      subscription: {
        id: subscription.id,
        expiresOn: subscription.expirationDateTime,
      },
    };
    session.user.mailboxId = mailbox.id;

    this.amqpConnection.publish(
      rabbitMQConfig.exchanges.mails.name,
      rabbitMQConfig.exchanges.mails.queue.sync.routingKey,
      mailbox,
    );

    res.redirect('/account.html');
  }

  @Post('notifications')
  async handleNotification(
    @Body() notifications: OutlookNotifications,
    @Query('validationToken') validationToken: string,
  ): Promise<any> {
    if (validationToken) {
      return validationToken;
    }

    notifications.value.forEach((notification) => {
      if (notification.clientState !== outlookSubscriptionConfig.clientState) {
        return;
      }
      const mailUpdate: MailUpdateDTO = {
        mailId: notification.resourceData.id,
        updateType: notification.changeType,
        subscriptionId: notification.subscriptionId,
        platform: MailPlatform.OUTLOOK,
      };
      this.amqpConnection.publish(
        rabbitMQConfig.exchanges.mails.name,
        rabbitMQConfig.exchanges.mails.queue.update.routingKey,
        mailUpdate,
      );
    });
  }
}
