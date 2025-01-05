import * as dotenv from 'dotenv';

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { database } from './configs/database.config';
import { configAppModule } from './configs/env.config';
import { JwtConfig } from './configs/jwt.config';
import { appControllers } from './controllers/app.controller';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { appProviders } from './providers/app.provider';
dotenv.config({ debug: false });

@Module({
  imports: [
    TypeOrmModule.forRoot(database()),
    configAppModule,
    JwtConfig,
    UserModule,
    AuthModule,
  ],
  controllers: [...appControllers],
  providers: [
    ...appProviders,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
