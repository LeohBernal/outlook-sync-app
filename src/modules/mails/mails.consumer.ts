import { Injectable } from '@nestjs/common';
import { MailboxDTO, MailUpdateDTO, MailUpdateType } from './dto';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MailsService } from './mails.service';
import { AppGateway } from '../../app.gateway';
import { gatewayConfig, rabbitMQConfig } from 'src/app.config';

@Injectable()
export class MailsConsumer {
  constructor(
    private readonly mailsService: MailsService,
    private readonly appGateway: AppGateway,
  ) {}

  @RabbitSubscribe({
    exchange: rabbitMQConfig.exchanges.mails.name,
    routingKey: rabbitMQConfig.exchanges.mails.queue.sync.routingKey,
    queue: rabbitMQConfig.exchanges.mails.queue.sync.name,
  })
  public async sync(message: MailboxDTO): Promise<void> {
    const [mailbox, mails] = await Promise.all([
      this.mailsService.upsertMailbox(message),
      this.mailsService.getAllPlatformMails(
        message.token.value,
        message.platform,
      ),
    ]);
    await this.mailsService.addMails(mails, mailbox.userId, mailbox.id);

    this.appGateway.server.emit(mailbox.userId, {
      topic: gatewayConfig.topics.outlook,
      payload: 'synced',
    });
  }

  @RabbitSubscribe({
    exchange: rabbitMQConfig.exchanges.mails.name,
    routingKey: rabbitMQConfig.exchanges.mails.queue.update.routingKey,
    queue: rabbitMQConfig.exchanges.mails.queue.update.name,
  })
  public async updateMail(message: MailUpdateDTO): Promise<void> {
    const mailbox = await this.mailsService.getMailboxBySubscriptionId(
      message.subscriptionId,
    );

    if (message.updateType === MailUpdateType.DELETED) {
      await this.mailsService.setMailAsDeleted(message.mailId);
    } else {
      await this.handleUpdatedOrCreatedMail(message);
    }

    const updatedMail = await this.mailsService.getMail(message.mailId);

    this.appGateway.server.emit(mailbox.userId, {
      topic: gatewayConfig.topics.mail,
      payload: updatedMail,
    });
  }

  private async handleUpdatedOrCreatedMail(
    message: MailUpdateDTO,
  ): Promise<void> {
    const mailbox = await this.mailsService.getMailboxBySubscriptionId(
      message.subscriptionId,
    );

    const mail = await this.mailsService.getPlatformMail(
      mailbox.token.value,
      message.mailId,
      mailbox.platform,
    );

    // If the email was not found, it means it was deleted after the notification was sent.
    if (!mail) {
      await this.mailsService.setMailAsDeleted(message.mailId);
      return;
    }

    if (message.updateType === MailUpdateType.UPDATED) {
      await this.mailsService.updateMail(mail);
      return;
    }

    if (message.updateType === MailUpdateType.CREATED) {
      await this.mailsService.addMails([mail], mailbox.userId, mailbox.id);
      return;
    }
  }
}
