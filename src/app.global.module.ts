import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AppGateway } from './app.gateway';
import { rabbitMQConfig } from './app.config';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: rabbitMQConfig.exchanges.mails.name,
          type: rabbitMQConfig.exchanges.mails.type,
        },
      ],
      uri: rabbitMQConfig.uri,
    }),
  ],
  controllers: [],
  providers: [AppGateway],
  exports: [RabbitMQModule, AppGateway],
})
export class GlobalModule {}
