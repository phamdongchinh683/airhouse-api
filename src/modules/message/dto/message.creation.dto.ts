import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
export class MessageCreationDto {
  @ApiProperty()
  @IsString()
  userId: string;
  @ApiProperty()
  @IsArray()
  messages: Message[];
}

export class Message {
  @ApiProperty()
  @IsString()
  conversationId: string;
  @ApiProperty()
  @IsString()
  messageText: string;
}
