import { Module } from '@nestjs/common';
import { OutlookModule } from './modules/outlook';
import { DatabaseModule } from 'src/common/database';
import { MailsService } from './mails.service';
import { MailsConsumer } from './mails.consumer';
import { MailsController } from './mails.controller';

@Module({
  imports: [OutlookModule, DatabaseModule],
  controllers: [MailsController],
  providers: [MailsService, MailsConsumer],
  exports: [],
})
export class MailsModule {}
