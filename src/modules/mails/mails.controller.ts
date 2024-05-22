import { Controller, Get, Query, Session } from '@nestjs/common';
import { MailsService } from './mails.service';
import { SessionData } from 'express-session';
import { Mail } from './entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('mails')
@ApiTags('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Get()
  public getMails(
    @Query('page') page: number,
    @Query('size') size: number,
    @Session() session: SessionData,
  ): Promise<Mail[]> {
    return this.mailsService.getPaginatedMailsByMailboxId(
      session.user.mailboxId,
      page,
      size,
    );
  }
}
