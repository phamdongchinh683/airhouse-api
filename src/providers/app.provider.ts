import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';

export const appProviders = [UserService, AuthService];
