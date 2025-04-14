import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AuthService } from 'src/modules/auth/auth.service';
import { AwsService } from 'src/modules/aws/aws.service';
import { BuildingService } from 'src/modules/building/building.service';
import { ConversationService } from 'src/modules/conversation/conversation.service';
import { DeviceService } from 'src/modules/device/device.service';
import { HistoryModule } from 'src/modules/history/history.module';
import { MailService } from 'src/modules/mail/mail.service';
import { MessageService } from 'src/modules/message/message.service';
import { UserService } from 'src/modules/user/user.service';

export const appProviders = [
  AuthService,
  UserService,
  DeviceService,
  MailService,
  MessageService,
  ConversationService,
  BuildingService,
  AwsService,
  HistoryModule,
  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
];
