import { CacheInterceptor } from '@nestjs/cache-manager';
import { ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthService } from 'src/modules/auth/auth.service';
import { ConversationService } from 'src/modules/conversation/conversation.service';
import { DeviceService } from 'src/modules/device/device.service';
import { MailService } from 'src/modules/mail/mail.service';
import { MessageService } from 'src/modules/message/message.service';
import { UserService } from 'src/modules/user/user.service';

export const appProviders = [
  UserService,
  AuthService,
  DeviceService,
  MailService,
  MessageService,
  ConversationService,
  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  },
];
