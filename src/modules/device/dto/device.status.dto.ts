import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceStatusDto {
  @IsNotEmpty({ message: 'user id must not be empty' })
  user_id: string;
  @IsNotEmpty({ message: 'device info must not be empty' })
  @IsString()
  device_info: string;
}
