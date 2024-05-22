import { Module } from '@nestjs/common';
import { DatabaseUsersServiceImpl, DatabaseUsersService } from './users';
import { DatabaseService } from './database.service';
import { DatabaseMailsService, DatabaseMailsServiceImpl } from './mails';
import {
  DatabaseMailboxesService,
  DatabaseMailboxesServiceImpl,
} from './mailboxes';

@Module({
  imports: [],
  controllers: [],
  providers: [
    DatabaseService,
    {
      provide: DatabaseUsersService,
      useClass: DatabaseUsersServiceImpl,
    },
    {
      provide: DatabaseMailsService,
      useClass: DatabaseMailsServiceImpl,
    },
    {
      provide: DatabaseMailboxesService,
      useClass: DatabaseMailboxesServiceImpl,
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
