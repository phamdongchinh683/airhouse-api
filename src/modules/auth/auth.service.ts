import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { comparePassword, hashPassword } from 'src/helpers/hash.helper';
import { DrizzleAsyncProvider } from 'src/providers/drizzle.provider';
import { user } from 'src/schema/user.schema';
import { v4 as uuidv4 } from 'uuid';
import * as schemas from '../../schema/schema';
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
  ) {}

  async signIn(
    data: AuthLoginDto,
    req: Request,
    ip: string,
  ): Promise<AuthJwtDto> {
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';

    const user = await this.database
      .select()
      .from(schemas.user)
      .where(eq(schemas.user.email, data.email));
    const compare = await comparePassword(data.password, user[0].password);

    if (!user[0] || !compare) {
      throw new UnauthorizedException('Email or Password is incorrect');
    }

    const dataRecord: AuthRecordDto = {
      id: uuidv4(),
      user_id: user[0].id,
      ip: ip,
      device_info: deviceInfo,
    };

    const newRecord = await this.database
      .insert(schemas.loginRecord)
      .values(dataRecord);

    if (!newRecord) {
      throw new Error(`Could not device info`);
    }

    const { id, role } = user[0];
    const payload = { sub: id, role: role };
    return {
      token: this.jwtService.sign(payload),
    };
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
    if (result) {
      return 'success';
    }
    return 'error';
  }
}
