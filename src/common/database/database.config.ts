import { Client } from '@elastic/elasticsearch';

export const client = new Client({
  node: process.env.ELASTICSEARCH_URI,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});

export const indexes = {
  users: 'users',
  mails: 'mails',
  mailboxes: 'mailboxes',
};
