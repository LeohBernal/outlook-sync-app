import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './modules/users';
import { AuthUserMiddleware } from './common/middlewares';
import { MailsModule } from './modules/mails';
import { GlobalModule } from './app.global.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    GlobalModule,
    UsersModule,
    MailsModule,
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthUserMiddleware)
      .exclude('/', '/health', '/api', '/users(.*)', '/outlook/notifications')
      .forRoutes('*');
  }
}
