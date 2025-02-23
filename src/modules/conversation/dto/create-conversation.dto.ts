import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsString()
  userIds: string;
  @IsNotEmpty()
  @IsString()
  conversationName: string;
  @IsNotEmpty()
  @IsString()
  message: string;
  @IsNotEmpty()
  @IsBoolean()
  isGroup: boolean;
}
