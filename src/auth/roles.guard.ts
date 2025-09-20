import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<('doctor'|'patient')[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}
