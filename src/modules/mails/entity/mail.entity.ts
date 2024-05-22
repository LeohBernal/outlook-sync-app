import { GetPlatformMailDTO } from '../dto';

export class Mail extends GetPlatformMailDTO {
  isDeleted: boolean;
  userId: string;
  mailboxId: string;
}
