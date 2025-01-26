import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
export class MessageCreationDto {
  @ApiProperty()
  @IsString()
  userId: string;
  @ApiProperty()
  @IsArray()
  messages: MessageList[];
}

export class MessageList {
  @ApiProperty()
  @IsString()
  conversationId: string;
  @ApiProperty()
  @IsString()
  messageText: string;
}
