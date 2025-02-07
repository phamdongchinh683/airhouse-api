import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateBuildingDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'project_code is too short',
  })
  @MaxLength(10, {
    message: 'project_code is too long',
  })
  projectCode: string;
  @ApiProperty()
  @IsNotEmpty()
  buildingImage: string;
  @ApiProperty()
  @IsNotEmpty()
  address: string;
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  sharedFacilities: string;
  @ApiProperty()
  @IsNotEmpty()
  commission: string;
  @ApiProperty()
  @IsNotEmpty()
  costs: string;
  @ApiProperty()
  @IsNotEmpty()
  source: string;
  @ApiProperty()
  @IsNotEmpty()
  note: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  roomQuantity: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  roomAvailable: number;
}
