import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {Role} from 'src/common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<Role[]>('role', context.getHandler());
    console.log(requiredRole)
    if (!requiredRole) {
      return true; // No role specified, allow access
    }

    const request = context.switchToHttp().getRequest();

    // console.log('Role request', request.user)

    return requiredRole.some((role) => {
        // console.log(role)
        return request?.user?.roles?.includes(role)
        // return request.user.role
    });
  }
}