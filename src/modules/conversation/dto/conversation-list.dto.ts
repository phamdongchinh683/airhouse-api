import { IsBoolean, IsString } from 'class-validator';

export class ConversationList {
  @IsString()
  conversationId: string;
  @IsString()
  conversationName: string;
  @IsBoolean()
  isGroup: boolean;
}
