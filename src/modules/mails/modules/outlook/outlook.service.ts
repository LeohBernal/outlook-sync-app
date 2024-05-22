import { Injectable } from '@nestjs/common';
import {
  msalClient,
  commonAuthorizationUrlRequest,
  msgpClient,
  outlookSubscriptionConfig,
} from './outlook.config';
import { AuthenticationResult } from '@azure/msal-node';
import { GetPlatformMailDTO } from '../../dto';
import {
  OutlookMailsResponse,
  OutlookMailResponse,
  OutlookSubscription,
} from './dto';

@Injectable()
export class OutlookService {
  constructor() {}

  private readonly SELECT_FIELDS =
    'id,subject,sender,isRead,flag,receivedDateTime';

  public async getAuthCodeUrl(): Promise<string> {
    return msalClient.getAuthCodeUrl(commonAuthorizationUrlRequest);
  }

  public async acquireTokenByCode(code: string): Promise<AuthenticationResult> {
    return msalClient.acquireTokenByCode({
      code: code,
      ...commonAuthorizationUrlRequest,
    });
  }

  public async createSubscription(token: string): Promise<OutlookSubscription> {
    const response = await msgpClient(token)
      .api('/subscriptions')
      .post(outlookSubscriptionConfig);
    return response;
  }

  public async deleteAllPreviousSubscriptions(token: string) {
    const subscriptions = await msgpClient(token).api('/subscriptions').get();
    const promises = subscriptions.value.map((subscription) =>
      msgpClient(token).api(`/subscriptions/${subscription.id}`).delete(),
    );
    await Promise.all(promises);
  }

  public async getAllMails(token: string): Promise<GetPlatformMailDTO[]> {
    const outlookMails: OutlookMailsResponse['value'] = [];

    const firstResponse: OutlookMailsResponse = await msgpClient(token)
      .api('/me/messages')
      .select(this.SELECT_FIELDS)
      .top(1000)
      .get();
    outlookMails.push(...firstResponse.value);

    let endpoint = firstResponse['@odata.nextLink'];
    do {
      const response: OutlookMailsResponse = await msgpClient(token)
        .api(endpoint)
        .get();
      outlookMails.push(...response.value);
      endpoint = response['@odata.nextLink'];
    } while (endpoint);

    return outlookMails.map((mail) => this.formatMail(mail));
  }

  public async getMail(
    token: string,
    mailId: string,
  ): Promise<GetPlatformMailDTO> {
    try {
      const mail: OutlookMailResponse = await msgpClient(token)
        .api(`/me/messages/${mailId}`)
        .select(this.SELECT_FIELDS)
        .get();

      return this.formatMail(mail);
    } catch (error) {
      return null;
    }
  }

  private formatMail(mail: OutlookMailResponse): GetPlatformMailDTO {
    return {
      id: mail.id,
      subject: mail.subject,
      sender: mail.sender
        ? {
            name: mail.sender.emailAddress.name,
            address: mail.sender.emailAddress.address,
          }
        : null,
      isRead: !!mail.isRead,
      isFlagged: mail.flag?.flagStatus === 'flagged' ? true : false,
      receivedDateTime: mail.receivedDateTime,
    };
  }
}
