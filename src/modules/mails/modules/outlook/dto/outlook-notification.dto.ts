import { MailUpdateType } from 'src/modules/mails/dto';

class OutlookNotification {
  subscriptionId: string;
  subscriptionExpirationDateTime: string;
  changeType: MailUpdateType;
  resource: string;
  resourceData: {
    '@odata.type': string;
    '@odata.id': string;
    '@odata.etag': string;
    id: string;
  };
  clientState: string;
  tenantId: string;
}

export class OutlookNotifications {
  value: OutlookNotification[];
}
