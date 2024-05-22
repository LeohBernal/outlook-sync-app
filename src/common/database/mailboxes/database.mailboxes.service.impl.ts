import { Injectable } from '@nestjs/common';
import { client, indexes } from '../database.config';
import { DatabaseMailboxesService } from './database.mailboxes.service';
import { Mailbox } from 'src/modules/mails/entity';

@Injectable()
export class DatabaseMailboxesServiceImpl implements DatabaseMailboxesService {
  private readonly MAILBOXES_INDEX = indexes.mailboxes;

  public async upsert({ id, ...mailbox }: Mailbox): Promise<Mailbox> {
    await client.index({
      index: this.MAILBOXES_INDEX,
      body: mailbox,
      id,
    });
    return {
      ...mailbox,
      id,
    };
  }

  public async findBySubscriptionId(subscriptionId: string): Promise<Mailbox> {
    try {
      const {
        hits: {
          hits: [mailbox],
        },
      } = await client.search<Omit<Mailbox, 'id'>>({
        index: this.MAILBOXES_INDEX,
        body: {
          query: {
            match: {
              'subscription.id': subscriptionId,
            },
          },
        },
      });

      if (!mailbox) {
        return null;
      }

      return {
        ...mailbox._source,
        id: mailbox._id,
      };
    } catch (error) {
      return null;
    }
  }
}
