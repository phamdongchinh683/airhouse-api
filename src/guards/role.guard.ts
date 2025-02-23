import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/global/globalEnum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<Role>('roles', context.getHandler());
    if (!role) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return role.includes(user.role);
  }
}
