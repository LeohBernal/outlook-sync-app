import { Injectable } from '@nestjs/common';
import { DatabaseUsersService } from './users';
import { DatabaseMailsService } from './mails';
import { DatabaseMailboxesService } from './mailboxes';

@Injectable()
export class DatabaseService {
  constructor(
    public readonly mails: DatabaseMailsService,
    public readonly users: DatabaseUsersService,
    public readonly mailboxes: DatabaseMailboxesService,
  ) {}
}
