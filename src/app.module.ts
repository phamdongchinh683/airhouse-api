import * as dotenv from 'dotenv';

import { CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { configAppModule } from './configs/env.config';
import { JwtConfig } from './configs/jwt.config';
import { RedisOptions } from './configs/redis.config';
import { appControllers } from './controllers/app.controller';
import { ChatGateWayModule } from './gateway/chat/chat.gateway.module';
import { ForgotPasswordMiddleware } from './middlewares/forgot-password.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { AwsModule } from './modules/aws/aws.module';
import { BuildingModule } from './modules/building/building.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
import { HistoryModule } from './modules/history/history.module';
import { MailModule } from './modules/mail/mail.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { appProviders } from './providers/app.provider';
import { DeviceModule } from './modules/device/device.module';

dotenv.config({ debug: false });

@Module({
  imports: [
    configAppModule,
    CacheModule.registerAsync({
      isGlobal: true,
      ...RedisOptions,
    }),
    JwtConfig,
    UserModule,
    AuthModule,
    DrizzleModule,
    MailModule,
    DeviceModule,
    AwsModule,
    ConversationModule,
    MessageModule,
    ChatGateWayModule,
    BuildingModule,
    HistoryModule,
  ],
  controllers: [...appControllers],
  providers: [...appProviders],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(ForgotPasswordMiddleware).forRoutes({
      path: 'api/v1/auth/forgot-password',
      method: RequestMethod.PATCH,
    });
  }
}
