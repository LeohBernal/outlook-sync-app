import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { Mail, Mailbox } from './entity';
import { MailboxDTO, GetPlatformMailDTO, MailPlatform } from './dto';
import { OutlookService } from './modules/outlook/outlook.service';

@Injectable()
export class MailsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly outlookService: OutlookService,
  ) {}

  public async upsertMailbox(upsertMailbox: MailboxDTO): Promise<Mailbox> {
    return this.database.mailboxes.upsert(upsertMailbox);
  }

  public async getMailboxBySubscriptionId(
    subscriptionId: string,
  ): Promise<Mailbox> {
    return this.database.mailboxes.findBySubscriptionId(subscriptionId);
  }

  public async getMailboxByUserId(userId: string): Promise<Mailbox> {
    return this.database.mailboxes.findBySubscriptionId(userId);
  }

  public async addMails(
    mails: GetPlatformMailDTO[],
    userId: string,
    mailboxId: string,
  ): Promise<void> {
    return this.database.mails.createMultiple(mails, userId, mailboxId);
  }

  public async updateMail(mail: GetPlatformMailDTO): Promise<void> {
    return this.database.mails.update(mail);
  }

  public async setMailAsDeleted(mailId: string): Promise<void> {
    return this.database.mails.updateIsDeletedById(mailId);
  }

  public async getMail(mailId: string): Promise<Mail> {
    return this.database.mails.findById(mailId);
  }

  public async getPaginatedMailsByMailboxId(
    mailboxId: string,
    page: number,
    size: number,
  ): Promise<Mail[]> {
    return this.database.mails.findPaginatedByMailboxId(mailboxId, page, size);
  }

  public async getPlatformMail(
    token: string,
    id: string,
    platform: MailPlatform,
  ): Promise<GetPlatformMailDTO> {
    if (platform !== MailPlatform.OUTLOOK) {
      throw new Error('Platform not supported');
    }
    return this.outlookService.getMail(token, id);
  }

  public async getAllPlatformMails(
    token: string,
    platform: MailPlatform,
  ): Promise<GetPlatformMailDTO[]> {
    if (platform !== MailPlatform.OUTLOOK) {
      throw new Error('Platform not supported');
    }
    return this.outlookService.getAllMails(token);
  }
}
