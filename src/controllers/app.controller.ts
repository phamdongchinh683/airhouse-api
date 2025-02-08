import { AuthController } from 'src/modules/auth/auth.controller';
import { AwsController } from 'src/modules/aws/aws.controller';
import { BuildingController } from 'src/modules/building/building.controller';
import { DeviceController } from 'src/modules/device/device.controller';
import { UserController } from 'src/modules/user/user.controller';

export const appControllers = [
  UserController,
  AuthController,
  DeviceController,
  BuildingController,
  AwsController,
];
