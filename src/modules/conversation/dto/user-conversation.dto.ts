import { IsEmail, IsString } from 'class-validator';

export class UserConversation {
  @IsString()
  userId: string;
  @IsEmail()
  userEmail: string;
}
