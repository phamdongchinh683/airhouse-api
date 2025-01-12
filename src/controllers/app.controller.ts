import { AuthController } from 'src/modules/auth/auth.controller';
import { DeviceController } from 'src/modules/device/device.controller';
import { UserController } from 'src/modules/user/user.controller';

export const appControllers = [
  UserController,
  AuthController,
  DeviceController,
];
