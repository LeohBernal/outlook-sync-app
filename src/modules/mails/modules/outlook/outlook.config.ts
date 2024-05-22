import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';

export const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    authority: 'https://login.microsoftonline.com/common',
  },
});

export const msgpClient = (accessToken: string) =>
  Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

export const commonAuthorizationUrlRequest = {
  scopes: ['user.read', 'mail.read'],
  redirectUri: process.env.AZURE_REDIRECT_URI,
};

export const outlookSubscriptionConfig = {
  changeType: 'created,updated,deleted',
  notificationUrl: process.env.AZURE_NOTIFICATIONS_URI,
  resource: 'me/messages',
  expirationDateTime: new Date(Date.now() + 3600 * 1000).toISOString(),
  clientState: 'OutlookSyncApp',
};
