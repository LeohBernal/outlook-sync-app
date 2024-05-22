export class MailUpdateDTO {
  mailId: string;
  updateType: MailUpdateType;
  subscriptionId: string;
  platform: string;
}

export enum MailUpdateType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
}
