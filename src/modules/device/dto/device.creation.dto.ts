import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from 'src/global/globalEnum';

export class DeviceCreationDto {
  @IsNotEmpty({ message: 'user id must not be empty' })
  user_id: string;
  @IsNotEmpty({ message: 'device info must not be empty' })
  @IsString()
  device_info: string;
  @IsNotEmpty({ message: 'enum must not be empty' })
  @IsEnum(Status, {
    message: 'Status must be a valid value from: pending, accept, refuse',
  })
  status: Status;
}
