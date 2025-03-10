import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageCreationDto {
  @ApiProperty()
  @IsString()
  userId?: string;
  @ApiProperty()
  @IsString()
  userEmail: string;
  @ApiProperty()
  @IsString()
  conversationId: string;
  @ApiProperty()
  @IsString()
  messageText: string;
}
