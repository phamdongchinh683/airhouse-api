import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsString()
  userIds: string;
  @IsSring()
  message: string;
  @IsNotEmpty()
  @IsBoolean()
  isGroup: boolean;
}
