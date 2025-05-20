import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { QueryResult } from 'pg';
import { DrizzleAsyncProvider } from 'src/providers/drizzle.provider';
import { v4 as uuidv4 } from 'uuid';
import * as schemas from '../../schema/schema';
import { DeviceCreationDto } from './dto/device.creation.dto';
import { DeviceStatusDto } from './dto/device.status.dto';
import { DeviceStatusResponseDto } from './dto/device.status.response.dto';

@Injectable()
export class DeviceService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private database: NodePgDatabase<typeof schemas>,
  ) {}

  async createApprovedDevice(
    deviceInfo: DeviceCreationDto,
  ): Promise<QueryResult<never> | string> {
    const newDevice = {
      id: uuidv4(),
      user_id: deviceInfo.user_id,
      device_info: deviceInfo.device_info,
      status: deviceInfo.status,
    };
    const result = await this.database
      .insert(schemas.approvedDevice)
      .values(newDevice);
    if (result.rowCount !== 1) {
      return 'Please check info input device';
    }
  }

  async checkDevice(
    deviceStatus: DeviceStatusDto,
    deviceInfo: DeviceCreationDto,
  ): Promise<DeviceStatusResponseDto[] | string> {
    const result = await this.database
      .select({
        device_info: schemas.approvedDevice.device_info,
        status: schemas.approvedDevice.status,
      })
      .from(schemas.approvedDevice)
      .where(
        and(
          eq(schemas.approvedDevice.device_info, deviceStatus.device_info),
          eq(schemas.approvedDevice.user_id, deviceStatus.user_id),
        ),
      );

    if (result.length === 0) {
      await this.createApprovedDevice(deviceInfo);
      return 'Device has been added for approval';
    }
    return result[0].status;
  }
}
