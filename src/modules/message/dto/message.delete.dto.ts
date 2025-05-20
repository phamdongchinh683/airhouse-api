import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageDeleteDto {
  @ApiProperty()
  @IsString()
  id: string;
  @ApiProperty()
  @IsString()
  conversationId: string;
}
