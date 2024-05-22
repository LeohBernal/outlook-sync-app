export enum MailPlatform {
  OUTLOOK = 'outlook',
}

export class MailboxDTO {
  id: string;
  address: string;
  token: {
    value: string;
    expiresOn: string;
  };
  platform: MailPlatform;
  userId: string;
  subscription: {
    id: string;
    expiresOn: string;
  };
}
