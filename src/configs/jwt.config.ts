import { JwtModule } from '@nestjs/jwt';
import { jwtConstants, tokenLife } from 'src/utils/constants.util';
export const JwtConfig = JwtModule.register({
  global: true,
  secret: jwtConstants.secret,
  signOptions: { expiresIn: tokenLife },
});
