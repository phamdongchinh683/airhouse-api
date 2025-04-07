import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageUpdateDto {
  @ApiProperty()
  @IsString()
  id: string;
  @ApiProperty()
  @IsString()
  user_id: string;
  @ApiProperty()
  @IsString()
  conversation_id: string;
  @ApiProperty()
  @IsString()
  message_text: string;
}
