import { GetPlatformMailDTO } from 'src/modules/mails/dto';
import { Mail } from 'src/modules/mails/entity';

export abstract class DatabaseMailsService {
  public abstract createMultiple(
    mails: GetPlatformMailDTO[],
    userId: string,
    mailboxId: string,
  ): Promise<void>;
  public abstract update(mail: GetPlatformMailDTO): Promise<void>;
  public abstract updateIsDeletedById(id: string): Promise<void>;
  public abstract findById(id: string): Promise<Mail>;
  public abstract findPaginatedByMailboxId(
    mailboxId: string,
    page: number,
    size: number,
  ): Promise<Mail[]>;
}
