import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Status } from 'src/global/globalEnum';
import { comparePassword, hashPassword } from 'src/helpers/hash.helper';
import { DrizzleAsyncProvider } from 'src/providers/drizzle.provider';
import { user } from 'src/schema/user.schema';
import { v4 as uuidv4 } from 'uuid';
import * as schemas from '../../schema/schema';
import { DeviceService } from '../device/device.service';
import { DeviceCreationDto } from '../device/dto/device.creation.dto';
import { DeviceStatusDto } from '../device/dto/device.status.dto';
import { MailService } from '../mail/mail.service';
import { AuthJwtDto } from './dto/auth.jwt.dto';
import { AuthRecordDto } from './dto/auth.record.dto';
import { AuthLoginDto } from './dto/auth.signin.dto';
import { AuthSignUpDto } from './dto/auth.signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private database: NodePgDatabase<typeof schemas>,
    private jwtService: JwtService,
    private deviceService: DeviceService,
    private mailService: MailService,
  ) {}

  async signIn(
    data: AuthLoginDto,
    req: Request,
    ip: string,
  ): Promise<AuthJwtDto | string> {
    const deviceInfo: string = req.headers['user-agent'] || 'Unknown Device';

    const user = await this.database
      .select({
        id: schemas.user.id,
        password: schemas.user.password,
        role: schemas.user.role,
      })
      .from(schemas.user)
      .where(eq(schemas.user.email, data.email));

    if (!user[0]) {
      return 'This email does not exist';
    }

    const compare: boolean = await comparePassword(
      data.password,
      user[0].password,
    );

    if (!compare) {
      return 'Password is incorrect';
    }

    const recordData: AuthRecordDto = {
      id: uuidv4(),
      user_id: user[0].id,
      ip: ip,
      device_info: deviceInfo,
    };

    const newLoginRecord = await this.database
      .insert(schemas.loginRecord)
      .values(recordData);

    if (newLoginRecord.rowCount === 0) {
      return `Can't record login log`;
    }
    // search device status
    const deviceData: DeviceStatusDto = {
      user_id: user[0].id,
      device_info: deviceInfo,
    };
    // case if user have not been device
    const newApprovedDevice: DeviceCreationDto = {
      user_id: user[0].id,
      device_info: deviceInfo,
      status: Status.Pending,
    };

    const deviceStatus = await this.deviceService.checkDevice(
      deviceData,
      newApprovedDevice,
    );

    switch (deviceStatus) {
      case 'pending':
        return 'Device is pending please contact admin verify device';
      case 'refuse':
        return 'This device is not approved';
      case 'accept':
        const { id, role } = user[0];
        const payload = { sub: id, role: role };
        return {
          token: this.jwtService.sign(payload),
        };
      default:
        await this.mailService.sendRequestDevice(user[0].id);
        return 'Device confirmation requested';
    }
  }

  async register(data: AuthSignUpDto): Promise<string> {
    const password = await hashPassword(data.password);

    const newUser = {
      id: uuidv4(),
      password: password,
      email: data.email,
      phone_number: data.phoneNumber,
      role: data.role,
    };

    const result = await this.database.insert(user).values(newUser);

    if (result.rowCount >= 1) {
      return 'success';
    }
    return 'error';
  }
}
