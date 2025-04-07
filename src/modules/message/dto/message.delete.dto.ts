import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class MessageDeleteDto {
  @ApiProperty()
  @IsArray()
  ids: string[];
  @ApiProperty()
  @IsString()
  conversationId: string;
}
