import { Mailbox } from 'src/modules/mails/entity';

export abstract class DatabaseMailboxesService {
  public abstract upsert(mailbox: Mailbox): Promise<Mailbox>;
  public abstract findBySubscriptionId(
    subscriptionId: string,
  ): Promise<Mailbox>;
}
