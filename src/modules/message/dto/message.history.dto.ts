import { IsString } from 'class-validator';
export class MessageHistoryDto {
  @IsString()
  id: string;
  @IsString()
  userEmail: string;
  @IsString()
  messageText: string;
  @IsString()
  createdAt: Date;
}
