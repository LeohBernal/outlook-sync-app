export const rabbitMQConfig = {
  uri: process.env.RABBITMQ_URI,
  exchanges: {
    mails: {
      name: 'mails',
      type: 'topic',
      queue: {
        sync: {
          name: 'mails_sync_queue',
          routingKey: 'sync',
        },
        update: {
          name: 'mails_update_queue',
          routingKey: 'update',
        },
      },
    },
  },
};

export const gatewayConfig = {
  topics: {
    mail: 'mail',
    outlook: 'outlook',
  },
};
