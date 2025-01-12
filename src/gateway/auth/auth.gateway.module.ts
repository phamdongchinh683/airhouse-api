import { Module } from '@nestjs/common';
import { AuthGateWay } from './auth.gateway';

@Module({
  imports: [AuthGateWay],
})
export class AuthGateWayModule {}
