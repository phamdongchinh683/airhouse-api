import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsString()
  userIds: string;
  @IsString()
  message: string;
  @IsNotEmpty()
  @IsBoolean()
  isGroup: boolean;
}
