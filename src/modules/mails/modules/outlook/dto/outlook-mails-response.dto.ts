class EmailAddress {
  name: string;
  address: string;
}

class Recipient {
  emailAddress: EmailAddress;
}

export class OutlookMailResponse {
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  receivedDateTime: string;
  sentDateTime: string;
  hasAttachments: boolean;
  subject: string;
  body: {
    contentType: string;
    content: string;
  };
  sender: Recipient;
  from: Recipient;
  toRecipients: Recipient[];
  ccRecipients: Recipient[];
  bccRecipients: Recipient[];
  replyTo: Recipient[];
  isRead: boolean;
  flag: {
    flagStatus: string;
  };
}

export class OutlookMailsResponse {
  value: OutlookMailResponse[];
  '@odata.nextLink'?: string;
}
