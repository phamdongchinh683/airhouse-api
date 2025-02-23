import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteBuildingByIdsDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
